import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createConnection, RowDataPacket } from 'mysql2/promise';

import { App, BlockAction, OverflowAction, ButtonAction, AuthorizeResult, ExpressReceiver, ExternalSelectAction, ViewOutput } from '@slack/bolt'
import { View } from '@slack/types'
import { globalActions, blockActions, optionValues } from './config/actions'
import { displayRevisionsModal, retrieveAllTermsOptions, displayResultModal, displaySearchModal, displayBlockedGuestModal } from './global-actions/read'
import { displayAddTermModal, storeDefinitionFromModal, ModalStatePayload } from './global-actions/write'
import { modalCallbacks, modalFields } from './config/views';
import { displayRemovalConfirmationModal, removeTerm, displaySuccessfulRemovalModal } from './global-actions/remove';
import { displayUpdateTermModal, updateDefinitionFromModal } from './global-actions/update';
import databaseConfig from './config/database';
import homepageRouter from './web/homepage';
import appInstalledRouter from './web/app_installed';


const authorizeFn = async ({ teamId, enterpriseId }: { teamId: string, enterpriseId?: string | undefined }): Promise<AuthorizeResult> => {
    // Fetch team info from database
    const connection = await createConnection(databaseConfig);
    const [rows, { }] = await connection.query(
        'SELECT * from tokens WHERE team_id = ? LIMIT 1',
        [teamId, enterpriseId]
    );
    if ((rows as RowDataPacket[]).length > 0) {
        connection.end();
        return {
            botToken: (rows as RowDataPacket[])[0].bot_token,
            botUserId: (rows as RowDataPacket[])[0].bot_user_id,
            botId: (rows as RowDataPacket[])[0].bot_user_id
        }
    }
    throw new Error('No matching authorizations');
}

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET as string, endpoints: '/slack/events' });

const app = new App({
    authorize: authorizeFn,
    receiver: receiver,
});

// Express setup to handle non-bolt routings
receiver.app.use(express.json());
receiver.app.use(express.urlencoded({ extended: false }));

// Non-bolt routes. Think landing page, install success page etc
receiver.app.get('/', homepageRouter);
receiver.app.get('/app_installed', appInstalledRouter);

