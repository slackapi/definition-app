import { ContextBlock, SectionBlock, Option } from '@slack/types'

export function context(text: string) : ContextBlock {
    return {
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: text
            }
        ]
    }
}

export function section(text: string) : SectionBlock {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: text
        }
    }
}

export function option(text: string, value: string) : Option {
    return {
        text: {
            type: "plain_text",
            text: text,
            emoji: true
        },
        value: value
    }
}

