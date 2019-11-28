import { App } from "@slack/bolt";
import { addTermModalView } from '../slack-views/views'
import { modalFields } from "../config/views";

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

export function displayModal(app: App, botToken: string, triggerID: string): void {
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: addTermModalView()
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}

export function storeDefinitionFromModal(viewPayload: ModalStatePayload): void {
    const term = viewPayload.values[modalFields.newTerm][modalFields.newTerm];
    const definition = viewPayload.values[modalFields.newDefinition][modalFields.newDefinition];
    console.log(term.value);
    console.log(definition.value);
}