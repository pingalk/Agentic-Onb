// Chat components - Core chat interface building blocks

export { ChatContainer, type ChatContainerProps } from './ChatContainer';
export {
  MessageList,
  type MessageListProps,
  type Message,
} from './MessageList';
export {
  UserMessage,
  type UserMessageProps,
  type Attachment,
} from './UserMessage';
export {
  AssistantMessage,
  type AssistantMessageProps,
} from './AssistantMessage';
export {
  SystemMessage,
  type SystemMessageProps,
  type SystemMessageVariant,
} from './SystemMessage';
export { MessageGroup, type MessageGroupProps } from './MessageGroup';
