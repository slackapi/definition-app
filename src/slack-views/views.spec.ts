import 'mocha'
import { expect } from 'chai'
import { emptyQueryView, addTermModalView, successFullyAddedTermView, confirmRemovalView, updateTermView } from './views';
import { modalCallbacks } from '../config/views';
import { TermFromDatabase } from '../global-actions/read';

describe('views', () => {
    describe('Modals', () => {
        describe('emptyQueryView', () => {
            it('returns a formatted message block', () => {
                const actualValue = emptyQueryView();
                const expectedValue = {
                    type: "modal",
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    callback_id: "searchForTermModal",
                    submit: {
                        type: 'plain_text',
                        text: 'Search',
                        emoji: true
                    },
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    title: {
                        text: `Search for a definition`,
                        type: "plain_text"
                    },
                    blocks: [
                        {
                            type: 'input',
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            block_id: 'search-term',
                            element: {
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                type: "external_select",
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'search-term',
                                placeholder: {
                                    type: "plain_text",
                                    text: "Enter a term, like ARR"
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                min_query_length: 0
                            },
                            label: {
                                type: 'plain_text',
                                text: "Term",
                                emoji: true
                            }
                        },
                        {
                            type: "divider"
                        },
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `Can't find what you're looking for?`,
                            },
                            accessory: {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Add definition',
                                    emoji: true
                                },
                                // eslint-disable-next-line @typescript-eslint/camelcase
                                action_id: 'addATerm'
                            },
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            block_id: 'addATerm'
                        }
                    ]
                }
                expect(actualValue).to.eql(expectedValue);
            })
        })
        describe('revisionHistoryModal', () => {
            it('returns a formatted modal', () => {
            })
        });
        describe('confirmRemovalView', () => {
            it('returns a formatted modal', () => {
                const testTerm = 'OKR';
                const actualValue = confirmRemovalView(testTerm);
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
                    private_metadata: JSON.stringify({term: testTerm}),
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
                const testTermFromDB: TermFromDatabase = {
                    term: testTerm,
                    definition: testDefinition,
                    authorID: '',
                    updated: '',
                    revision: 0,
                  }
                const actualValue = updateTermView(testTermFromDB);
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
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    private_metadata: JSON.stringify({storedTerm: testTermFromDB}),
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
                const authorID = 'U1234567';
                const lastUpdateTS = new Date('2019-12-02 12:17:10');
                const actualValue = successFullyAddedTermView(testTerm, testDefinition, authorID, lastUpdateTS);
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
                        {
                            type: "context",
                            elements: [{
                                type: "mrkdwn",
                                text: `*Author*: <@${authorID}> *When*: <!date^${lastUpdateTS.getTime() / 1000}^{date_pretty}|${lastUpdateTS.getTime() / 1000}>`
                            }]
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