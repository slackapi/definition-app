import dotenv from 'dotenv';
dotenv.config();

import { App, BlockAction } from '@slack/bolt'

import { globalActions, blockActions } from './config/actions'

import { definition } from './global-actions/read'
import { displayModal, storeDefinitionFromModal, ModalStatePayload } from './global-actions/write'
import { modalCallbacks } from './config/views';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command(`/${globalActions.define}`, ({command, ack, respond}) => {
    ack();
    respond(definition(command.text));
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({action_id: blockActions.addATerm}, ({ack, context, body}) => {
    ack();
    const castBody = body as unknown as BlockAction; // TODO why does TypeScript not support trigger_id on body?
    displayModal(app, context.botToken, castBody.trigger_id)
});

// eslint-disable-next-line @typescript-eslint/camelcase
app.action({action_id: blockActions.searchForTerm}, ({ack}) => {
    ack();
});

app.view(modalCallbacks.createModal, ({ack, body}) => {
    ack();
    storeDefinitionFromModal(body.view.state as ModalStatePayload, body.team.id, body.user.id);
});

(async () : Promise<void> => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
  })();