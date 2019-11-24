import { ContextBlock, SectionBlock, Option, DividerBlock, Action, ActionsBlock, Button, InputBlock } from '@slack/types'

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

export function actionButton(text: string, actionID: string): Button {
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text,
            emoji: true
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        action_id: actionID
    }
}

export function actions(actions: Action[], blockID: string): ActionsBlock {
    return {
        type: 'actions',
        // eslint-disable-next-line @typescript-eslint/camelcase
        block_id: blockID,
        elements: actions
    }
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

export function sectionWithOverflow(text: string, options: Option[]): SectionBlock {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text,
        },
        accessory: {
            type: "overflow",
            options
        }
    }
}

export function input(title: string, actionID: string, placeholder = ' ', multiline = false):  InputBlock {
    return {
        type: 'input',
        // eslint-disable-next-line @typescript-eslint/camelcase
        block_id: actionID,
        element: {
            type: 'plain_text_input',
            multiline,
            // eslint-disable-next-line @typescript-eslint/camelcase
            action_id: actionID,
            placeholder : {
                type: 'plain_text',
                text: placeholder
            }
        },
        label: {
            type: 'plain_text',
            text: title,
            emoji: true
        }
    }
}