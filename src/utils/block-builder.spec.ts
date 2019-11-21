import 'mocha'
import { expect } from 'chai'
import { context, section, option, sectionWithOverflow } from './block-builder'

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
});