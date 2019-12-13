import { createConnection, RowDataPacket } from "mysql2/promise";
import databaseConfig from "../config/database";
import { App } from "@slack/bolt";
import { ModalStatePayload } from "../terms/write";
import { addTagModalView, successFullyAddedTagView } from "../slack-views/views";
import { modalFields } from "../config/views";

export interface TagObject {
    tagName: string,
    creatorID: string,
    created: Date,
    updated: Date,
}

export async function checkForExistingTag(tag: string): Promise<boolean> { // TODO Move this to a generic class
    const connection = await createConnection(databaseConfig);

    return await connection.query(
        'SELECT count(*) from tags where tag_name = ?',
        [tag]
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

async function addNewTag(tag: string, creatorID: string): Promise<TagObject> {
    const connection = await createConnection(databaseConfig);
    const creationDate = new Date();
    const newTagObject = {
        tagName: tag,
        creatorID,
        created: creationDate,
        updated: creationDate,
    }
    return await connection.execute(
        'INSERT into tags SET tag_name = ?, creator_id = ?, created = ?, updated = ?',
        [
            newTagObject.tagName,
            newTagObject.creatorID,
            newTagObject.created,
            newTagObject.updated
        ]
    ).then(() => {
        connection.end();
        return Promise.resolve(newTagObject);
    }).catch((error) => {
        console.log(error);
        connection.end();
        return Promise.reject(error);
    });

}

export function displayAddTagModal(botToken: string, triggerID: string, tag?: string): void {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: addTagModalView(tag)
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export function storeTagDefinitionFromModal(statePayload: ModalStatePayload, authorID: string, triggerID: string, token: string): void {
    const tag = statePayload.values[modalFields.newTag][modalFields.newTag].value;
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    checkForExistingTag(tag).then((result) => {
        if (result) {
            console.log('Existing entry found');
        } else {
            console.log(`Adding ${tag}`);
            addNewTag(tag, authorID).then((tagObject) => {
                // eslint-disable-next-line @typescript-eslint/camelcase
                app.client.views.open({ trigger_id: triggerID, view: successFullyAddedTagView(tagObject.tagName, tagObject.creatorID, tagObject.created), token: token }).catch(error => {
                    console.error(error);
                });
            });
        }
    })

}