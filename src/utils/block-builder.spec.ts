import 'mocha'
import { expect } from 'chai'
import { context, section, option, sectionWithOverflow, divider, actionButton, actions, input } from './block-builder'

describe('Block builder', () => {
    describe('context', () => {
        it('returns a formatted context block containing the provided text', () => {
            const test_text = 'test';
            const actual_value = context(test_text);
            const expected_value = {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: test_text
                    }
                ]
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('section', () => {
        it('returns a formatted section block containing the provided text', () => {
            const test_text = 'test';
            const actual_value = section(test_text);
            const expected_value = {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: test_text
                }
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('sectionWithOverflow', () => {
        it('returns a formatted section block containing the provided text and an overflow', () => {
            const test_text = 'test';
            const test_value = 'test-value';
            const actual_value = sectionWithOverflow(test_text, [option(test_text, test_value)]);
            const expected_value = {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: test_text
                },
                accessory: {
                    type: "overflow",
                    options: [{
                        text: {
                            type: "plain_text",
                            text: test_text,
                            emoji: true
                        },
                        value: test_value
                    }]
                }
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('option', () => {
        it('returns a formatted option', () => {
            const test_text = 'test';
            const test_value = 'test-value';
            const actual_value = option(test_text, test_value);
            const expected_value = {
                text: {
                    type: "plain_text",
                    text: test_text,
                    emoji: true
                },
                value: test_value
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('divider', () => {
        it('returns a divider block', () => {
            const actual_value = divider();
            const expected_value = {
                type: 'divider'
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('actionButton', () => {
        it('returns a button action block', () => {
            const test_text = 'Test';
            const test_value = 'TestValue';
            const actual_value = actionButton(test_text, test_value);
            const expected_value = {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: test_text,
                    emoji: true
                },
                action_id: test_value
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('actions', () => {
        it('returns an actions block', () => {
            const test_text = 'Test';
            const test_value = 'TestValue';
            const test_block_id = 'TestBlockID';
            const test_button = actionButton(test_text, test_value);
            const actual_value = actions([test_button], test_block_id)
            const expected_value = {
                type: 'actions',
                block_id: test_block_id,
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: test_text,
                            emoji: true
                        },
                        action_id: test_value
                    }
                ]
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
    describe('input', () => {
        it('returns a single line input block', () => {
            const test_title = 'Test';
            const test_placeholder = 'TestValue';
            const test_block_id = 'TestBlockID';
            const actual_value = input(test_title, test_block_id, test_placeholder)
            const expected_value = {
                type: 'input',
                block_id: test_block_id,
                element: {
                    type: 'plain_text_input',
                    multiline: false,
                    action_id: test_block_id,
                    placeholder : {
                        type: 'plain_text',
                        text: test_placeholder
                    }
                },
                label: {
                    type: 'plain_text',
                    text: test_title,
                    emoji: true
                }
            };
            expect(actual_value).to.eql(expected_value);
        })
        it('returns a multiline line input block', () => {
            const test_title = 'Test';
            const test_placeholder = 'TestValue';
            const test_block_id = 'TestBlockID';
            const actual_value = input(test_title, test_block_id, test_placeholder, true)
            const expected_value = {
                type: 'input',
                block_id: test_block_id,
                element: {
                    type: 'plain_text_input',
                    multiline: true,
                    action_id: test_block_id,
                    placeholder : {
                        type: 'plain_text',
                        text: test_placeholder
                    }
                },
                label: {
                    type: 'plain_text',
                    text: test_title,
                    emoji: true
                }
            };
            expect(actual_value).to.eql(expected_value);
        })
    })
});