// eslint-disable-next-line @typescript-eslint/camelcase
app.shortcut({ callback_id: 'shortcuts_phrase_search' }, async ({ ack, context, body }) => {
    ack();
    console.log('run.globalshortcut');
    const user = await app.client.users.info({
        token: context.botToken,
        user: body.user.id
    });
    const blockGuestUsage: boolean = process.env.BLOCK_GUEST_USAGE == 'true' ? true : false; 
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if ((user.user.is_restricted || user.user.is_ultra_restricted) && blockGuestUsage) {
        await displayBlockedGuestModal(context.botToken, body.trigger_id);
        return;
    }
    await displaySearchModal(context.botToken, body.trigger_id);
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.options({ block_id: modalFields.searchTerm }, async ({ payload, ack }) => {
    const options = await retrieveAllTermsOptions(payload.value);
    // TODO The app doesn't use non-block selects anywhere, so we need to make sure the types
    // can handle that. Until then, disable the check.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ack({ options });
})

// eslint-disable-next-line @typescript-eslint/camelcase
app.view({ callback_id: modalCallbacks.searchForTerm }, async ({ ack, view, body, context }) => {
    console.log('modal.searchForTerm');
    const state = view.state as ModalStatePayload;
    const castBody = body as unknown as BlockAction;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const term = state.values[modalFields.searchTerm][modalFields.searchTerm].selected_option;
    if (term && body.view) {
        displayResultModal(context.botToken, castBody.trigger_id, term.value, body.view.id).then((viewPayload) => {
            ack(
                {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    response_action: 'update',
                    view: viewPayload as View
                }
              );
      
        })
    } else {
        ack();
    }

    return;
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ type: 'block_actions', action_id: blockActions.searchTypeahead }, async ({ ack, context, body }) => {
    ack();
    const option = body.actions[0] as ExternalSelectAction;
    if (option.selected_option && option.selected_option.value && body.view) {
        const requestedTerm = option.selected_option.value || '';
        await displayResultModal(context.botToken, body.trigger_id, requestedTerm, (body.view as unknown as ViewOutput).id);
    }

});

app.command(`/${globalActions.define}`, async ({ command, ack, context }) => {
    ack();
    console.log('run.slashcommand');
    const user = await app.client.users.info({
        token: context.botToken,
        user: command.user_id
    });
    const blockGuestUsage: boolean = process.env.BLOCK_GUEST_USAGE == 'true' ? true : false; 
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if ((user.user.is_restricted || user.user.is_ultra_restricted) && blockGuestUsage) {
        await displayBlockedGuestModal(context.botToken, command.trigger_id);
        return;
    }    
    
    if (command.text.length > 0) {
        await displayResultModal(context.botToken, command.trigger_id, command.text);
    } else {
        await displaySearchModal(context.botToken, command.trigger_id);
    }
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ type: 'block_actions', block_id: blockActions.addATerm }, ({ ack, context, body }) => {
    ack();
    displayAddTermModal(context.botToken, body.trigger_id, (body.view as unknown as ViewOutput).id)
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ type: 'block_actions', action_id: blockActions.addATerm }, ({ ack, context, body }) => {
    ack();
    const term = (body.actions[0] as unknown as ButtonAction).value;
    displayAddTermModal(context.botToken, body.trigger_id, (body.view as unknown as ViewOutput).id, term)
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.searchForTerm }, ({ ack }) => {
    ack();
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.clearMessage }, ({ ack, respond, body }) => {
    ack();
    respond({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        channel: body.channel!.id,
        text: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        delete_original: true
    });
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ type: 'block_actions', action_id: blockActions.termOverflowMenu }, ({ ack, payload, context, body }) => {
    ack();
    const castPayload = payload as unknown as OverflowAction;
    const actionValue = castPayload.selected_option.value;
    const actionSplit = actionValue.split('-', 2);
    const viewID = (body.view as unknown as ViewOutput).id;
    switch (actionSplit[0]) {
        case optionValues.updateTerm:
            displayUpdateTermModal(context.botToken, body.trigger_id, actionSplit[1], viewID)
            break;
        case optionValues.revisionHistory:
            displayRevisionsModal(context.botToken, body.trigger_id, actionSplit[1], viewID).catch(
                error => {
                    console.log(error);
                });
            break;
        case optionValues.removeTerm:
            displayRemovalConfirmationModal(
                actionSplit[1],
                context.botToken,
                body.trigger_id,
                viewID);
            break;
        default:
            console.error(`Unknown option value: ${actionSplit[0]}`);
    }
})

app.view(modalCallbacks.createModal, ({ ack, body, context }) => {
    const castBody = body as unknown as BlockAction;
    ack();
    console.log('modal.termCreated');
    storeDefinitionFromModal(body.view.state as ModalStatePayload, body.user.id, castBody.trigger_id, context.botToken);
});

app.view(modalCallbacks.confirmRemovalModal, ({ ack, body, context }) => {
    ack();
    const castBody = body as unknown as BlockAction;
    const metadata = JSON.parse(body.view.private_metadata);
    removeTerm(metadata.term).then(() => {
        console.log('modal.SuccesfulRemoval');
        // eslint-disable-next-line @typescript-eslint/camelcase
        displaySuccessfulRemovalModal(metadata['term'], context.botToken, castBody.trigger_id);
    });
});

app.view(modalCallbacks.updateTermModal, ({ ack, body, context }) => {
    ack();
    const metadata = JSON.parse(body.view.private_metadata);
    const castBody = body as unknown as BlockAction;
    updateDefinitionFromModal(metadata.storedTerm, body.view.state as ModalStatePayload, body.user.id, castBody.trigger_id, context.botToken);
});

(async (): Promise<void> => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();