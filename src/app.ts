import dotenv from 'dotenv';
dotenv.config();

import { App, BlockAction, OverflowAction, ButtonAction, StaticSelectAction } from '@slack/bolt'

import { globalActions, blockActions, optionValues } from './config/actions'

import { definition, displayRevisionsModal, retrieveAllTermsOptions } from './terms/read'
import { displayAddTermModal, storeDefinitionFromModal, ModalStatePayload } from './terms/write'
import { modalCallbacks } from './config/views';
import { displayRemovalConfirmationModal, removeTerm, displaySuccessfulRemovalModal } from './terms/remove';
import request from 'request';
import { displayUpdateTermModal, updateDefinitionFromModal } from './terms/update';
import { displayAddTagModal, storeTagDefinitionFromModal } from './tags/write';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.options({action_id: blockActions.searchTypeahead}, async ({payload, ack}) => {
    const options = await retrieveAllTermsOptions(payload.value);
    // TODO The app doesn't use non-block selects anywhere, so we need to make sure the types
    // can handle that. Until then, disable the check.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ack({options});
})

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({action_id: blockActions.searchTypeahead}, ({payload, ack, respond}) => {
    ack();
    const castPayload = payload as StaticSelectAction;
    definition(castPayload.selected_option.value).then(result => {
        respond(result)
    }).catch(response => {
        respond(response);
    })});

app.command(`/${globalActions.define}`, ({ command, ack, respond }) => {
    ack();
    definition(command.text).then(result => {
        respond(result)
    }).catch(response => {
        respond(response);
    })
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.addATerm }, ({ ack, context, body, respond }) => {
    ack();
    const castBody = body as unknown as BlockAction;
    respond({
        channel: body.channel.id,
        text: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        delete_original: true
    });
    displayAddTermModal(context.botToken, castBody.trigger_id, (castBody.actions[0] as ButtonAction).value)
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.addATag }, ({ ack, context, body, respond }) => {
    ack();
    const castBody = body as unknown as BlockAction;
    respond({
        channel: body.channel.id,
        text: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        delete_original: true
    });
    displayAddTagModal(context.botToken, castBody.trigger_id, (castBody.actions[0] as ButtonAction).value)
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.searchForTerm }, ({ ack }) => {
    ack();
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.clearMessage }, ({ ack, respond, body }) => {
    ack();
    respond({
        channel: body.channel.id,
        text: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        delete_original: true
    });
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.termOverflowMenu }, ({ ack, payload, context, body }) => {
    ack();
    const castBody = body as unknown as BlockAction;
    const castPayload = payload as unknown as OverflowAction; 
    const actionValue = castPayload.selected_option.value;
    const actionSplit = actionValue.split('-', 2);
    switch (actionSplit[0]) {
        case optionValues.updateTerm:
            displayUpdateTermModal(context.botToken, castBody.trigger_id, actionSplit[1], castBody.response_url)
            break;
        case optionValues.revisionHistory:
            displayRevisionsModal(context.botToken, castBody.trigger_id, actionSplit[1])
            break;
        case optionValues.removeTerm:
            displayRemovalConfirmationModal(
                actionSplit[1],
                context.botToken,
                castBody.trigger_id,
                castBody.response_url);
            break;
        default:
            console.error(`Unknown option value: ${actionSplit[0]}`);
    }
})

app.view(modalCallbacks.createTagModal, ({ ack, body, context }) => {
    const castBody = body as unknown as BlockAction;
    ack();
    storeTagDefinitionFromModal(body.view.state as ModalStatePayload, body.user.id, castBody.trigger_id, context.botToken);
});

app.view(modalCallbacks.createTermModal, ({ ack, body, context }) => {
    const castBody = body as unknown as BlockAction;
    ack();
    storeDefinitionFromModal(body.view.state as ModalStatePayload, body.user.id, castBody.trigger_id, context.botToken);
});

app.view(modalCallbacks.confirmRemovalModal, ({ ack, body, context }) => {
    ack();
    const castBody = body as unknown as BlockAction;
    const metadata = JSON.parse(body.view.private_metadata);
    removeTerm(metadata.term).then(() => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        request.post(metadata['responseURL'], {json: { delete_original: true }});
        displaySuccessfulRemovalModal(metadata['term'], context.botToken, castBody.trigger_id);
    });
});

app.view(modalCallbacks.updateTermModal, ({ack, body, context}) => {
    ack();
    const metadata = JSON.parse(body.view.private_metadata);
    const castBody = body as unknown as BlockAction;
    updateDefinitionFromModal(metadata.storedTerm, body.view.state as ModalStatePayload, body.user.id, castBody.trigger_id, context.botToken, metadata.responseURL);
});

(async (): Promise<void> => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();