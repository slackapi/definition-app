import 'mocha'
import { expect } from 'chai'
import { emptyQueryView, definitionResultView, addTermModalView } from './views';
import { globalActions } from '../config/actions';
import { modalCallbacks } from '../config/views';

describe('views', () => {
    describe('Messages', () => {
        describe('emptyQueryView', () => {
            it('returns a formatted message block', () => {
                const actual_value = emptyQueryView();
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
                }
                expect(actual_value).to.eql(expected_value);
            })
        })
        describe('definitionResultView', () => {
            it('returns a formatted message block', () => {
                const test_term = 'OKR';
                const test_definition = 'OKRs are objective and key results';
                const test_author_id = 'U1234567';
                const test_timestamp = 12345678;
                const actual_value = definitionResultView(
                    test_term,
                    test_definition,
                    test_author_id,
                    test_timestamp
                );
                const expected_value = {
                    text: `${test_term}`,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `${test_term}\n${test_definition}`
                            }
                        },
                        {
                            type: "context",
                            elements: [
                                {
                                    type: "mrkdwn",
                                    text: `Last updated by <@${test_author_id}> on <!date^${test_timestamp}^{date_pretty}|${test_timestamp}>`
                                }
                            ]
                        }
                    ]
                };
                expect(actual_value).to.eql(expected_value);
            })
        })
    })
    describe('Modals', () => {
        describe('addTermModalView', () => {
            it('returns a formatted modal', () => {
                const actual_value = addTermModalView();
                const expected_value = {
                    type: "modal",
                    submit: {
                        type: 'plain_text',
                        text: 'Submit',
                        emoji: true
                    },
                    callback_id: modalCallbacks.create_modal,
                    title: {
                        text: "Add a new term",
                        type: "plain_text"
                    },
                    blocks: [
                        {
                            type: 'input',
                            block_id: 'new-term',
                            element: {
                              type: 'plain_text_input',
                              multiline: false,
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
                            block_id: 'new-definition',
                            element: {
                              type: 'plain_text_input',
                              multiline: true,
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
                expect(actual_value).to.eql(expected_value);
            })
        })
    })
});