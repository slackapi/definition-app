import { createConnection } from "mysql2/promise";
import databaseConfig from "../config/database";
import { App } from "@slack/bolt";
import { confirmRemovalView, successfulRemovalView } from "../slack-views/views";

export async function removeTerm(term: string): Promise<void> {

    const connection = await createConnection(databaseConfig);

    await connection.execute(
        'DELETE from definitions where term = ?',
        [term]
    ).then(() => {
        console.log('success!')
        connection.end();
        return Promise.resolve('Term Removed');
    }).catch((error) => {
        console.log(error);
        connection.end();
        return Promise.reject(error);
    });
}

export function displayRemovalConfirmationModal(term: string, botToken: string, triggerID: string): void {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });

    app.client.views.open({
        token: botToken,
        view: confirmRemovalView(term),
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID
    }).catch(error => {
        console.error(error);
    })
    
}

export function displaySuccessfulRemovalModal(term: string, botToken: string, triggerID: string): void {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });

    app.client.views.open({
        token: botToken,
        view: successfulRemovalView(term),
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID
    }).catch(error => {
        console.error(error);
    })
    
}