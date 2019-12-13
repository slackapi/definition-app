import { App } from "@slack/bolt";
import { updateTermView, successFullyAddedTermView, definitionResultView } from "../slack-views/views";
import { retrieveDefinition, TermFromDatabase } from "./read";
import { createConnection } from "mysql2/promise";
import databaseConfig from "../config/database";
import { ModalStatePayload, checkForExistingTerm, TermObject } from "./write";
import { modalFields } from "../config/views";
import request from 'request';


export async function displayUpdateTermModal(botToken: string, triggerID: string, term: string, responseURL: string): Promise<void> {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });

    const storedTerm = await retrieveDefinition(term)
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: updateTermView(storedTerm, responseURL)
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export async function updateTerm(term: string, newDefinition: string, currentRevision: number, newAuthorID: string): Promise<TermObject> {
    const connection = await createConnection(databaseConfig);
    const creationDate = new Date();
    const newTermObject = {
        term,
        definition: newDefinition,
        authorID: newAuthorID,
        revision: currentRevision + 1,
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
        console.log('success!')
        connection.end();
        return Promise.resolve(newTermObject);
    }).catch((error) => {
        console.log(error);
        connection.end();
        return Promise.reject(error);
    });
}

export function updateDefinitionFromModal(storedTerm: TermFromDatabase, statePayload: ModalStatePayload, authorID: string, triggerID: string, token: string, responseURL: string): void {
    const definition = statePayload.values[modalFields.newDefinition][modalFields.newDefinition].value;
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    checkForExistingTerm(storedTerm.term).then((result) => {
        if (result) {
            updateTerm(storedTerm.term, definition, storedTerm.revision, authorID).then((newTermObject) => {
                console.log(newTermObject);
                // eslint-disable-next-line @typescript-eslint/camelcase
                const view = definitionResultView(newTermObject.term, newTermObject.definition, newTermObject.authorID, new Date(newTermObject.updated));
                request.post(responseURL,
                    {
                        json: 
                            {
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                replace_original: true,
                                blocks: view.blocks,
                                text: view.text
                            }
                        

                    }
                )
                // eslint-disable-next-line @typescript-eslint/camelcase
                app.client.views.open({ trigger_id: triggerID, view: successFullyAddedTermView(newTermObject.term, newTermObject.definition, newTermObject.authorID, new Date(newTermObject.updated), true), token: token }).catch(error => {
                    console.error(error);
                });
            });
        }
    })

}