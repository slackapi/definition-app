import { ContextBlock, SectionBlock } from '@slack/types'

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