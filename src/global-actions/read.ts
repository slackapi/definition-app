import { SayArguments } from '@slack/bolt'
import { emptyQueryView, definitionResultView } from '../slack-views/views'

export function definition(term: string) : SayArguments {
  term = term.trim();

  if (term.length < 1) {
    return emptyQueryView();
  }

  return definitionResultView(term, 'This is a placeholder definition', 'U9UFK54EA', 1574421631);
}