import 'mocha'
import { expect } from 'chai'
import { context, section, option, sectionWithOverflow, divider, actionButton, actions, input } from './block-builder'

describe('Block builder', () => {
    describe('context', () => {
        it('returns a formatted context block containing the provided text', () => {
            const testText = 'test';
            const actualValue = context(testText);
            const expectedValue = {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: testText
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('section', () => {
        it('returns a formatted section block containing the provided text', () => {
            const testText = 'test';
            const actualValue = section(testText);
            const expectedValue = {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: testText
                }
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('sectionWithOverflow', () => {
        it('returns a formatted section block containing the provided text and an overflow', () => {
            const testText = 'test';
            const testValue = 'test-value';
            const actualValue = sectionWithOverflow(testText, [option(testText, testValue)]);
            const expectedValue = {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: testText
                },
                accessory: {
                    type: "overflow",
                    options: [{
                        text: {
                            type: "plain_text",
                            text: testText,
                            emoji: true
                        },
                        value: testValue
                    }]
                }
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('option', () => {
        it('returns a formatted option', () => {
            const testText = 'test';
            const testValue = 'test-value';
            const actualValue = option(testText, testValue);
            const expectedValue = {
                text: {
                    type: "plain_text",
                    text: testText,
                    emoji: true
                },
                value: testValue
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('divider', () => {
        it('returns a divider block', () => {
            const actualValue = divider();
            const expectedValue = {
                type: 'divider'
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('actionButton', () => {
        it('returns a button action block', () => {
            const testText = 'Test';
            const testValue = 'TestValue';
            const actualValue = actionButton(testText, testValue);
            const expectedValue = {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: testText,
                    emoji: true
                },
                // eslint-disable-next-line @typescript-eslint/camelcase
                action_id: testValue
            };
            expect(actualValue).to.eql(expectedValue);
        })
        it('returns a primary styled button action block', () => {
            const testText = 'Test';
            const testValue = 'TestValue';
            const actualValue = actionButton(testText, testValue, 'primary');
            const expectedValue = {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: testText,
                    emoji: true
                },
                style: 'primary',
                // eslint-disable-next-line @typescript-eslint/camelcase
                action_id: testValue
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('actions', () => {
        it('returns an actions block', () => {
            const testText = 'Test';
            const testValue = 'TestValue';
            const testBlockID = 'TestBlockID';
            const testButton = actionButton(testText, testValue);
            const actualValue = actions([testButton], testBlockID)
            const expectedValue = {
                type: 'actions',
                // eslint-disable-next-line @typescript-eslint/camelcase
                block_id: testBlockID,
                elements: [
                    {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: testText,
                            emoji: true
                        },
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        action_id: testValue
                    }
                ]
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
    describe('input', () => {
        it('returns a single line input block', () => {
            const testTitle = 'Test';
            const testPlaceholder = 'TestValue';
            const testBlockID = 'TestBlockID';
            const actualValue = input(testTitle, testBlockID, testPlaceholder)
            const expectedValue = {
                type: 'input',
                // eslint-disable-next-line @typescript-eslint/camelcase
                block_id: testBlockID,
                element: {
                    type: 'plain_text_input',
                    multiline: false,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    action_id: testBlockID,
                    placeholder : {
                        type: 'plain_text',
                        text: testPlaceholder
                    }
                },
                label: {
                    type: 'plain_text',
                    text: testTitle,
                    emoji: true
                }
            };
            expect(actualValue).to.eql(expectedValue);
        })
        it('returns a multiline line input block', () => {
            const testTitle = 'Test';
            const testPlaceholder = 'TestValue';
            const testBlockID = 'TestBlockID';
            const actualValue = input(testTitle, testBlockID, testPlaceholder, true)
            const expectedValue = {
                type: 'input',
                // eslint-disable-next-line @typescript-eslint/camelcase
                block_id: testBlockID,
                element: {
                    type: 'plain_text_input',
                    multiline: true,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    action_id: testBlockID,
                    placeholder : {
                        type: 'plain_text',
                        text: testPlaceholder
                    }
                },
                label: {
                    type: 'plain_text',
                    text: testTitle,
                    emoji: true
                }
            };
            expect(actualValue).to.eql(expectedValue);
        })
    })
});