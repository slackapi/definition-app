import { ContextBlock, SectionBlock, Option, DividerBlock, Action, ActionsBlock, Button } from '@slack/types'

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

export function actionButton(text: string, value: string): Button {
    return {
        type: 'button',
        text: {
            type: 'plain_text',
            text,
            emoji: true
        },
        value
    }
}

export function actions(actions: Action[]): ActionsBlock {
    return {
        type: 'actions',
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