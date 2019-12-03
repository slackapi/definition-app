import 'mocha'
import { expect } from 'chai'
import { emptyQueryView, definitionResultView, addTermModalView, undefinedTermView, successFullyAddedTermView, confirmRemovalView, updateTermView } from './views';
import { globalActions } from '../config/actions';
import { modalCallbacks } from '../config/views';

describe('views', () => {
    describe('Messages', () => {
        describe('undefinedTermView', () => {
            it('returns a formatted message block', () => {
                const testTerm = 'OKR';
                const actualValue = undefinedTermView(testTerm);
                const expectedValue = {
                    text: `There is currently no definition for the term ${testTerm}`,
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: `:question: There is currently no definition for the term ${testTerm}`
                            }
                        },
                        {
                            type: 'divider'
                        },
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: `Would you like to add one?`
                            }
                        },
                        {
                            type: 'actions',
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            elements: [
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        text: 'Yes',
                                        emoji: true
                                    },
                                    // eslint-disable-next-line @typescript-eslint/camelcase
                                    action_id: 'addATerm',
                                    value: testTerm
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
                }
                expect(actualValue).to.eql(expectedValue);
            })
        });
        describe('emptyQueryView', () => {
            it('returns a formatted message block', () => {
                const actualValue = emptyQueryView();
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
                }
                expect(actualValue).to.eql(expectedValue);
            })
        })
        describe('definitionResultView', () => {
            it('returns a formatted message block', () => {
                const testTerm = 'OKR';
                const testDefinition = 'OKRs are objective and key results';
                const testAuthorID = 'U1234567';
                const testTimestamp = new Date();
                const actualValue = definitionResultView(
                    testTerm,
                    testDefinition,
                    testAuthorID,
                    testTimestamp
                );
                const expectedValue = {
                    text: `${testTerm}`,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*${testTerm}*\n${testDefinition}`
                            },
                            accessory: {
                                type: "overflow",
                                options: [
                                    {
                                        text: {
                                            type: "plain_text",
                                            text: "Update",
                                            emoji: true
                                        },
                                        value: `updateTerm-${testTerm}`
                                    },
                                    {
                                        text: {
                                            type: "plain_text",
                                            text: "Remove",
                                            emoji: true
                                        },
                                        value: `removeTerm-${testTerm}`
                                    },
                                ],
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'termOverflowMenu'
                            }
                        },
                        {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: `*Author*: <@${testAuthorID}> *When*: <!date^${testTimestamp.getTime() / 1000}^{date_pretty}|${testTimestamp.getTime() / 1000}>`
                                }
                            ]
                        }
                    ]
                };
                expect(actualValue).to.eql(expectedValue);
            })
        })
    })
    describe('Modals', () => {
        describe('confirmRemovalView', () => {
            it('returns a formatted modal', () => {
                const testTerm = 'OKR';
                const testResponseURL = 'https://localhost/'
                const actualValue = confirmRemovalView(testTerm, testResponseURL);
                const expectedValue = {
                    type: "modal",
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    callback_id: "confirmRemovalModal",
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
                    private_metadata: JSON.stringify({term: testTerm, responseURL: testResponseURL}),
                    title: {
                        text: `Remove term`,
                        type: "plain_text"
                    },
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `Are you sure you want to remove the term _${testTerm}_? *This cannot be undone*.`
                            }
                        },
                    ]
                }
                expect(actualValue).to.eql(expectedValue);
            })
        });
        describe('updateTermView', () => {
            it('returns a formatted modal', () => {
                const testTerm = 'OKR';
                const testDefinition = 'Objectives and key results';
                const actualValue = updateTermView(testTerm, testDefinition);
                const expectedValue = {
                    type: "modal",
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    callback_id: "updateTermModal",
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
                    title: {
                        text: `Update ${testTerm}`,
                        type: "plain_text"
                    },
                    blocks: [
                        {
                            type: 'input',
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            block_id: 'new-definition',
                            element: {
                                type: 'plain_text_input',
                                multiline: true,
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'new-definition',
                                placeholder: {
                                    type: 'plain_text',
                                    text: `The definition of ${testTerm}`
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                initial_value: testDefinition

                            },
                            label: {
                                type: 'plain_text',
                                text: `Definition of ${testTerm}`,
                                emoji: true
                            }
                        }
                    ]
                }
                expect(actualValue).to.eql(expectedValue);
            })
        });
        describe('successFullyAddedTermView', () => {
            it('returns a formatted modal', () => {
                const testTerm = 'OKR';
                const testDefinition = 'Objective and key results';
                const actualValue = successFullyAddedTermView(testTerm, testDefinition);
                const expectedValue = {
                    type: "modal",
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    callback_id: modalCallbacks.successfulTermModal,
                    title: {
                        text: `${testTerm} added`,
                        type: "plain_text"
                    },
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `We've added ${testTerm} to your company definitions`
                            }
                        },
                        {
                            type: "divider"
                        },
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*${testTerm}*\n${testDefinition}`
                            }
                        },

                    ]
                }
                expect(actualValue).to.eql(expectedValue);
            })
        });
        describe('addTermModalView', () => {
            it('returns a formatted modal', () => {
                const actualValue = addTermModalView();
                const expectedValue = {
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
                        {
                            type: 'input',
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            block_id: 'new-term',
                            element: {
                                type: 'plain_text_input',
                                multiline: false,
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'new-term',
                                placeholder: {
                                    type: 'plain_text',
                                    text: 'The term you want to define'
                                }
                            },
                            label: {
                                type: 'plain_text',
                                text: 'Term',
                                emoji: true
                            }
                        },
                        {
                            type: 'input',
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            block_id: 'new-definition',
                            element: {
                                type: 'plain_text_input',
                                multiline: true,
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'new-definition',
                                placeholder: {
                                    type: 'plain_text',
                                    text: 'The definition of the term'
                                }
                            },
                            label: {
                                type: 'plain_text',
                                text: 'Definition',
                                emoji: true
                            }
                        }
                    ]
                };
                expect(actualValue).to.eql(expectedValue);
            })
        })
    })
});