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

export function actionButton(text: string, action_id: string): Button {
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text,
            emoji: true
        },
        action_id
    }
}

export function actions(actions: Action[], block_id: string): ActionsBlock {
    return {
        type: 'actions',
        block_id,
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

export function input(title: string, action_id: string, placeholder: string = ' ', multiline: boolean = false):  InputBlock {
    return {
        type: 'input',
        block_id: action_id,
        element: {
            type: 'plain_text_input',
            multiline,
            action_id,
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