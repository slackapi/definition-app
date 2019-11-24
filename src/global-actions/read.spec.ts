import 'mocha'
import { expect } from 'chai'

import { definition } from './read'
import { globalActions } from '../config/actions'

describe('Read actions', () => {
    describe('definition', () => {
        it('returns a definition of the requested term, formatted as a Slack message', () => {
            const testText = 'test';
            const actualValue = definition(testText);
            const expectedValue = {
                text: `${testText}`,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `${testText}\nThis is a placeholder definition`
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: `Last updated by <@U9UFK54EA> on <!date^1574421631^{date_pretty}|1574421631>`
                            }
                        ]
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
        it('returns a prompt to provide a term when no string is provided', () => {
            const testText = '';
            const actualValue = definition(testText);
            const expectedValue = {
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
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        block_id: 'searchOrAdd',
                        elements: [
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Add a term',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'addATerm'
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Search for a term',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'searchForTerm'
                            }
                        ]
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
        it('returns a prompt to provide a term when just spaces are provided', () => {
            const testText = '          ';
            const actualValue = definition(testText);
            const expectedValue = {
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
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        block_id: 'searchOrAdd',
                        elements: [
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Add a term',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'addATerm'
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Search for a term',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'searchForTerm'
                            }
                        ]
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
});