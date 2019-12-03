import dotenv from 'dotenv';
dotenv.config();

import { App, BlockAction, OverflowAction, ButtonAction } from '@slack/bolt'

import { globalActions, blockActions, optionValues } from './config/actions'

import { definition } from './global-actions/read'
import { displayAddTermModal, storeDefinitionFromModal, ModalStatePayload } from './global-actions/write'
import { modalCallbacks } from './config/views';
import { displayRemovalConfirmationModal, removeTerm, displaySuccessfulRemovalModal } from './global-actions/remove';
import request from 'request';
import { displayUpdateTermModal, updateDefinitionFromModal } from './global-actions/update';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command(`/${globalActions.define}`, ({ command, ack, respond }) => {
    ack();
    definition(command.text, command.team_id).then(result => {
        respond(result)
    }).catch(response => {
        respond(response);
    })
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({ action_id: blockActions.addATerm }, ({ ack, context, body, respond }) => {
    ack();
    const castBody = body as unknown as BlockAction; // TODO why does TypeScript not support trigger_id on body?
    respond({
        channel: body.channel.id,
        text: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        delete_original: true
    });
    displayAddTermModal(context.botToken, castBody.trigger_id, (castBody.actions[0] as ButtonAction).value)
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
    const castBody = body as unknown as BlockAction; // TODO why does TypeScript not support trigger_id on body?
    const castPayload = payload as unknown as OverflowAction; // TODO why does TypeScript not support trigger_id on body?
    const actionValue = castPayload.selected_option.value;
    const actionSplit = actionValue.split('-', 2);
    switch (actionSplit[0]) {
        case optionValues.updateTerm:
            displayUpdateTermModal(context.botToken, castBody.trigger_id, actionSplit[1], body.team.id)
            break;
        case optionValues.removeTerm:
            displayRemovalConfirmationModal(
                actionSplit[1],
                context.botToken,
                castBody.trigger_id,
                castBody.response_url,
                body.team.id);
            break;
        default:
            console.error(`Unknown option value: ${actionSplit[0]}`);
    }
})

app.view(modalCallbacks.createModal, ({ ack, body, context }) => {
    const castBody = body as unknown as BlockAction; // TODO why does TypeScript not support trigger_id on body?
    ack();
    storeDefinitionFromModal(body.view.state as ModalStatePayload, body.team.id, body.user.id, castBody.trigger_id, context.botToken);
});

app.view(modalCallbacks.confirmRemovalModal, ({ ack, body, context }) => {
    ack();
    const castBody = body as unknown as BlockAction; // TODO why does TypeScript not support trigger_id on body?
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
    const castBody = body as unknown as BlockAction; // TODO why does TypeScript not support trigger_id on body?
    updateDefinitionFromModal(metadata, body.view.state as ModalStatePayload, castBody.trigger_id, context.botToken);
});

(async (): Promise<void> => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();