import { Block, PlainTextElement, KnownBlock } from "@slack/types";
import { blockActions, optionValues } from "../config/actions";
import { modalCallbacks, modalFields } from "../config/views";
import { section, divider, actionButton, actions, context, plainTextInput, sectionWithOverflow, option, inputSelectExternal, sectionWithButton } from '../utils/block-builder'
import { TermFromDatabase } from "../global-actions/read";
import { buildModal } from "../utils/view-builder";

interface ViewsPayload {
    type: "modal",
    callback_id: string,
    title: PlainTextElement,
    blocks: Block[],
    submit?: PlainTextElement,
    private_metadata?: string,
    close?: PlainTextElement
}

export function emptyQueryView(): ViewsPayload {
    return buildModal(
        `Search for a definition`,
        [
            inputSelectExternal("Term", "Enter a term, like ARR", modalFields.searchTerm),
            divider(),
            sectionWithButton(
                `Can't find what you're looking for?`, 
                actionButton('Add definition', blockActions.addATerm, undefined),
                blockActions.addATerm
                ),

        ],
        modalCallbacks.searchForTerm,
        `Search`
    )
}

export function undefinedTermModal(term: string): ViewsPayload {
    return buildModal(
        `No definition found`,
        [
            section(`:question: There is currently no definition for the term *${term}*`),
            divider(),
            actions(
                [
                    actionButton('Click here to add one', blockActions.addATerm, undefined, term)
                ],
            )
        ],
        'ff'
    )
}

export function updateTermView(storedTerm: TermFromDatabase): ViewsPayload {
    return buildModal(
        `Update ${storedTerm.term}`,
        [
            plainTextInput(`Definition of ${storedTerm.term}`, 'new-definition', `The definition of ${storedTerm.term}`, true, storedTerm.definition),
            context('You can Slack markdown, like `*bold*`, `_italics_` and <https://api.slack.com/reference/surfaces/formatting#basics|more>')
        ],
        modalCallbacks.updateTermModal,
        "Update",
        "Cancel",
        {storedTerm}
    )
}

export function addTermModalView(term?: string): ViewsPayload {
    return buildModal(
        "Add a new term",
        [
            plainTextInput('Term', 'new-term', 'The term you want to define', false, term),
            plainTextInput('Definition', 'new-definition', 'The definition of the term', true),
            context('You can Slack markdown, like `*bold*`, `_italics_` and <https://api.slack.com/reference/surfaces/formatting#basics|more>')
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

export function singleTermResultView(term: string, definition: string, authorID: string, lastUpdateTS: Date): ViewsPayload {
    return buildModal(
        term,
        [
            sectionWithOverflow(
                definition,
                [
                    option('Update', `${optionValues.updateTerm}-${term}`),
                    option('Revisions', `${optionValues.revisionHistory}-${term}`),
                    option('Remove', `${optionValues.removeTerm}-${term}`)
                ],
                blockActions.termOverflowMenu),
            context(`*Author*: <@${authorID}> *When*: <!date^${(lastUpdateTS.getTime() / 1000).toFixed(0)}^{date_pretty}|${(lastUpdateTS.getTime() / 1000).toFixed(0)}>`),
        ],
        modalCallbacks.termDisplayModal
    );
};

export function confirmRemovalView(term: string): ViewsPayload {
    return buildModal(
        'Remove term',
        [section(`Are you sure you want to remove the term _${term}_? *This cannot be undone*.`)],
        modalCallbacks.confirmRemovalModal,
        'Remove',
        'Keep',
        {term},
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

function revisionViewBlock(title: string, definition: string, authorID: string, lastUpdateTS: Date): KnownBlock[] {
    return [
        section(title),
        section(definition),
        context(`*Author*: <@${authorID}> *When*: <!date^${(lastUpdateTS.getTime() / 1000).toFixed(0)}^{date_pretty}|${(lastUpdateTS.getTime() / 1000).toFixed(0)}>`),
    ]
} 

export function revisionHistoryModal(term: string, revisions: TermFromDatabase[]): ViewsPayload {
    let revisionBlocks: Block[] = [];
    revisionBlocks.push(section(`Revisions for _${term}_`));
    revisionBlocks.push(divider());
    for (const revision of revisions) {
        revisionBlocks = revisionBlocks.concat(revisionViewBlock(`Revision: ${revision.revision}`, `${revision.definition}`, revision.authorID, new Date(revision.updated)));
        revisionBlocks.push(divider());
    }

    return buildModal("Revisions", revisionBlocks, "");
}