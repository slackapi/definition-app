import dotenv from 'dotenv';
dotenv.config();

import { App } from '@slack/bolt'

import { globalActions } from './config/actions'

import { definition } from './global-actions/read'

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command(`/${globalActions.define}`, ({command, ack, respond}) => {
    ack();
    if (command.text.length > 0) {
        respond(definition(command.text));
    } else {
        respond({text: `Please provide a search term, for example - \`/${globalActions.define} OKR\``});
    }
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
  })();