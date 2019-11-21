import 'mocha'
import { expect } from 'chai'

import { definition } from './read'
import { globalActions } from '../config/actions'

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
        it('returns a prompt to provide a term when no string is provided', () => {
            const test_text = '';
            const actual_value = definition(test_text);
            const expected_value = {
                text: `Please provide a search term, for example - \`/${globalActions.define} OKR\``,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':warning: You didn\'t specify a term to search for'
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `You can use \`/${globalActions.define}\` to search for the definition of terms used by your company. What would you like to do?`
                        }
                    },
                    {
                        type: 'actions',
                        block_id: 'search_or_add',
                        elements: [
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Add a term',
                                    emoji: true
                                },
                                action_id: 'add_a_term'
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Search for a term',
                                    emoji: true
                                },
                                action_id: 'search_for_term'
                            }
                        ]
                    }
                ]
            };
            expect(actual_value).to.eql(expected_value);
        })
        it('returns a prompt to provide a term when just spaces are provided', () => {
            const test_text = '          ';
            const actual_value = definition(test_text);
            const expected_value = {
                text: `Please provide a search term, for example - \`/${globalActions.define} OKR\``,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':warning: You didn\'t specify a term to search for'
                        }
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `You can use \`/${globalActions.define}\` to search for the definition of terms used by your company. What would you like to do?`
                        }
                    },
                    {
                        type: 'actions',
                        block_id: 'search_or_add',
                        elements: [
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Add a term',
                                    emoji: true
                                },
                                action_id: 'add_a_term'
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Search for a term',
                                    emoji: true
                                },
                                action_id: 'search_for_term'
                            }
                        ]
                    }
                ]
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
});