import 'mocha'
import { expect } from 'chai'

import { definition } from './read'
import { globalActions } from '../config/actions'

describe('Read actions', () => {
    describe('definition', () => {
        it('returns a definition of the requested term, formatted as a Slack message') // Needs some DB stubbing
        it('returns a prompt to add a term if none is found', async () => {
            const testText = 'test';
            const actualValue = await definition(testText, 'T1234');
            const expectedValue = {
                text: `There is currently no definition for the term ${testText}`,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `:question: There is currently no definition for the term ${testText}`
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `Would you like to add one?`
                        }
                    },
                    {
                        type: 'actions',
                        elements: [
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Yes',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'addATerm'
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'No',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'clearMessage'
                            }
                        ]
                    }

                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
        it('returns a prompt to provide a term when no string is provided', async () => {
            const testText = '';
            const actualValue = await definition(testText, 'T1234');
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
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Cancel',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'clearMessage'
                            }
                        ]
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
        it('returns a prompt to provide a term when just spaces are provided', async () => {
            const testText = '          ';
            const actualValue = await definition(testText, 'T1234');
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
                            },
                            {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Cancel',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'clearMessage'
                            }

                        ]
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
});