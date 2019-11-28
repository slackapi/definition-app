import { Block, PlainTextElement } from "@slack/types";
import { globalActions, blockActions } from "../config/actions";
import { modalCallbacks } from "../config/views";
import { section, divider, actionButton, actions, context, input } from '../utils/block-builder'

interface MessagePayload {
    text: string,
    blocks: Block[]
}

interface ViewsPayload {
    type: "modal",
    callback_id: string,
    title: PlainTextElement,
    blocks: Block[],
    submit?: PlainTextElement
}

export function emptyQueryView(): MessagePayload {
    return {
        text: `Please provide a search term, for example - \`/${globalActions.define} OKR\``,
        blocks: [
            section(':warning: You didn\'t specify a term to search for'),
            divider(),
            section(`You can use \`/${globalActions.define}\` to search for the definition of terms used by your company. What would you like to do?`),
            actions([
                actionButton('Add a term', blockActions.addATerm),
                actionButton('Search for a term', blockActions.searchForTerm),
                actionButton('Cancel', blockActions.clearMessage),
            ],
                blockActions.searchOrAdd)
        ]
    }
}

export function undefinedTermView(term: string): MessagePayload {
    return {
        text: `There is currently no definition for the term ${term}`,
        blocks: [
            section(`:question: There is currently no definition for the term ${term}`),
            divider(),
            section(`Would you like to add one?`),
            actions(
                [
                    actionButton('Yes', blockActions.addATerm),
                    actionButton('No', blockActions.clearMessage),
                ],
            )
        ]
    }
}

export function definitionResultView(term: string, definition: string, authorID: string, lastUpdateTS: Date): MessagePayload {
    return {
        text: `${term}`,
        blocks: [
            section(`*${term}*\n${definition}`),
            context(`*Author*: <@${authorID}> *When*: <!date^${lastUpdateTS.getTime() / 1000}^{date_pretty}|${lastUpdateTS.getTime() / 1000}>`)
        ]
    }
}

export function addTermModalView(): ViewsPayload {
    return {
        type: "modal",
        submit: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: modalCallbacks.createModal,
        title: {
            text: "Add a new term",
            type: "plain_text"
        },
        blocks: [
            input('Term', 'new-term', 'The term you want to define'),
            input('Definition', 'new-definition', 'The definition of the term', true)
        ]
    }
}