/**
 * Blade AI Elements
 *
 * AI chat UI component library for Razorpay's Blade Design System.
 * Provides reusable primitives for building AI-powered interfaces.
 *
 * @packageDocumentation
 */

// =============================================================================
// Primitives - Core building blocks
// =============================================================================
export {
  // Components
  Logo,
  Avatar,
  StreamingText,
  Markdown,
  SmartText,
  // Animation utilities
  fadeIn,
  slideUp,
  slideDown,
  blurIn,
  scaleIn,
  staggerContainer,
  springConfig,
  rotatingLogo,
  pulsingDot,
  // Types
  type LogoProps,
  type LogoSize,
  type LogoAnimateState,
  type AvatarProps,
  type AvatarSize,
  type AvatarVariant,
  type StreamingTextProps,
  type StreamingStyle,
  type MarkdownProps,
  type HighlightPattern,
} from './primitives';

// =============================================================================
// Chat - Chat interface components
// =============================================================================
export {
  ChatContainer,
  MessageList,
  UserMessage,
  AssistantMessage,
  SystemMessage,
  MessageGroup,
  // Types
  type ChatContainerProps,
  type MessageListProps,
  type UserMessageProps,
  type AssistantMessageProps,
  type SystemMessageProps,
  type SystemMessageVariant,
  type MessageGroupProps,
} from './chat';

// =============================================================================
// Input - Input components
// =============================================================================
export {
  ChatInput,
  SendButton,
  FileUpload,
  AttachmentChip,
  VoiceInput,
  // Types
  type ChatInputProps,
  type SendButtonProps,
  type SendButtonVariant,
  type FileUploadProps,
  type FileUploadVariant,
  type AttachmentChipProps,
  type AttachmentType,
  type VoiceInputProps,
} from './input';

// =============================================================================
// Thinking - AI processing state components
// =============================================================================
export {
  ThinkingIndicator,
  ChainOfThought,
  ToolExecution,
  ProcessingSteps,
  // Types
  type ThinkingIndicatorProps,
  type ThinkingVariant,
  type ThinkingStep,
  type ChainOfThoughtProps,
  type ChainOfThoughtStep,
  type ToolExecutionProps,
  type ToolStatus,
  type ProcessingStepsProps,
  type ProcessingField,
  type ProcessingFieldStatus,
} from './thinking';

// =============================================================================
// Artifacts - Rich content display components
// =============================================================================
export {
  ArtifactContainer,
  CodeBlock,
  DataTable,
  DataCard,
  ImageViewer,
  DocumentViewer,
  ChartContainer,
  // Types
  type ArtifactContainerProps,
  type ArtifactType,
  type ArtifactAction,
  type CodeBlockProps,
  type DataTableProps,
  type TableColumn,
  type DataCardProps,
  type DataField,
  type DataCardAction,
  type ImageViewerProps,
  type DocumentViewerProps,
  type DocumentType,
  type ChartContainerProps,
  type ChartType,
} from './artifacts';

// =============================================================================
// Forms - Form components
// =============================================================================
export {
  InlineForm,
  FormStep,
  WizardForm,
  SelectableOptions,
  EditableField,
  // Types
  type InlineFormProps,
  type FormField,
  type FieldType,
  type FormStepProps,
  type StepStatus,
  type WizardFormProps,
  type WizardStep,
  type WizardStepProps,
  type SelectableOptionsProps,
  type SelectOption,
  type EditableFieldProps,
} from './forms';

// =============================================================================
// Progress - Progress indicators
// =============================================================================
export {
  Stepper,
  ProgressRing,
  ProgressBar,
  Milestones,
  // Types
  type StepperProps,
  type StepperStep,
  type StepperOrientation,
  type StepperStepStatus,
  type ProgressRingProps,
  type ProgressRingSize,
  type ProgressBarProps,
  type ProgressBarVariant,
  type ProgressBarSize,
  type MilestonesProps,
  type Milestone,
  type MilestoneStatus,
} from './progress';

// =============================================================================
// Feedback - Status and feedback components
// =============================================================================
export {
  SuccessState,
  PendingState,
  ErrorState,
  RateLimitError,
  UserFeedback,
  SupportWidget,
  // Types
  type SuccessStateProps,
  type SuccessAction,
  type PendingStateProps,
  type ErrorStateProps,
  type RateLimitErrorProps,
  type UserFeedbackProps,
  type FeedbackType,
  type FeedbackValue,
  type SupportWidgetProps,
  type SupportTicket,
} from './feedback';

// =============================================================================
// Layout - Layout components
// =============================================================================
export {
  ChatLanding,
  SplitView,
  FloatingPanel,
  FooterActions,
  SuggestionPills,
  // Types
  type ChatLandingProps,
  type SuggestionItem,
  type SplitViewProps,
  type SplitRatio,
  type FloatingPanelProps,
  type PanelPosition,
  type PanelSize,
  type FooterActionsProps,
  type SuggestionPillsProps,
} from './layout';

// =============================================================================
// Skeletons - Loading state components
// =============================================================================
export {
  MessageSkeleton,
  CardSkeleton,
  TableSkeleton,
  TextSkeleton,
  // Types
  type MessageSkeletonProps,
  type MessageSkeletonVariant,
  type CardSkeletonProps,
  type TableSkeletonProps,
  type TextSkeletonProps,
  type SkeletonAnimation,
} from './skeletons';

// =============================================================================
// Hooks - Custom React hooks
// =============================================================================
export {
  useStreamingText,
  useStreamPhases,
  useAutoScroll,
  useFileUpload,
  useFormWizard,
  // Types
  type UseStreamingTextOptions,
  type UseStreamingTextReturn,
  type StreamPhase,
  type UseStreamPhasesOptions,
  type UseStreamPhasesReturn,
  type UseAutoScrollOptions,
  type UseAutoScrollReturn,
  type UploadedFile,
  type UseFileUploadOptions,
  type UseFileUploadReturn,
  type WizardStep as FormWizardStep,
  type UseFormWizardOptions,
  type UseFormWizardReturn,
} from './hooks';
