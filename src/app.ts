import dotenv from 'dotenv';
dotenv.config();

import { App } from '@slack/bolt'

import { globalActions, blockActions } from './config/actions'

import { definition } from './global-actions/read'

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command(`/${globalActions.define}`, ({command, ack, respond}) => {
    ack();
    respond(definition(command.text));
});

app.action({action_id: blockActions.add_a_term}, ({ack}) => {
    ack();
});

app.action({action_id: blockActions.search_for_term}, ({ack}) => {
    ack();
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
  })();