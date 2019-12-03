import { App } from "@slack/bolt";
import { updateTermView, successFullyAddedTermView } from "../slack-views/views";
import { retrieveDefinition, TermFromDatabase } from "./read";
import { createConnection } from "mysql2/promise";
import databaseConfig from "../config/database";
import { ModalStatePayload, checkForExistingTerm } from "./write";
import { modalFields } from "../config/views";


export async function displayUpdateTermModal(botToken: string, triggerID: string, term: string, teamID: string): Promise<void> {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });

    const storedTerm = await retrieveDefinition(term, teamID)
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: updateTermView(storedTerm)
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export async function updateTerm(term: string, newDefinition: string, currentRevision: number, newAuthorID: string, teamID: string) : Promise<void> {
    const connection = await createConnection(databaseConfig);
    const creationDate = new Date();
    const newTermObject = {
        term,
        definition: newDefinition,
        teamID,
        authorID: newAuthorID,
        revision: currentRevision + 1,
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

export function updateDefinitionFromModal(storedTerm: TermFromDatabase, statePayload: ModalStatePayload, triggerID: string, token: string): void {
    const definition = statePayload.values[modalFields.newDefinition][modalFields.newDefinition].value;
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    checkForExistingTerm(storedTerm.term, storedTerm.teamID).then((result) => {
        if (result) {
            updateTerm(storedTerm.term, definition, storedTerm.revision, storedTerm.authorID, storedTerm.teamID).then(() => {
                // eslint-disable-next-line @typescript-eslint/camelcase
                app.client.views.open({ trigger_id: triggerID, view: successFullyAddedTermView(storedTerm.term, definition), token: token }).catch(error => {
                    console.error(error);
                });
            });
        }
    })

}