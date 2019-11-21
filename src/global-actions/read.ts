import {context, section, divider, actions, actionButton} from '../utils/block-builder'
import { SayArguments } from '@slack/bolt'
import { globalActions, blockActions } from '../config/actions'

export function definition(term: string) : SayArguments {
  term = term.trim();

  if (term.length < 1) {
    return {
      text: `Please provide a search term, for example - \`/${globalActions.define} OKR\``,
      blocks: [
        section(':warning: You didn\'t specify a term to search for'),
        divider(),
        section(`You can use \`/${globalActions.define}\` to search for the definition of terms used by your company. What would you like to do?`),
        actions([
          actionButton('Add a term', blockActions.add_a_term),
          actionButton('Search for a term', blockActions.search_for_term)
        ],
        blockActions.search_or_add)
      ]
    }
  }

  return {
    text: `${term}`,
    blocks: [
      section(`*${term}*\n_There's so much to say about ${term}, isn't there?._`),
      context(`Last updated by Jane Bloggs`)
    ]
  }
}