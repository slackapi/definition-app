import 'mocha'
import { expect } from 'chai'

import { definition } from './read'

describe('Read actions', () => {
    describe('definition', () => {
        it('returns a definition of the requested term, formatted as a Slack message', () => {
            const test_text = 'test';
            const actual_value = definition(test_text);
            const expected_value = {
                text: `${test_text}`,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*${test_text}*\n_There's so much to say about ${test_text}, isn't there?._`
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: `Last updated by Jane Bloggs`
                            }
                        ]
                    }
                ]
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
});