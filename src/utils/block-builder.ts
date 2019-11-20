import { ContextBlock, SectionBlock, Option } from '@slack/types'

export function context(text: string) : ContextBlock {
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

export function section(text: string) : SectionBlock {
    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text
        }
    }
}

export function option(text: string, value: string) : Option {
    return {
        text: {
            type: "plain_text",
            text,
            emoji: true
        },
        value
    }
}

export function sectionWithOverflow(text: string, options: Option[]) : SectionBlock {
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