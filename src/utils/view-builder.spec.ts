import 'mocha'
import { expect } from 'chai'
import { section } from './block-builder';
import { buildModal } from './view-builder';

describe('View builder', () => {
    describe('modalBuilder', () => {
        it('returns a modal payload', () => {
            const testTitle = 'test';
            const testBlocks = [section('Hello')];
            const testCallbackID = 'foo';
            const actualValue = buildModal(testTitle, testBlocks, testCallbackID);
            const expectedValue = {
                type: "modal",
                // eslint-disable-next-line @typescript-eslint/camelcase
                callback_id: testCallbackID,
                title: {
                    text: testTitle,
                    type: "plain_text"
                },
                blocks: testBlocks
            };
            expect(actualValue).to.eql(expectedValue);

        })
        describe('when the title is longer than 24 characters', () => {
            it('returns a modal payload with a truncated title', () => {
                const testTitle = 'This is a string is longer than twenty-four characters';
                const testBlocks = [section('Hello')];
                const testCallbackID = 'foo';
                const actualValue = buildModal(testTitle, testBlocks, testCallbackID);
                const expectedValue = {
                    type: "modal",
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    callback_id: testCallbackID,
                    title: {
                        text: 'This is a string is ...',
                        type: "plain_text"
                    },
                    blocks: testBlocks
                };
                expect(actualValue).to.eql(expectedValue);
    
            })
        })
    })
});