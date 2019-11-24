import 'mocha'
import { expect } from 'chai'
import { emptyQueryView, definitionResultView, addTermModalView } from './views';
import { globalActions } from '../config/actions';
import { modalCallbacks } from '../config/views';

describe('views', () => {
    describe('Messages', () => {
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
                const testTimestamp = 12345678;
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
                                text: `${testTerm}\n${testDefinition}`
                            }
                        },
                        {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: `Last updated by <@${testAuthorID}> on <!date^${testTimestamp}^{date_pretty}|${testTimestamp}>`
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