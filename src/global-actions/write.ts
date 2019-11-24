import { App } from "@slack/bolt";
import { addTermModalView } from '../slack-views/views'

export function displayModal(app: App, botToken: string, triggerID: string) : void {
    app.client.views.open({
        token: botToken,
        // eslint-disable-next-line @typescript-eslint/camelcase
        trigger_id: triggerID,
        view: addTermModalView()
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}