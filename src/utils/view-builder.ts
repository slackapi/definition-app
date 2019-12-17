import { Block, PlainTextElement } from "@slack/types";

export interface ViewsPayload {
    type: "modal",
    callback_id: string,
    title: PlainTextElement,
    blocks: Block[],
    submit?: PlainTextElement,
    private_metadata?: string,
    close?: PlainTextElement
}

export function buildModal(title: string, blocks: Block[], callbackID: string, submitBtnText?: string, closeBtnText?: string, privateMetadata?: object): ViewsPayload {
    const titleFormatted = title.length < 24 ? title : title.substr(0, 20) + '...';
    const modal: ViewsPayload = {
        type: "modal",
        // eslint-disable-next-line @typescript-eslint/camelcase
        callback_id: callbackID,
        title: {
            text: titleFormatted,
            type: "plain_text"
        },
        blocks
    }

    if (closeBtnText) {
        modal.close =  {
            type: 'plain_text',
            text: closeBtnText,
            emoji: true
        }
    }

    if (privateMetadata) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        modal.private_metadata = JSON.stringify(privateMetadata);
    }

    if (submitBtnText) {
        modal.submit = {
            type: 'plain_text',
            text: submitBtnText,
            emoji: true
        }
    }

    return modal;
}