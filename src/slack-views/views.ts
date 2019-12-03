import { Block, PlainTextElement } from "@slack/types";
import { globalActions, blockActions, optionValues } from "../config/actions";
import { modalCallbacks } from "../config/views";
import { section, divider, actionButton, actions, context, plainTextInput, sectionWithOverflow, option } from '../utils/block-builder'
import { TermFromDatabase } from "../global-actions/read";

interface MessagePayload {
    text: string,
    blocks: Block[]
}

interface ViewsPayload {
    type: "modal",
    callback_id: string,
    title: PlainTextElement,
    blocks: Block[],
    submit?: PlainTextElement,
    private_metadata?: string,
    close?: PlainTextElement
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
                    actionButton('Yes', blockActions.addATerm, undefined, term),
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
            sectionWithOverflow(
                `*${term}*\n${definition}`, 
                [
                    option('Update', `${optionValues.updateTerm}-${term}`),
                    option('Remove', `${optionValues.removeTerm}-${term}`)
                ],
                blockActions.termOverflowMenu),
            context(`*Author*: <@${authorID}> *When*: <!date^${lastUpdateTS.getTime() / 1000}^{date_pretty}|${lastUpdateTS.getTime() / 1000}>`)
        ]
    }
}

export function updateTermView(storedTerm: TermFromDatabase) : ViewsPayload {
    return {
        type: "modal",
        submit: {
            type: 'plain_text',
            text: 'Update',
            emoji: true
        },
        close: {
            type: 'plain_text',
            text: 'Cancel',
            emoji: true
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        private_metadata: JSON.stringify(storedTerm),
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: modalCallbacks.updateTermModal,
        title: {
            text: `Update ${storedTerm.term}`,
            type: "plain_text"
        },
        blocks: [
            plainTextInput(`Definition of ${storedTerm.term}`, 'new-definition', `The definition of ${storedTerm.term}`, true, storedTerm.definition)
        ]
    }
}

export function addTermModalView(term?: string): ViewsPayload {
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
            plainTextInput('Term', 'new-term', 'The term you want to define', false, term),
            plainTextInput('Definition', 'new-definition', 'The definition of the term', true)
        ]
    }
}

export function successFullyAddedTermView(term: string, definition: string): ViewsPayload {
    return {
        type: "modal",
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: modalCallbacks.successfulTermModal,
        title: {
            text: `${term} added`,
            type: "plain_text"
        },
        blocks: [
            section(`We've added ${term} to your company definitions`),
            divider(),
            section(`*${term}*\n${definition}`),
        ]
    }
}

export function confirmRemovalView(term: string, responseURL: string): ViewsPayload {
    return {
        type: "modal",
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: modalCallbacks.confirmRemovalModal,
        submit: {
            type: 'plain_text',
            text: 'Remove',
            emoji: true
        },
        close: {
            type: 'plain_text',
            text: 'Keep',
            emoji: true
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        private_metadata: JSON.stringify({term, responseURL}),
        title: {
            text: `Remove term`,
            type: "plain_text"
        },
        blocks: [
            section(`Are you sure you want to remove the term _${term}_? *This cannot be undone*.`),
        ]
    }
}

export function successfulRemovalView(term: string): ViewsPayload {
    return {
        type: "modal",
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: modalCallbacks.successfulTermModal,
        title: {
            text: `${term} removed`,
            type: "plain_text"
        },
        blocks: [
            section(`We've removed ${term} from your company definitions`),
        ]
    }
}

export function errorModal(): ViewsPayload {
    return {
        type: "modal",
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: "",
        title: {
            text: `Unknown error`,
            type: "plain_text"
        },
        blocks: [
            section(`Something went wrong, we're looking into it`),
        ]
    }
}