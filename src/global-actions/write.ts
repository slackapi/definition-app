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

export interface TermObject {
    term: string,
    definition: string,
    authorID: string,
    revision: number,
    created: Date,
    updated: Date,
}

export async function checkForExistingTerm(term: string): Promise<boolean> { // TODO Move this to a generic class
    const connection = await createConnection(databaseConfig);

    return await connection.query(
        'SELECT count(*) from definitions where term = ?',
        [term]
    ).then(async ([rows]) => {
        connection.end();
        if ((rows as RowDataPacket)[0]['count(*)'] > 0) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);

    }).catch(error => {
        console.error(error);
        return Promise.reject(error);
    });

}

async function addNewTerm(term: string, definition: string, authorID: string): Promise<TermObject> {
    const connection = await createConnection(databaseConfig);
    const creationDate = new Date();
    const newTermObject = {
        term,
        definition,
        authorID,
        revision: 1,
        created: creationDate,
        updated: creationDate,
    }
    return await connection.execute(
        'INSERT into definitions SET term = ?, definition = ?, author_id = ?, revision = ?, created = ?, updated = ?',
        [
            newTermObject.term,
            newTermObject.definition,
            newTermObject.authorID,
            newTermObject.revision,
            newTermObject.created,
            newTermObject.updated
        ]
    ).then(() => {

        connection.end();
        return Promise.resolve(newTermObject);
    }).catch((error) => {
        console.log(error);
        connection.end();
        return Promise.reject(error);
    });

}

export function displayAddTermModal(botToken: string, triggerID: string, term?: string): void {
    const app = new App({
        token: botToken,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: addTermModalView(term)
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export function storeDefinitionFromModal(statePayload: ModalStatePayload, authorID: string, triggerID: string, token: string): void {
    const term = statePayload.values[modalFields.newTerm][modalFields.newTerm].value;
    const definition = statePayload.values[modalFields.newDefinition][modalFields.newDefinition].value;
    const app = new App({
        token: token,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    checkForExistingTerm(term).then((result) => {
        if (result) {
            console.log('Existing entry found');
        } else {
            console.log(`Adding ${term} as ${definition}`);
            addNewTerm(term, definition, authorID).then((termObject) => {
                // eslint-disable-next-line @typescript-eslint/camelcase
                app.client.views.open({ trigger_id: triggerID, view: successFullyAddedTermView(termObject.term, termObject.definition, termObject.authorID, termObject.created), token: token }).catch(error => {
                    console.error(error);
                });
            });
        }
    })

}

