import { ContextBlock, SectionBlock, Option, DividerBlock, Action, ActionsBlock, Button, InputBlock, PlainTextInput } from '@slack/types'

export function context(text: string): ContextBlock {
    return {
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text
            }
        ]
    }
}

export function option(text: string, value: string): Option {
    return {
        text: {
            type: "plain_text",
            text,
            emoji: true
        },
        value
    }
}

export function divider(): DividerBlock {
    return {
        type: 'divider'
    }
}

export function actionButton(text: string, actionID: string, style?: 'primary' | 'danger', value?: string): Button {
    const payload: Button = {
        type: 'button',
        text: {
            type: 'plain_text',
            text,
            emoji: true
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        action_id: actionID
    }
    if (style) {
        payload.style = style;
    }

    if (value) {
        payload.value = value;
    }

    return payload;
}

export function actions(actions: Action[], blockID?: string): ActionsBlock {
    const payload: ActionsBlock = {
        type: 'actions',
        elements: actions
    }

    if (blockID) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        payload.block_id = blockID;
    }

    return payload;
}

export function section(text: string): SectionBlock {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text
        }
    }
}

export function sectionWithOverflow(text: string, options: Option[], actionID: string): SectionBlock {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text,
        },
        accessory: {
            type: "overflow",
            options,
            // eslint-disable-next-line @typescript-eslint/camelcase
            action_id: actionID
        }
    }
}

export function plainTextInput(title: string, actionID: string, placeholder = ' ', multiline = false, initialValue?: string):  InputBlock {

    const element: PlainTextInput = {
        type: 'plain_text_input',
        multiline,
        // eslint-disable-next-line @typescript-eslint/camelcase
        action_id: actionID,
        placeholder : {
            type: 'plain_text',
            text: placeholder
        }
    }
    if (initialValue) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        element.initial_value = initialValue
    }

    const blockPayload: InputBlock = {
        type: 'input',
        // eslint-disable-next-line @typescript-eslint/camelcase
        block_id: actionID,
        element,
        label: {
            type: 'plain_text',
            text: title,
            emoji: true
        }
    }

    



    return blockPayload;
}