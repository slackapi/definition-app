import { App } from "@slack/bolt";
import { addTermModalView, successFullyAddedTermView } from '../slack-views/views'
import { modalFields } from "../config/views";
import { createConnection, RowDataPacket } from "mysql2/promise";
import databaseConfig from "../config/database";

export interface ModalStatePayload {
    values: {
        [key: string]: {
            [key: string]: {
                type: string,
                value: string
            }
        }
    }
}

export async function checkForExistingTerm(term: string): Promise<boolean> { // TODO Move this to a generic class
    const connection = await createConnection(databaseConfig);

    await connection.query(
        'SELECT count(*) from definitions where term = ?',
        [term]
    ).then(async ([rows]) => {
        connection.end();
        if ((rows as RowDataPacket)[0] > 0) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }).catch(error => {
        console.error(error);
    });

    return Promise.resolve(false);

}

async function addNewTerm(term: string, definition: string, teamID: string, authorID: string): Promise<void> {
    const connection = await createConnection(databaseConfig);
    const creationDate = new Date();
    const newTermObject = {
        term,
        definition,
        teamID,
        authorID,
        revision: 1,
        created: creationDate,
        updated: creationDate,
    }
    connection.execute(
        'INSERT into definitions SET term = ?, definition = ?, team_id = ?, author_id = ?, revision = ?, created = ?, updated = ?',
        [
            newTermObject.term,
            newTermObject.definition,
            newTermObject.teamID,
            newTermObject.authorID,
            newTermObject.revision,
            newTermObject.created,
            newTermObject.updated
        ]
    ).then(() => {
        console.log('success!')
        connection.end();
        return Promise.resolve('Term Added');
    }).catch((error) => {
        console.log(error);
        connection.end();
        return Promise.reject(error);
    });

}

export function displayModal(botToken: string, triggerID: string): void {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: addTermModalView()
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export function storeDefinitionFromModal(statePayload: ModalStatePayload, teamID: string, authorID: string, triggerID: string, token: string): void {
    const term = statePayload.values[modalFields.newTerm][modalFields.newTerm].value;
    const definition = statePayload.values[modalFields.newDefinition][modalFields.newDefinition].value;
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    checkForExistingTerm(term).then((result) => {
        if (result) {
            console.log('Existing entry found');
        } else {
            console.log(`Adding ${term} as ${definition}`);
            addNewTerm(term, definition, teamID, authorID).then(() => {
                // eslint-disable-next-line @typescript-eslint/camelcase
                app.client.views.open({ trigger_id: triggerID, view: successFullyAddedTermView(term, definition), token: token }).catch(error => {
                    console.error(error);
                });
            });
        }
    })

}

