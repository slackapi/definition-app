import {context, section} from '../utils/block-builder'
import { SayArguments } from '@slack/bolt'

export function definition(term: string) : SayArguments {
  return {
    text: `${term}`,
    blocks: [
      section(`*${term}*\n_There's so much to say about ${term}, isn't there?._`),
      context(`Last updated by Jane Bloggs`)
    ]
  }
}
