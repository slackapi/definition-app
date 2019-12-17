import { Block, PlainTextElement } from "@slack/types";
import { globalActions, blockActions, optionValues } from "../config/actions";
import { modalCallbacks } from "../config/views";
import { section, divider, actionButton, actions, context, plainTextInput, sectionWithOverflow, option, actionSelectExternal } from '../utils/block-builder'
import { TermFromDatabase } from "../global-actions/read";
import { buildModal } from "../utils/view-builder";

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
            section(`You can search for a term by typing \`/${globalActions.define}\` followed by the term you searching for or using the typeahead below. You can also add a new term using the button below.`),
            actions([
                actionButton('Add a term', blockActions.addATerm),
                actionSelectExternal('Enter a term here', blockActions.searchTypeahead),
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

export function definitionResultView(term: string, definition: string, authorID: string, lastUpdateTS: Date, displayOverflowMenu = true): MessagePayload {

    const blocks: Block[] = [
        context(`*Author*: <@${authorID}> *When*: <!date^${(lastUpdateTS.getTime() / 1000).toFixed(0)}^{date_pretty}|${(lastUpdateTS.getTime() / 1000).toFixed(0)}>`)
    ]

    if (displayOverflowMenu) {
        blocks.unshift(sectionWithOverflow(
            `*${term}*\n${definition}`,
            [
                option('Update', `${optionValues.updateTerm}-${term}`),
                option('Revisions', `${optionValues.revisionHistory}-${term}`),
                option('Remove', `${optionValues.removeTerm}-${term}`)
            ],
            blockActions.termOverflowMenu),
        )
    } else {
        blocks.unshift(section(`*${term}*\n${definition}`))
    }
    return {
        text: `${term}`,
        blocks
    }
}

export function updateTermView(storedTerm: TermFromDatabase, responseURL: string): ViewsPayload {
    return buildModal(
        `Update ${storedTerm.term}`,
        [
            plainTextInput(`Definition of ${storedTerm.term}`, 'new-definition', `The definition of ${storedTerm.term}`, true, storedTerm.definition)
        ],
        modalCallbacks.updateTermModal,
        "Update",
        "Cancel",
        {storedTerm, responseURL}
    )
}

export function addTermModalView(term?: string): ViewsPayload {
    return buildModal(
        "Add a new term",
        [
            plainTextInput('Term', 'new-term', 'The term you want to define', false, term),
            plainTextInput('Definition', 'new-definition', 'The definition of the term', true)
        ],
        modalCallbacks.createModal,
        "Submit"
    );
}

export function successFullyAddedTermView(term: string, definition: string, authorID: string, lastUpdateTS: Date, update = false): ViewsPayload {
    const title = update ? `${term} updated` : `${term} added`;
    const explanation = update ? `We've updated ${term} in your company definitions` : `We've added ${term} to your company definitions`;
    
    return buildModal(
        title,
        [
            section(explanation),
            divider(),
            section(`*${term}*\n${definition}`),
            context(`*Author*: <@${authorID}> *When*: <!date^${(lastUpdateTS.getTime() / 1000).toFixed(0)}^{date_pretty}|${(lastUpdateTS.getTime() / 1000).toFixed(0)}>`)
        ],
        modalCallbacks.successfulTermModal
    );
}

export function confirmRemovalView(term: string, responseURL: string): ViewsPayload {
    return buildModal(
        'Remove term',
        [section(`Are you sure you want to remove the term _${term}_? *This cannot be undone*.`)],
        modalCallbacks.confirmRemovalModal,
        'Remove',
        'Keep',
        {term, responseURL},
    )
}

export function successfulRemovalView(term: string): ViewsPayload {
    return buildModal(
        `${term} removed`,
        [section(`We've removed ${term} from your company definitions`)],
        modalCallbacks.successfulTermModal
    );
}

export function errorModal(): ViewsPayload {
    return buildModal(
        "Unknown Error",
        [section(`Something went wrong, we're looking into it`)],
        "");
}

export function revisionHistoryModal(term: string, revisions: TermFromDatabase[]): ViewsPayload {
    let revisionBlocks: Block[] = [];
    revisionBlocks.push(section(`Revisions for _${term}_`));
    revisionBlocks.push(divider());
    for (const revision of revisions) {
        revisionBlocks = revisionBlocks.concat(definitionResultView(`Revision: ${revision.revision}`, revision.definition, revision.authorID, new Date(revision.updated), false).blocks);
        revisionBlocks.push(divider());
    }

    return buildModal("Revisions", revisionBlocks, "");
}