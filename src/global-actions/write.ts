import { App } from "@slack/bolt";
import { addTermModalView } from '../slack-views/views'

export function displayModal(app: App, bot_token: string, trigger_id: string) : void {
    app.client.views.open({
        token: bot_token,
        trigger_id,
        view: addTermModalView()
    }).then().catch(error => console.log(JSON.stringify(error, null, 2)));
}