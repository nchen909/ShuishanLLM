import { v4 as uuidv4 } from 'uuid'
import { ThemeMode } from '../theme'

export type Message = OpenAIMessage & {
    id: string
    cancel?: () => void
    generating?: boolean
    model?: string
}

export interface Session {
    id: string
    name: string
    messages: Message[]
    starred?: boolean
}

export function createMessage(role: OpenAIRoleEnumType = OpenAIRoleEnum.User, content = ''): Message {
    return {
        id: uuidv4(),
        content: content,
        role: role,
    }
}

export function createSession(name = 'Untitled'): Session {
    return {
        id: uuidv4(),
        name: name,
        messages: [
            {
                id: uuidv4(),
                role: 'system',
                content:
                    '你好, 我是水杉大模型, 一个由华东师范大学数据科学与工程学院开发的大模型语言, 目前处于测试阶段, 请问有什么可以帮到您?',
            },
        ],
    }
}

export interface Settings {
    openaiKey: string
    apiHost: string
    model: string
    maxContextSize: string
    temperature: number
    maxTokens: string
    showWordCount?: boolean
    showTokenCount?: boolean
    showModelName?: boolean
    theme: ThemeMode
    language: string
    fontSize: number
}

export const OpenAIRoleEnum = {
    System: 'system',
    User: 'user',
    Assistant: 'assistant',
} as const

export type OpenAIRoleEnumType = (typeof OpenAIRoleEnum)[keyof typeof OpenAIRoleEnum]

export interface OpenAIMessage {
    role: OpenAIRoleEnumType
    content: string
    name?: string
}

export interface Config {
    uuid: string
}

export interface SponsorAd {
    text: string
    url: string
}

export interface SponsorAboutBanner {
    type: 'picture' | 'picture-text'
    name: string
    pictureUrl: string
    link: string
    title: string
    description: string
}
