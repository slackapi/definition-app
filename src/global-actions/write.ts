import { App } from "@slack/bolt";
import { addTermModalView } from '../slack-views/views'
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

async function checkForExistingTerm(term: string): Promise<void> {
    const connection = await createConnection(databaseConfig);

    await connection.query(
        'SELECT count(*) from definitions where term = ?',
        [term]
    ).then(async ([rows]) => {
        if ((rows as RowDataPacket)[0] > 0) {
            return Promise.resolve();
        }
        return Promise.reject();
    });

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
    await connection.execute(
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
    }).catch((error) => {
        console.log(error);
        connection.end();
    });

}
export function displayModal(app: App, botToken: string, triggerID: string): void {
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: addTermModalView()
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export function storeDefinitionFromModal(statePayload: ModalStatePayload, teamID: string, authorID: string): void {
    const term = statePayload.values[modalFields.newTerm][modalFields.newTerm].value.toLowerCase();
    const definition = statePayload.values[modalFields.newDefinition][modalFields.newDefinition].value.toLowerCase();
    checkForExistingTerm(term).then(() => {
        console.log('Existing entry found');
    }).catch(() => {
        console.log('good to add term');
        console.log(`Adding ${term} as ${definition}`);
        addNewTerm(term, definition, teamID, authorID);
    })

}

