/**
 * Blade AI Elements
 *
 * AI chat UI component library for Razorpay's Blade Design System.
 * Provides reusable primitives for building AI-powered interfaces.
 *
 * @packageDocumentation
 */

import { default as default_2 } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { Transition } from 'motion/react';
import { Variants } from 'motion/react';

export declare interface ArtifactAction {
    id: string;
    label: string;
    icon?: default_2.ReactNode;
    onClick: () => void;
}

/**
 * Generic artifact wrapper
 *
 * Container for rich content artifacts with optional title, type icon,
 * and action buttons.
 *
 * @example
 * ```tsx
 * <ArtifactContainer
 *   title="Query Results"
 *   type="table"
 *   actions={[
 *     { id: 'copy', label: 'Copy', onClick: handleCopy },
 *     { id: 'export', label: 'Export', onClick: handleExport }
 *   ]}
 * >
 *   <DataTable data={results} />
 * </ArtifactContainer>
 * ```
 */
export declare const ArtifactContainer: default_2.FC<ArtifactContainerProps>;

export declare interface ArtifactContainerProps {
    /** Title for the artifact */
    title?: string;
    /** Artifact type for icon display */
    type?: ArtifactType;
    /** Action buttons */
    actions?: ArtifactAction[];
    /** Artifact content */
    children: default_2.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
    /** Show border */
    bordered?: boolean;
    /** Padding size */
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export declare type ArtifactType = 'code' | 'table' | 'chart' | 'image' | 'document' | 'card' | 'form' | 'custom';

/**
 * AI assistant message container
 *
 * Wrapper for AI responses with the Ray logo. Supports thinking state
 * animation and can contain any content (text, artifacts, forms).
 *
 * @example
 * ```tsx
 * // Simple text response
 * <AssistantMessage>
 *   Here's what I found...
 * </AssistantMessage>
 *
 * // Thinking state
 * <AssistantMessage isThinking>
 *   <ThinkingIndicator steps={steps} />
 * </AssistantMessage>
 *
 * // With rich content
 * <AssistantMessage isLast>
 *   <StreamingText content={response} />
 *   <DataTable data={tableData} />
 *   <SuggestionPills suggestions={followUps} />
 * </AssistantMessage>
 * ```
 */
export declare const AssistantMessage: default_2.FC<AssistantMessageProps>;

export declare interface AssistantMessageProps {
    /** Message content (can be any React node) */
    children: default_2.ReactNode;
    /** Show thinking animation on logo */
    isThinking?: boolean;
    /** Is this the last message in the conversation */
    isLast?: boolean;
    /** Show the AI logo */
    showLogo?: boolean;
    /** Custom logo color */
    logoColor?: string;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
    /** Timestamp */
    timestamp?: Date | string;
}

declare interface Attachment {
    id: string;
    filename: string;
    type: 'image' | 'file' | 'document';
    url?: string;
    preview?: string;
}

/**
 * Attached file display chip
 *
 * Shows an attached file with icon, name, optional preview, and remove button.
 * Supports upload progress indication.
 *
 * @example
 * ```tsx
 * // Image with preview
 * <AttachmentChip
 *   filename="screenshot.png"
 *   type="image"
 *   preview="/preview.jpg"
 *   onRemove={() => removeFile(id)}
 * />
 *
 * // File with progress
 * <AttachmentChip
 *   filename="document.pdf"
 *   type="document"
 *   size={1024000}
 *   progress={65}
 * />
 *
 * // Error state
 * <AttachmentChip
 *   filename="large-file.zip"
 *   type="file"
 *   error
 *   errorMessage="File too large"
 *   onRemove={() => removeFile(id)}
 * />
 * ```
 */
export declare const AttachmentChip: default_2.FC<AttachmentChipProps>;

export declare interface AttachmentChipProps {
    /** File name to display */
    filename: string;
    /** Type of attachment for icon */
    type?: AttachmentType;
    /** Preview URL for images */
    preview?: string;
    /** File size in bytes */
    size?: number;
    /** Upload progress (0-100) */
    progress?: number;
    /** Called when remove button clicked */
    onRemove?: () => void;
    /** Called when chip clicked */
    onClick?: () => void;
    /** Additional CSS classes */
    className?: string;
    /** Show as error state */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
}

export declare type AttachmentType = 'image' | 'file' | 'document' | 'video' | 'audio';

/**
 * Avatar component for user or assistant representation
 *
 * Displays an image avatar with fallback to initials. Supports different
 * sizes and color variants for distinguishing users from AI assistants.
 *
 * @example
 * ```tsx
 * // User avatar with image
 * <Avatar src="/user.jpg" alt="John Doe" variant="user" />
 *
 * // Assistant avatar with fallback
 * <Avatar fallback="AI" variant="assistant" size="lg" />
 *
 * // User avatar with initials
 * <Avatar fallback="JD" variant="user" />
 * ```
 */
export declare const Avatar: default_2.FC<AvatarProps>;

export declare interface AvatarProps {
    /** Image source URL */
    src?: string;
    /** Fallback text (initials or single character) */
    fallback?: string;
    /** Alt text for image */
    alt?: string;
    /** Size of the avatar */
    size?: AvatarSize;
    /** Variant determines color scheme */
    variant?: AvatarVariant;
    /** Additional CSS classes */
    className?: string;
    /** Click handler */
    onClick?: () => void;
}

export declare type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export declare type AvatarVariant = 'user' | 'assistant';

export declare const blurIn: Variants;

/**
 * Card loading skeleton
 *
 * Placeholder for loading card content.
 *
 * @example
 * ```tsx
 * <CardSkeleton rows={4} showHeader showActions animate="shimmer" />
 * ```
 */
export declare const CardSkeleton: default_2.FC<CardSkeletonProps>;

export declare interface CardSkeletonProps {
    /** Number of content rows */
    rows?: number;
    /** Show header section */
    showHeader?: boolean;
    /** Show action buttons */
    showActions?: boolean;
    /** Animation type */
    animate?: SkeletonAnimation_3;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Collapsible reasoning steps display
 *
 * Shows AI chain of thought process with animated step transitions.
 * Can auto-cycle through steps or be manually controlled.
 *
 * @example
 * ```tsx
 * // Auto-cycling thinking steps
 * <ChainOfThought
 *   steps={[
 *     { label: 'Parsing query...', status: 'complete' },
 *     { label: 'Searching database...', status: 'active' },
 *     { label: 'Formatting response...', status: 'pending' }
 *   ]}
 *   autoCycle
 *   cycleInterval={1500}
 * />
 *
 * // Collapsible with details
 * <ChainOfThought
 *   steps={[
 *     { label: 'Found 15 matching records', status: 'complete', detail: 'Query took 0.3s' },
 *     { label: 'Applied filters', status: 'complete', detail: 'Date range: 30 days' }
 *   ]}
 *   collapsible
 *   defaultCollapsed
 * />
 * ```
 */
export declare const ChainOfThought: default_2.FC<ChainOfThoughtProps>;

export declare interface ChainOfThoughtProps {
    /** Array of thinking steps */
    steps: ChainOfThoughtStep[];
    /** Make steps collapsible */
    collapsible?: boolean;
    /** Initial collapsed state */
    defaultCollapsed?: boolean;
    /** Callback when step changes */
    onStepChange?: (stepIndex: number) => void;
    /** Auto-cycle through steps */
    autoCycle?: boolean;
    /** Interval for auto-cycling (ms) */
    cycleInterval?: number;
    /** Additional CSS classes */
    className?: string;
    /** Mode: thinking shows animation, complete shows static */
    mode?: 'thinking' | 'complete';
}

export declare interface ChainOfThoughtStep {
    /** Step label */
    label: string;
    /** Step status */
    status?: 'pending' | 'active' | 'complete' | 'error';
    /** Optional detail text */
    detail?: string;
}

/**
 * Chart wrapper container
 *
 * Provides consistent styling and optional controls for charts.
 * Bring your own charting library (recharts, chart.js, etc.).
 *
 * @example
 * ```tsx
 * import { LineChart, Line, XAxis, YAxis } from 'recharts';
 *
 * <ChartContainer
 *   title="Revenue Trend"
 *   subtitle="Last 12 months"
 *   type="line"
 *   height={300}
 *   legend={[
 *     { label: 'Revenue', color: '#3b82f6' },
 *     { label: 'Expenses', color: '#ef4444' }
 *   ]}
 *   timeRanges={['1W', '1M', '3M', '1Y']}
 *   currentTimeRange="1M"
 *   onTimeRangeChange={setRange}
 * >
 *   <LineChart data={data}>
 *     <XAxis dataKey="month" />
 *     <YAxis />
 *     <Line dataKey="revenue" stroke="#3b82f6" />
 *   </LineChart>
 * </ChartContainer>
 * ```
 */
export declare const ChartContainer: default_2.FC<ChartContainerProps>;

export declare interface ChartContainerProps {
    /** Chart title */
    title?: string;
    /** Chart subtitle/description */
    subtitle?: string;
    /** Chart type (for display purposes) */
    type?: ChartType;
    /** Chart height */
    height?: number | string;
    /** Chart content (render your chart library here) */
    children: default_2.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
    /** Legend items */
    legend?: Array<{
        label: string;
        color: string;
    }>;
    /** Time range selector options */
    timeRanges?: string[];
    /** Current time range */
    currentTimeRange?: string;
    /** Called when time range changes */
    onTimeRangeChange?: (range: string) => void;
}

export declare type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'custom';

/**
 * Full chat layout container
 *
 * Provides the outer structure for a chat interface with proper
 * scrolling behavior and layout constraints.
 *
 * @example
 * ```tsx
 * <ChatContainer maxWidth="lg">
 *   <MessageList messages={messages} />
 *   <ChatInput onSubmit={handleSubmit} />
 * </ChatContainer>
 * ```
 */
export declare const ChatContainer: default_2.FC<ChatContainerProps>;

export declare interface ChatContainerProps {
    /** Chat content (MessageList, input, etc.) */
    children: default_2.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Maximum width constraint */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Background variant */
    background?: 'default' | 'subtle' | 'transparent';
}

/**
 * Auto-expanding chat textarea
 *
 * A textarea that grows with content up to maxRows, then scrolls.
 * Submit with Enter, new line with Shift+Enter.
 *
 * @example
 * ```tsx
 * const [input, setInput] = useState('');
 *
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={() => {
 *     sendMessage(input);
 *     setInput('');
 *   }}
 *   placeholder="Type your message..."
 *   autoFocus
 * />
 * ```
 */
export declare const ChatInput: default_2.FC<ChatInputProps>;

export declare interface ChatInputProps {
    /** Current input value */
    value: string;
    /** Called when value changes */
    onChange: (value: string) => void;
    /** Called when user submits (Enter without Shift) */
    onSubmit: () => void;
    /** Placeholder text */
    placeholder?: string;
    /** Disable the input */
    disabled?: boolean;
    /** Maximum rows before scrolling */
    maxRows?: number;
    /** Minimum rows */
    minRows?: number;
    /** Additional CSS classes */
    className?: string;
    /** Auto-focus on mount */
    autoFocus?: boolean;
    /** Show character count */
    showCharCount?: boolean;
    /** Maximum characters */
    maxLength?: number;
    /** Called on focus */
    onFocus?: () => void;
    /** Called on blur */
    onBlur?: () => void;
}

/**
 * Welcome screen with prompts
 *
 * Initial landing state for a chat interface with suggested prompts.
 *
 * @example
 * ```tsx
 * <ChatLanding
 *   title="Hi, I'm Ray"
 *   subtitle="How can I help you today?"
 *   suggestions={[
 *     { id: '1', label: 'Show me recent transactions' },
 *     { id: '2', label: 'Create a payment link' },
 *     { id: '3', label: 'Check settlement status' }
 *   ]}
 *   onSuggestionClick={(s) => setInput(s.label)}
 * />
 * ```
 */
export declare const ChatLanding: default_2.FC<ChatLandingProps>;

export declare interface ChatLandingProps {
    /** Welcome title */
    title?: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Suggested prompts */
    suggestions?: SuggestionItem[];
    /** Called when suggestion is clicked */
    onSuggestionClick?: (suggestion: SuggestionItem) => void;
    /** Custom logo element */
    logo?: default_2.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
}

/**
 * Syntax highlighted code block
 *
 * Displays code with optional line numbers, copy button, and line highlighting.
 * Note: Actual syntax highlighting requires a library like Prism or highlight.js
 * to be integrated by the consumer.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code={`function hello() {
 *   console.log("Hello, World!");
 * }`}
 *   language="javascript"
 *   showLineNumbers
 *   onCopy={() => toast.success('Copied!')}
 * />
 * ```
 */
export declare const CodeBlock: default_2.FC<CodeBlockProps>;

export declare interface CodeBlockProps {
    /** Code content */
    code: string;
    /** Programming language */
    language?: string;
    /** Show line numbers */
    showLineNumbers?: boolean;
    /** Called when copy button clicked */
    onCopy?: () => void;
    /** Title/filename */
    title?: string;
    /** Maximum height before scrolling */
    maxHeight?: number | string;
    /** Additional CSS classes */
    className?: string;
    /** Highlight specific lines (1-indexed) */
    highlightLines?: number[];
}

/**
 * Key-value display card
 *
 * Shows structured data in a card format with labels and values.
 * Supports icons, highlighting, and action buttons.
 *
 * @example
 * ```tsx
 * <DataCard
 *   title="Transaction Details"
 *   subtitle="Payment ID: pay_123456"
 *   fields={[
 *     { label: 'Amount', value: '₹5,000.00', highlight: true },
 *     { label: 'Status', value: <Badge variant="success">Captured</Badge> },
 *     { label: 'Method', value: 'UPI' },
 *     { label: 'Date', value: 'Jan 15, 2025' },
 *     { label: 'Notes', value: 'Customer refund request', fullWidth: true }
 *   ]}
 *   actions={[
 *     { id: 'refund', label: 'Refund', variant: 'secondary', onClick: handleRefund },
 *     { id: 'details', label: 'View Details', variant: 'primary', onClick: handleDetails }
 *   ]}
 * />
 * ```
 */
export declare const DataCard: default_2.FC<DataCardProps>;

export declare interface DataCardAction {
    id: string;
    label: string;
    icon?: default_2.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export declare interface DataCardProps {
    /** Card title */
    title?: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Data fields to display */
    fields: DataField[];
    /** Action buttons */
    actions?: DataCardAction[];
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
    /** Layout style */
    layout?: 'grid' | 'stacked';
    /** Show dividers between fields */
    dividers?: boolean;
}

export declare interface DataField {
    /** Field label */
    label: string;
    /** Field value */
    value: default_2.ReactNode;
    /** Optional icon */
    icon?: default_2.ReactNode;
    /** Highlight the value */
    highlight?: boolean;
    /** Full width (spans both columns) */
    fullWidth?: boolean;
}

/**
 * Animated data table
 *
 * Displays tabular data with animated row entry, custom cell renderers,
 * and interactive row clicks.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: 'id', label: 'ID', width: 80 },
 *     { key: 'name', label: 'Name' },
 *     { key: 'amount', label: 'Amount', align: 'right',
 *       render: (val) => `$${val.toFixed(2)}` },
 *     { key: 'status', label: 'Status',
 *       render: (val) => <Badge variant={val}>{val}</Badge> }
 *   ]}
 *   rows={transactions}
 *   onRowClick={(row) => openDetails(row.id)}
 *   animate
 * />
 * ```
 */
export declare function DataTable<T extends Record<string, unknown>>({ columns, rows, onRowClick, animate, showHeader, striped, hoverable, compact, className, emptyMessage, getRowKey, }: DataTableProps<T>): JSX_2.Element;

export declare interface DataTableProps<T = Record<string, unknown>> {
    /** Column definitions */
    columns: TableColumn<T>[];
    /** Row data */
    rows: T[];
    /** Called when row is clicked */
    onRowClick?: (row: T, index: number) => void;
    /** Animate row entry */
    animate?: boolean;
    /** Show header */
    showHeader?: boolean;
    /** Striped rows */
    striped?: boolean;
    /** Hoverable rows */
    hoverable?: boolean;
    /** Compact size */
    compact?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Empty state message */
    emptyMessage?: string;
    /** Row key extractor */
    getRowKey?: (row: T, index: number) => string | number;
}

declare type DocumentType_2 = 'pdf' | 'image' | 'embed';
export { DocumentType_2 as DocumentType }

/**
 * PDF/Document preview component
 *
 * Embeds a document viewer with optional pagination controls.
 * Uses iframe for PDF rendering.
 *
 * @example
 * ```tsx
 * // PDF document
 * <DocumentViewer
 *   src="/invoice.pdf"
 *   type="pdf"
 *   title="Invoice #12345"
 *   pages={3}
 *   height={500}
 *   showDownload
 * />
 *
 * // Image as document
 * <DocumentViewer
 *   src="/receipt.png"
 *   type="image"
 *   title="Receipt"
 * />
 * ```
 */
export declare const DocumentViewer: default_2.FC<DocumentViewerProps>;

export declare interface DocumentViewerProps {
    /** Document source URL */
    src: string;
    /** Document type */
    type?: DocumentType_2;
    /** Document title */
    title?: string;
    /** Number of pages (for display) */
    pages?: number;
    /** Current page (1-indexed) */
    currentPage?: number;
    /** Height of the viewer */
    height?: number | string;
    /** Additional CSS classes */
    className?: string;
    /** Called on page change */
    onPageChange?: (page: number) => void;
    /** Show download button */
    showDownload?: boolean;
    /** Download URL (if different from src) */
    downloadUrl?: string;
}

/**
 * Inline edit field
 *
 * Value display that switches to edit mode on click.
 *
 * @example
 * ```tsx
 * <EditableField
 *   label="Customer Name"
 *   value={customerName}
 *   onSave={(newName) => updateCustomer({ name: newName })}
 *   placeholder="Enter name"
 * />
 * ```
 */
export declare const EditableField: default_2.FC<EditableFieldProps>;

export declare interface EditableFieldProps {
    /** Current value */
    value: string;
    /** Save handler */
    onSave: (value: string) => void;
    /** Cancel handler */
    onCancel?: () => void;
    /** Error message */
    error?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Field type */
    type?: 'text' | 'number' | 'email';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Start in edit mode */
    startEditing?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Label text */
    label?: string;
    /** Is saving */
    isSaving?: boolean;
}

/**
 * Error state display with retry option
 *
 * Error feedback with optional retry and dismiss actions.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Something went wrong"
 *   message="We couldn't process your request. Please try again."
 *   errorCode="ERR_500"
 *   onRetry={() => retryRequest()}
 *   onDismiss={() => dismissError()}
 * />
 * ```
 */
export declare const ErrorState: default_2.FC<ErrorStateProps>;

export declare interface ErrorStateProps {
    /** Error title */
    title?: string;
    /** Error message/description */
    message: string;
    /** Show retry button */
    onRetry?: () => void;
    /** Retry button label */
    retryLabel?: string;
    /** Show dismiss button */
    onDismiss?: () => void;
    /** Dismiss button label */
    dismissLabel?: string;
    /** Error code or reference */
    errorCode?: string;
    /** Custom icon */
    icon?: default_2.ReactNode;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Variant style */
    variant?: 'inline' | 'full';
    /** Additional CSS classes */
    className?: string;
}

export declare const fadeIn: Variants;

export declare type FeedbackType = 'thumbs' | 'rating' | 'emoji';

export declare type FeedbackValue = 'positive' | 'negative' | number | string;

export declare type FieldType = 'text' | 'email' | 'number' | 'select' | 'textarea';

/**
 * Drag-drop file upload component
 *
 * Supports both dropzone and button variants with file validation.
 *
 * @example
 * ```tsx
 * // Dropzone
 * <FileUpload
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   onUpload={(files) => handleFiles(files)}
 *   variant="dropzone"
 *   multiple
 * />
 *
 * // Button
 * <FileUpload
 *   accept="image/*"
 *   onUpload={(files) => handleFiles(files)}
 *   variant="button"
 *   buttonLabel="Attach Image"
 * />
 * ```
 */
export declare const FileUpload: default_2.FC<FileUploadProps>;

export declare interface FileUploadProps {
    /** Accepted file types (e.g., "image/*,.pdf") */
    accept?: string;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Maximum number of files */
    maxFiles?: number;
    /** Called when files are selected/dropped */
    onUpload: (files: File[]) => void;
    /** Called on error */
    onError?: (error: string) => void;
    /** Display variant */
    variant?: FileUploadVariant;
    /** Allow multiple files */
    multiple?: boolean;
    /** Disable upload */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Custom button label */
    buttonLabel?: string;
    /** Dropzone label */
    dropzoneLabel?: string;
}

export declare type FileUploadVariant = 'dropzone' | 'button';

/**
 * Overlay panel
 *
 * Floating panel that slides in from edges or appears centered.
 *
 * @example
 * ```tsx
 * <FloatingPanel
 *   isOpen={showPanel}
 *   onClose={() => setShowPanel(false)}
 *   position="right"
 *   size="md"
 *   title="Transaction Details"
 * >
 *   <TransactionDetails data={transaction} />
 * </FloatingPanel>
 * ```
 */
export declare const FloatingPanel: default_2.FC<FloatingPanelProps>;

export declare interface FloatingPanelProps {
    /** Panel visibility */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Panel position */
    position?: PanelPosition;
    /** Panel size */
    size?: PanelSize;
    /** Panel title */
    title?: string;
    /** Panel content */
    children: default_2.ReactNode;
    /** Show overlay backdrop */
    showOverlay?: boolean;
    /** Close on overlay click */
    closeOnOverlayClick?: boolean;
    /** Show close button */
    showCloseButton?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Copy/share/feedback action strip
 *
 * Action buttons typically shown at the end of an AI message.
 *
 * @example
 * ```tsx
 * <FooterActions
 *   onCopy={() => copyToClipboard(content)}
 *   onThumbsUp={() => sendFeedback('positive')}
 *   onThumbsDown={() => sendFeedback('negative')}
 *   feedback={userFeedback}
 * />
 * ```
 */
export declare const FooterActions: default_2.FC<FooterActionsProps>;

export declare interface FooterActionsProps {
    /** Copy handler */
    onCopy?: () => void;
    /** Share handler */
    onShare?: () => void;
    /** Thumbs up handler */
    onThumbsUp?: () => void;
    /** Thumbs down handler */
    onThumbsDown?: () => void;
    /** Regenerate handler */
    onRegenerate?: () => void;
    /** Current feedback state */
    feedback?: 'up' | 'down' | null;
    /** Show copy button */
    showCopy?: boolean;
    /** Show share button */
    showShare?: boolean;
    /** Show feedback buttons */
    showFeedback?: boolean;
    /** Show regenerate button */
    showRegenerate?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md';
}

export declare interface FormField {
    /** Field name (key) */
    name: string;
    /** Field label */
    label: string;
    /** Field type */
    type?: FieldType;
    /** Placeholder text */
    placeholder?: string;
    /** Required field */
    required?: boolean;
    /** Default value */
    defaultValue?: string;
    /** Options for select type */
    options?: Array<{
        label: string;
        value: string;
    }>;
    /** Validation pattern */
    pattern?: RegExp;
    /** Error message */
    errorMessage?: string;
}

/**
 * Step wrapper with stepper icon
 *
 * Individual step in a multi-step wizard with visual indicator.
 *
 * @example
 * ```tsx
 * <FormStep
 *   title="Payment Details"
 *   stepNumber={1}
 *   status="complete"
 *   summary="UPI payment of ₹5,000"
 *   isExpanded={false}
 * >
 *   <PaymentForm />
 * </FormStep>
 * ```
 */
export declare const FormStep: default_2.FC<FormStepProps>;

export declare interface FormStepProps {
    /** Step title */
    title: string;
    /** Step number (1-indexed) */
    stepNumber: number;
    /** Step status */
    status?: StepStatus;
    /** Summary text (shown when collapsed) */
    summary?: string;
    /** Step content */
    children: default_2.ReactNode;
    /** Is the step expanded */
    isExpanded?: boolean;
    /** Toggle expansion handler */
    onToggle?: () => void;
    /** Show connector line to next step */
    showConnector?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export declare interface FormWizardStep<T> {
    /** Step ID */
    id: string;
    /** Step title */
    title: string;
    /** Fields that belong to this step */
    fields?: (keyof T)[];
    /** Validation function for this step */
    validate?: (data: Partial<T>) => boolean | string | Promise<boolean | string>;
    /** Whether step can be skipped */
    optional?: boolean;
}

export declare interface HighlightPattern {
    /** Regex pattern to match */
    pattern: RegExp;
    /** CSS class to apply */
    className?: string;
    /** Custom render function */
    render?: (match: string, index: number) => default_2.ReactNode;
}

/**
 * Image viewer with optional zoom
 *
 * Displays an image with optional lightbox zoom functionality.
 *
 * @example
 * ```tsx
 * <ImageViewer
 *   src="/chart.png"
 *   alt="Monthly revenue chart"
 *   caption="Revenue trends for Q4 2024"
 *   zoomable
 *   aspectRatio="16/9"
 * />
 * ```
 */
export declare const ImageViewer: default_2.FC<ImageViewerProps>;

export declare interface ImageViewerProps {
    /** Image source URL */
    src: string;
    /** Alt text */
    alt?: string;
    /** Enable zoom on click */
    zoomable?: boolean;
    /** Caption text */
    caption?: string;
    /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
    aspectRatio?: string;
    /** Maximum height */
    maxHeight?: number | string;
    /** Object fit */
    fit?: 'cover' | 'contain' | 'fill';
    /** Additional CSS classes */
    className?: string;
    /** Called when image fails to load */
    onError?: () => void;
}

/**
 * Single-step inline form
 *
 * Simple form for collecting data inline in the chat.
 *
 * @example
 * ```tsx
 * <InlineForm
 *   title="Quick Refund"
 *   fields={[
 *     { name: 'amount', label: 'Amount', type: 'number', required: true },
 *     { name: 'reason', label: 'Reason', type: 'select',
 *       options: [
 *         { label: 'Customer request', value: 'customer' },
 *         { label: 'Duplicate payment', value: 'duplicate' }
 *       ]
 *     }
 *   ]}
 *   onSubmit={(values) => processRefund(values)}
 *   submitLabel="Process Refund"
 * />
 * ```
 */
export declare const InlineForm: default_2.FC<InlineFormProps>;

export declare interface InlineFormProps {
    /** Form fields */
    fields: FormField[];
    /** Submit handler */
    onSubmit: (values: Record<string, string>) => void;
    /** Cancel handler */
    onCancel?: () => void;
    /** Layout direction */
    layout?: 'vertical' | 'horizontal';
    /** Submit button text */
    submitLabel?: string;
    /** Cancel button text */
    cancelLabel?: string;
    /** Form title */
    title?: string;
    /** Is submitting */
    isSubmitting?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
}

/**
 * AI Logo with animated states
 *
 * Displays the Ray AI logo with optional rotation, pulse, or no animation.
 * The stepped rotation animation pauses at 90-degree intervals for a
 * mechanical, thinking appearance.
 *
 * @example
 * ```tsx
 * // Thinking state with rotation
 * <Logo animate="rotate" size="md" />
 *
 * // Static logo
 * <Logo animate="none" size="lg" />
 *
 * // Pulse animation
 * <Logo animate="pulse" color="#3b82f6" />
 * ```
 */
export declare const Logo: default_2.FC<LogoProps>;

export declare type LogoAnimateState = 'rotate' | 'pulse' | 'none';

export declare interface LogoProps {
    /** Size of the logo */
    size?: LogoSize;
    /** Animation state */
    animate?: LogoAnimateState;
    /** Custom color (overrides default) */
    color?: string;
    /** Additional CSS classes */
    className?: string;
    /** Pause the animation */
    isPaused?: boolean;
}

export declare type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Markdown renderer with smart highlighting
 *
 * Renders basic markdown (bold, italic, code, links) with optional
 * custom highlight patterns for emphasizing specific content.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Markdown content="**Bold** and *italic* text" />
 *
 * // With custom highlights
 * <Markdown
 *   content="The total is $1,234.56"
 *   highlightPatterns={[
 *     {
 *       pattern: /\$[\d,]+\.\d{2}/g,
 *       className: "text-emerald-600 font-semibold"
 *     }
 *   ]}
 * />
 * ```
 */
export declare const Markdown: default_2.FC<MarkdownProps>;

export declare interface MarkdownProps {
    /** The markdown content to render */
    content: string;
    /** Additional patterns to highlight */
    highlightPatterns?: HighlightPattern[];
    /** Additional CSS classes */
    className?: string;
    /** Whether to apply the blade-ai-markdown class for default styling */
    applyDefaultStyles?: boolean;
}

declare interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
    [key: string]: unknown;
}

/**
 * Group consecutive messages from same sender
 *
 * Visually groups multiple messages from the same sender with
 * reduced spacing and optional staggered animation.
 *
 * @example
 * ```tsx
 * <MessageGroup sender="assistant">
 *   <AssistantMessage showLogo>First part of response...</AssistantMessage>
 *   <AssistantMessage showLogo={false}>Continuation...</AssistantMessage>
 *   <AssistantMessage showLogo={false}>Final part...</AssistantMessage>
 * </MessageGroup>
 * ```
 */
export declare const MessageGroup: default_2.FC<MessageGroupProps>;

export declare interface MessageGroupProps {
    /** Messages in the group */
    children: default_2.ReactNode;
    /** Sender type for styling */
    sender: 'user' | 'assistant';
    /** Additional CSS classes */
    className?: string;
    /** Animate children stagger */
    animate?: boolean;
    /** Gap between messages in group */
    gap?: 'xs' | 'sm' | 'md';
}

/**
 * Scrollable message container with auto-scroll
 *
 * Renders a list of messages with proper scrolling behavior.
 * Auto-scrolls to bottom when new messages arrive if user is
 * near the bottom.
 *
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   renderMessage={(msg, idx, isLast) => (
 *     msg.role === 'user'
 *       ? <UserMessage content={msg.content} />
 *       : <AssistantMessage isLast={isLast}>{msg.content}</AssistantMessage>
 *   )}
 *   autoScroll
 * />
 * ```
 */
export declare function MessageList<T extends Message = Message>({ messages, renderMessage, onScroll, autoScroll, autoScrollThreshold, className, gap, animate, }: MessageListProps<T>): JSX_2.Element;

export declare interface MessageListProps<T extends Message = Message> {
    /** Array of messages to display */
    messages: T[];
    /** Custom renderer for each message */
    renderMessage: (message: T, index: number, isLast: boolean) => default_2.ReactNode;
    /** Called when user scrolls */
    onScroll?: (event: default_2.UIEvent<HTMLDivElement>) => void;
    /** Enable auto-scroll to bottom on new messages */
    autoScroll?: boolean;
    /** Distance from bottom to trigger auto-scroll (px) */
    autoScrollThreshold?: number;
    /** Additional CSS classes */
    className?: string;
    /** Gap between messages */
    gap?: 'sm' | 'md' | 'lg';
    /** Animate message entry */
    animate?: boolean;
}

/**
 * Message loading skeleton
 *
 * Placeholder for loading message content with shimmer animation.
 *
 * @example
 * ```tsx
 * <MessageSkeleton variant="assistant" lines={3} animate="shimmer" />
 * <MessageSkeleton variant="user" lines={1} />
 * ```
 */
export declare const MessageSkeleton: default_2.FC<MessageSkeletonProps>;

export declare interface MessageSkeletonProps {
    /** Message type */
    variant?: MessageSkeletonVariant;
    /** Number of text lines */
    lines?: number;
    /** Animation type */
    animate?: SkeletonAnimation_2;
    /** Show avatar */
    showAvatar?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export declare type MessageSkeletonVariant = 'user' | 'assistant';

export declare interface Milestone {
    /** Milestone ID */
    id: string;
    /** Milestone label */
    label: string;
    /** Optional timestamp */
    timestamp?: string | Date;
    /** Status (overrides automatic detection) */
    status?: MilestoneStatus;
    /** Optional description */
    description?: string;
}

/**
 * Multi-step progress tracker
 *
 * Journey/timeline view for tracking milestones.
 *
 * @example
 * ```tsx
 * <Milestones
 *   milestones={[
 *     { id: 'created', label: 'Order Created', timestamp: '10:30 AM', status: 'complete' },
 *     { id: 'processing', label: 'Processing', timestamp: '10:35 AM', status: 'complete' },
 *     { id: 'shipped', label: 'Shipped', status: 'active' },
 *     { id: 'delivered', label: 'Delivered', status: 'pending' }
 *   ]}
 *   activeMilestone="shipped"
 * />
 * ```
 */
export declare const Milestones: default_2.FC<MilestonesProps>;

export declare interface MilestonesProps {
    /** Milestones configuration */
    milestones: Milestone[];
    /** Currently active milestone (by ID) */
    activeMilestone?: string;
    /** Click handler */
    onMilestoneClick?: (milestone: Milestone) => void;
    /** Orientation */
    orientation?: 'horizontal' | 'vertical';
    /** Additional CSS classes */
    className?: string;
}

export declare type MilestoneStatus = 'pending' | 'active' | 'complete' | 'skipped';

export declare type PanelPosition = 'right' | 'left' | 'bottom' | 'center';

export declare type PanelSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Pending/loading state display
 *
 * Waiting state with optional time estimate and cancel action.
 *
 * @example
 * ```tsx
 * <PendingState
 *   message="Processing your request..."
 *   estimatedTime="~30 seconds"
 *   onCancel={() => cancelRequest()}
 * />
 * ```
 */
export declare const PendingState: default_2.FC<PendingStateProps>;

export declare interface PendingStateProps {
    /** Loading message */
    message?: string;
    /** Estimated time remaining */
    estimatedTime?: string;
    /** Show cancel button */
    onCancel?: () => void;
    /** Cancel button label */
    cancelLabel?: string;
    /** Loading indicator variant */
    variant?: 'spinner' | 'dots' | 'pulse';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export declare interface ProcessingField {
    /** Field name */
    name: string;
    /** Field status */
    status: ProcessingFieldStatus;
    /** Extracted value (when complete) */
    value?: string;
}

export declare type ProcessingFieldStatus = 'pending' | 'extracting' | 'complete' | 'error';

/**
 * Step-by-step extraction progress display
 *
 * Shows progress of extracting/processing multiple fields with
 * individual status indicators.
 *
 * @example
 * ```tsx
 * <ProcessingSteps
 *   title="Extracting transaction details..."
 *   fields={[
 *     { name: 'Transaction ID', status: 'complete', value: 'TXN_123456' },
 *     { name: 'Amount', status: 'complete', value: '$500.00' },
 *     { name: 'Customer Name', status: 'extracting' },
 *     { name: 'Payment Method', status: 'pending' }
 *   ]}
 *   progress={50}
 *   showProgress
 * />
 * ```
 */
export declare const ProcessingSteps: default_2.FC<ProcessingStepsProps>;

export declare interface ProcessingStepsProps {
    /** Fields being processed */
    fields: ProcessingField[];
    /** Overall progress (0-100) */
    progress?: number;
    /** Show progress bar */
    showProgress?: boolean;
    /** Title text */
    title?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Linear progress bar
 *
 * Horizontal progress indicator with various styles.
 *
 * @example
 * ```tsx
 * <ProgressBar value={65} showLabel />
 *
 * <ProgressBar
 *   value={uploading}
 *   max={fileSize}
 *   variant="success"
 *   showLabel
 *   labelPosition="right"
 * />
 *
 * // Indeterminate loading
 * <ProgressBar indeterminate />
 * ```
 */
export declare const ProgressBar: default_2.FC<ProgressBarProps>;

export declare interface ProgressBarProps {
    /** Current value */
    value: number;
    /** Maximum value */
    max?: number;
    /** Show percentage label */
    showLabel?: boolean;
    /** Label position */
    labelPosition?: 'inside' | 'right' | 'top';
    /** Visual variant */
    variant?: ProgressBarVariant;
    /** Size */
    size?: ProgressBarSize;
    /** Additional CSS classes */
    className?: string;
    /** Animate the progress */
    animate?: boolean;
    /** Indeterminate loading state */
    indeterminate?: boolean;
}

export declare type ProgressBarSize = 'sm' | 'md' | 'lg';

export declare type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error' | 'gradient';

/**
 * Circular progress indicator
 *
 * Animated circular progress with optional center label.
 *
 * @example
 * ```tsx
 * <ProgressRing value={75} max={100} size="lg" />
 *
 * <ProgressRing
 *   value={3}
 *   max={5}
 *   size="md"
 *   label={<span className="font-bold">3/5</span>}
 *   color="#22c55e"
 * />
 * ```
 */
export declare const ProgressRing: default_2.FC<ProgressRingProps>;

export declare interface ProgressRingProps {
    /** Current value */
    value: number;
    /** Maximum value */
    max?: number;
    /** Size variant */
    size?: ProgressRingSize;
    /** Show label in center */
    label?: string | default_2.ReactNode;
    /** Ring color */
    color?: string;
    /** Track color */
    trackColor?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Additional CSS classes */
    className?: string;
    /** Animate the progress */
    animate?: boolean;
}

export declare type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Pulse animation for loading states
 */
export declare const pulsingDot: Variants;

/**
 * Rate limit error with countdown
 *
 * Shows a countdown timer until the rate limit resets.
 *
 * @example
 * ```tsx
 * <RateLimitError
 *   retryAfter={60}
 *   onRetry={() => retryRequest()}
 *   title="Too many requests"
 *   message="Please wait before trying again"
 * />
 * ```
 */
export declare const RateLimitError: default_2.FC<RateLimitErrorProps>;

export declare interface RateLimitErrorProps {
    /** Seconds until retry is allowed */
    retryAfter: number;
    /** Callback when countdown completes */
    onRetry?: () => void;
    /** Custom title */
    title?: string;
    /** Custom message */
    message?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Stepped 90-degree rotation for thinking indicators
 * Rotates through 0 -> 90 -> 180 -> 270 -> 360 with pauses
 */
export declare const rotatingLogo: {
    rotate: number[];
    transition: {
        duration: number;
        repeat: number;
        ease: [number, number, number, number];
        times: number[];
    };
};

export declare const scaleIn: Variants;

/**
 * Multi-select option chips
 *
 * Selectable option buttons for single or multiple selection.
 *
 * @example
 * ```tsx
 * // Single select
 * <SelectableOptions
 *   options={[
 *     { value: 'upi', label: 'UPI', icon: <UpiIcon /> },
 *     { value: 'card', label: 'Card', icon: <CardIcon /> },
 *     { value: 'netbanking', label: 'Net Banking' }
 *   ]}
 *   selected={paymentMethod}
 *   onChange={setPaymentMethod}
 * />
 *
 * // Multi-select
 * <SelectableOptions
 *   options={[
 *     { value: 'email', label: 'Email' },
 *     { value: 'sms', label: 'SMS' },
 *     { value: 'whatsapp', label: 'WhatsApp' }
 *   ]}
 *   selected={notifications}
 *   onChange={setNotifications}
 *   multiple
 *   direction="horizontal"
 * />
 * ```
 */
export declare const SelectableOptions: default_2.FC<SelectableOptionsProps>;

export declare interface SelectableOptionsProps {
    /** Available options */
    options: SelectOption[];
    /** Selected value(s) */
    selected: string | string[];
    /** Change handler */
    onChange: (selected: string | string[]) => void;
    /** Allow multiple selection */
    multiple?: boolean;
    /** Layout direction */
    direction?: 'horizontal' | 'vertical' | 'grid';
    /** Columns for grid layout */
    columns?: 2 | 3 | 4;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export declare interface SelectOption {
    /** Option value */
    value: string;
    /** Display label */
    label: string;
    /** Optional description */
    description?: string;
    /** Optional icon */
    icon?: default_2.ReactNode;
    /** Disabled state */
    disabled?: boolean;
}

/**
 * Submit/stop button for chat input
 *
 * Animated button that switches between send and stop states.
 * Shows loading spinner when processing.
 *
 * @example
 * ```tsx
 * // Send state
 * <SendButton
 *   onClick={handleSend}
 *   disabled={!hasContent}
 * />
 *
 * // Stop state (during streaming)
 * <SendButton
 *   onClick={handleStop}
 *   variant="stop"
 * />
 *
 * // Loading
 * <SendButton onClick={handleSend} isLoading />
 * ```
 */
export declare const SendButton: default_2.FC<SendButtonProps>;

export declare interface SendButtonProps {
    /** Click handler */
    onClick: () => void;
    /** Button variant */
    variant?: SendButtonVariant;
    /** Loading/processing state */
    isLoading?: boolean;
    /** Disable the button */
    disabled?: boolean;
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export declare type SendButtonVariant = 'send' | 'stop';

export declare type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

declare type SkeletonAnimation_2 = 'pulse' | 'shimmer' | 'none';

declare type SkeletonAnimation_3 = 'pulse' | 'shimmer' | 'none';

declare type SkeletonAnimation_4 = 'pulse' | 'shimmer' | 'none';

export declare const slideDown: Variants;

export declare const slideUp: Variants;

/**
 * Simple inline text with bold pattern support
 * Used for streaming text final render
 */
export declare const SmartText: default_2.FC<{
    content: string;
    className?: string;
}>;

export declare type SplitRatio = '1:1' | '1:2' | '2:1' | '1:3' | '3:1';

/**
 * Side-by-side layout
 *
 * Split view for chat alongside artifact panel.
 *
 * @example
 * ```tsx
 * <SplitView
 *   left={<MessageList messages={messages} />}
 *   right={<ArtifactViewer artifact={artifact} />}
 *   ratio="2:1"
 *   collapsible
 * />
 * ```
 */
export declare const SplitView: default_2.FC<SplitViewProps>;

export declare interface SplitViewProps {
    /** Left panel content */
    left: default_2.ReactNode;
    /** Right panel content */
    right: default_2.ReactNode;
    /** Split ratio (left:right) */
    ratio?: SplitRatio;
    /** Right panel is collapsible */
    collapsible?: boolean;
    /** Initial collapsed state */
    defaultCollapsed?: boolean;
    /** Collapsed state (controlled) */
    collapsed?: boolean;
    /** Called when collapse state changes */
    onCollapsedChange?: (collapsed: boolean) => void;
    /** Minimum width for panels (px) */
    minWidth?: number;
    /** Gap between panels */
    gap?: 'none' | 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export declare const springConfig: Transition;

export declare const staggerContainer: Variants;

/**
 * Step indicator
 *
 * Visual stepper for multi-step processes.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: 'details', label: 'Details' },
 *     { id: 'review', label: 'Review' },
 *     { id: 'confirm', label: 'Confirm' }
 *   ]}
 *   activeStep={1}
 *   onStepClick={(index) => goToStep(index)}
 * />
 * ```
 */
export declare const Stepper: default_2.FC<StepperProps>;

export declare type StepperOrientation = 'horizontal' | 'vertical';

export declare interface StepperProps {
    /** Steps configuration */
    steps: StepperStep[];
    /** Currently active step (0-indexed) */
    activeStep: number;
    /** Orientation */
    orientation?: StepperOrientation;
    /** Click handler for steps */
    onStepClick?: (stepIndex: number, step: StepperStep) => void;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export declare interface StepperStep {
    /** Step ID */
    id: string;
    /** Step label */
    label: string;
    /** Optional description */
    description?: string;
    /** Step status (overrides automatic detection) */
    status?: StepperStepStatus;
}

export declare type StepperStepStatus = 'pending' | 'active' | 'complete' | 'error';

export declare type StepStatus = 'pending' | 'active' | 'complete' | 'error';

export declare type StreamingStyle = 'basic' | 'typewriter' | 'glow' | 'gradient';

/**
 * Character-by-character streaming text with multiple animation styles
 *
 * Supports markdown bold syntax (**text**) which is rendered as the text
 * streams. Different styles provide various visual effects for AI responses.
 *
 * @example
 * ```tsx
 * // Basic streaming
 * <StreamingText content="Hello, world!" speed={15} />
 *
 * // Typewriter with cursor
 * <StreamingText
 *   content="Processing your request..."
 *   style="typewriter"
 *   onComplete={() => console.log('Done!')}
 * />
 *
 * // Glowing green text
 * <StreamingText
 *   content="**Important:** This is highlighted"
 *   style="glow"
 *   glowIntensity={80}
 * />
 * ```
 */
export declare const StreamingText: default_2.FC<StreamingTextProps>;

export declare interface StreamingTextProps {
    /** The content to stream */
    content: string;
    /** Milliseconds per character */
    speed?: number;
    /** Animation style variant */
    style?: StreamingStyle;
    /** Called when streaming completes */
    onComplete?: () => void;
    /** Additional CSS classes */
    className?: string;
    /** Inherit font styles from parent (for headlines) */
    inheritStyles?: boolean;
    /** Intensity of glow/gradient effect (0-100) */
    glowIntensity?: number;
    /** Number of characters for trailing glow effect */
    trailLength?: number;
    /** Pause the streaming */
    isPaused?: boolean;
}

export declare interface StreamPhase {
    /** Unique phase ID */
    id: string;
    /** Duration in ms before moving to next phase */
    duration?: number;
    /** Delay before this phase starts */
    delay?: number;
}

export declare interface SuccessAction {
    /** Button label */
    label: string;
    /** Click handler */
    onClick: () => void;
    /** Button variant */
    variant?: 'primary' | 'secondary';
}

/**
 * Success state display with animation
 *
 * Celebratory state for completed actions.
 *
 * @example
 * ```tsx
 * <SuccessState
 *   title="Payment Successful!"
 *   subtitle="Your transaction has been processed"
 *   actions={[
 *     { label: 'View Receipt', onClick: viewReceipt, variant: 'primary' },
 *     { label: 'Back to Home', onClick: goHome }
 *   ]}
 * />
 * ```
 */
export declare const SuccessState: default_2.FC<SuccessStateProps>;

export declare interface SuccessStateProps {
    /** Success title */
    title: string;
    /** Optional subtitle/description */
    subtitle?: string;
    /** Custom icon */
    icon?: default_2.ReactNode;
    /** Action buttons */
    actions?: SuccessAction[];
    /** Additional content */
    children?: default_2.ReactNode;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export declare interface SuggestionItem {
    id: string;
    label: string;
    icon?: default_2.ReactNode;
}

/**
 * Follow-up suggestion pills
 *
 * Clickable suggestion buttons for follow-up questions.
 *
 * @example
 * ```tsx
 * <SuggestionPills
 *   suggestions={[
 *     "Show more details",
 *     "Refund this transaction",
 *     "Contact the customer"
 *   ]}
 *   onClick={(suggestion) => setInput(suggestion)}
 *   numbered
 *   stagger
 * />
 * ```
 */
export declare const SuggestionPills: default_2.FC<SuggestionPillsProps>;

export declare interface SuggestionPillsProps {
    /** Array of suggestion strings */
    suggestions: string[];
    /** Click handler */
    onClick: (suggestion: string, index: number) => void;
    /** Show numbers before suggestions */
    numbered?: boolean;
    /** Stagger animation */
    stagger?: boolean;
    /** Layout direction */
    direction?: 'horizontal' | 'vertical';
    /** Maximum suggestions to show */
    maxVisible?: number;
    /** Highlighted suggestion index */
    highlightedIndex?: number | null;
    /** Additional CSS classes */
    className?: string;
    /** Pill size */
    size?: 'sm' | 'md';
}

export declare interface SupportTicket {
    /** Issue type/category */
    type: string;
    /** Issue description */
    description: string;
    /** User email (optional) */
    email?: string;
    /** Priority level */
    priority?: 'low' | 'medium' | 'high';
}

/**
 * Support/help form widget
 *
 * Collapsible support ticket form.
 *
 * @example
 * ```tsx
 * <SupportWidget
 *   onSubmit={async (ticket) => {
 *     await submitSupportTicket(ticket);
 *   }}
 *   isSubmitting={isLoading}
 *   showEmail
 *   showPriority
 * />
 * ```
 */
export declare const SupportWidget: default_2.FC<SupportWidgetProps>;

export declare interface SupportWidgetProps {
    /** Callback when ticket is submitted */
    onSubmit: (ticket: SupportTicket) => void | Promise<void>;
    /** Whether form is submitting */
    isSubmitting?: boolean;
    /** Issue type options */
    issueTypes?: string[];
    /** Show email field */
    showEmail?: boolean;
    /** Show priority selector */
    showPriority?: boolean;
    /** Custom title */
    title?: string;
    /** Custom submit button label */
    submitLabel?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * System/info message
 *
 * Displays system notifications, warnings, or informational messages
 * in the chat flow. Centered and styled distinctly from user/AI messages.
 *
 * @example
 * ```tsx
 * <SystemMessage content="Session started" variant="info" />
 *
 * <SystemMessage
 *   content="Rate limit reached. Please wait."
 *   variant="warning"
 *   dismissible
 *   onDismiss={() => setShowWarning(false)}
 * />
 * ```
 */
export declare const SystemMessage: default_2.FC<SystemMessageProps>;

export declare interface SystemMessageProps {
    /** Message content */
    content: string;
    /** Visual variant */
    variant?: SystemMessageVariant;
    /** Show icon */
    showIcon?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
    /** Dismissible */
    dismissible?: boolean;
    /** Called when dismissed */
    onDismiss?: () => void;
}

export declare type SystemMessageVariant = 'info' | 'warning' | 'error' | 'success';

export declare interface TableColumn<T = Record<string, unknown>> {
    /** Column key */
    key: string;
    /** Column header label */
    label: string;
    /** Column width */
    width?: string | number;
    /** Text alignment */
    align?: 'left' | 'center' | 'right';
    /** Custom cell renderer */
    render?: (value: unknown, row: T, index: number) => default_2.ReactNode;
}

/**
 * Table loading skeleton
 *
 * Placeholder for loading table content.
 *
 * @example
 * ```tsx
 * <TableSkeleton columns={5} rows={8} showHeader animate="shimmer" />
 * ```
 */
export declare const TableSkeleton: default_2.FC<TableSkeletonProps>;

export declare interface TableSkeletonProps {
    /** Number of columns */
    columns?: number;
    /** Number of rows */
    rows?: number;
    /** Show header row */
    showHeader?: boolean;
    /** Animation type */
    animate?: SkeletonAnimation_4;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Text loading skeleton
 *
 * Placeholder for loading text content.
 *
 * @example
 * ```tsx
 * // Paragraph skeleton
 * <TextSkeleton lines={4} natural animate="shimmer" />
 *
 * // Single line with fixed width
 * <TextSkeleton lines={1} width={200} />
 * ```
 */
export declare const TextSkeleton: default_2.FC<TextSkeletonProps>;

export declare interface TextSkeletonProps {
    /** Number of lines */
    lines?: number;
    /** Width of lines (can be percentage or pixels) */
    width?: string | number;
    /** Line height */
    lineHeight?: 'sm' | 'md' | 'lg';
    /** Animation type */
    animate?: SkeletonAnimation;
    /** Vary line widths naturally */
    natural?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Animated thinking/loading state indicator
 *
 * Shows AI processing state with various visual styles.
 * Can display step labels that cycle through.
 *
 * @example
 * ```tsx
 * // Simple logo animation
 * <ThinkingIndicator variant="logo" />
 *
 * // With steps
 * <ThinkingIndicator
 *   variant="logo"
 *   steps={[
 *     { label: 'Analyzing request...' },
 *     { label: 'Searching documents...' },
 *     { label: 'Generating response...' }
 *   ]}
 *   currentStep={1}
 * />
 *
 * // Dots variant
 * <ThinkingIndicator variant="dots" label="Thinking" />
 * ```
 */
export declare const ThinkingIndicator: default_2.FC<ThinkingIndicatorProps>;

export declare interface ThinkingIndicatorProps {
    /** Current thinking steps */
    steps?: ThinkingStep[];
    /** Current active step index */
    currentStep?: number;
    /** Visual variant */
    variant?: ThinkingVariant;
    /** Custom label text */
    label?: string;
    /** Additional CSS classes */
    className?: string;
    /** Pause animation */
    isPaused?: boolean;
}

export declare interface ThinkingStep {
    label: string;
    status?: 'pending' | 'active' | 'complete';
}

export declare type ThinkingVariant = 'spinner' | 'dots' | 'logo';

/**
 * Tool/function call visualization
 *
 * Shows a tool execution with input, output, and status.
 * Useful for displaying AI tool calls in the conversation.
 *
 * @example
 * ```tsx
 * // Running tool
 * <ToolExecution
 *   tool="searchDatabase"
 *   input={{ query: 'user transactions', limit: 10 }}
 *   status="running"
 * />
 *
 * // Completed with output
 * <ToolExecution
 *   tool="calculateTax"
 *   input={{ amount: 1000, rate: 0.08 }}
 *   output={{ tax: 80, total: 1080 }}
 *   status="success"
 *   duration={150}
 *   collapsible
 * />
 *
 * // Error state
 * <ToolExecution
 *   tool="fetchAPI"
 *   input={{ url: 'https://api.example.com' }}
 *   status="error"
 *   error="Connection timeout"
 * />
 * ```
 */
export declare const ToolExecution: default_2.FC<ToolExecutionProps>;

export declare interface ToolExecutionProps {
    /** Tool/function name */
    tool: string;
    /** Input parameters (JSON or string) */
    input?: string | object;
    /** Output result (JSON or string) */
    output?: string | object;
    /** Execution status */
    status?: ToolStatus;
    /** Duration in milliseconds */
    duration?: number;
    /** Error message if status is error */
    error?: string;
    /** Collapsible input/output */
    collapsible?: boolean;
    /** Default collapsed state */
    defaultCollapsed?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export declare type ToolStatus = 'pending' | 'running' | 'success' | 'error';

export declare interface UploadedFile {
    /** Unique file ID */
    id: string;
    /** Original file object */
    file: File;
    /** File name */
    name: string;
    /** File size in bytes */
    size: number;
    /** MIME type */
    type: string;
    /** Upload progress (0-100) */
    progress: number;
    /** Upload status */
    status: 'pending' | 'uploading' | 'complete' | 'error';
    /** Error message if failed */
    error?: string;
    /** Preview URL for images */
    previewUrl?: string;
    /** Server response after upload */
    response?: unknown;
}

/**
 * Hook for managing auto-scroll behavior in chat/message lists
 *
 * @example
 * ```tsx
 * const { scrollRef, isAtBottom, scrollToBottom } = useAutoScroll({
 *   threshold: 100,
 *   autoScrollOnChange: true
 * });
 *
 * return (
 *   <div ref={scrollRef} className="overflow-y-auto h-full">
 *     {messages.map(m => <Message key={m.id} {...m} />)}
 *     {!isAtBottom && (
 *       <button onClick={() => scrollToBottom()}>
 *         Scroll to bottom
 *       </button>
 *     )}
 *   </div>
 * );
 * ```
 */
export declare function useAutoScroll(options?: UseAutoScrollOptions): UseAutoScrollReturn;

export declare interface UseAutoScrollOptions {
    /** Threshold in pixels from bottom to consider "at bottom" */
    threshold?: number;
    /** Smooth or instant scroll behavior */
    behavior?: ScrollBehavior;
    /** Auto-scroll when new content is added */
    autoScrollOnChange?: boolean;
}

export declare interface UseAutoScrollReturn {
    /** Ref to attach to scrollable container */
    scrollRef: React.RefObject<HTMLDivElement>;
    /** Whether user is at the bottom of the container */
    isAtBottom: boolean;
    /** Scroll to bottom of container */
    scrollToBottom: (options?: {
        instant?: boolean;
    }) => void;
    /** Scroll to top of container */
    scrollToTop: (options?: {
        instant?: boolean;
    }) => void;
    /** Scroll to a specific element */
    scrollToElement: (element: HTMLElement, options?: {
        instant?: boolean;
    }) => void;
    /** Check if content is scrollable */
    isScrollable: boolean;
}

/**
 * Hook for managing file uploads with progress tracking
 *
 * @example
 * ```tsx
 * const { files, addFiles, uploadAll, isUploading } = useFileUpload({
 *   maxSize: 10 * 1024 * 1024, // 10MB
 *   accept: ['image/*', 'application/pdf'],
 *   maxFiles: 5,
 *   uploadFn: async (file, onProgress) => {
 *     // Your upload logic
 *     return await uploadToServer(file, onProgress);
 *   }
 * });
 *
 * return (
 *   <div>
 *     <input
 *       type="file"
 *       multiple
 *       onChange={(e) => addFiles(e.target.files)}
 *     />
 *     {files.map(f => (
 *       <div key={f.id}>
 *         {f.name} - {f.progress}%
 *       </div>
 *     ))}
 *     <button onClick={uploadAll} disabled={isUploading}>
 *       Upload All
 *     </button>
 *   </div>
 * );
 * ```
 */
export declare function useFileUpload(options?: UseFileUploadOptions): UseFileUploadReturn;

export declare interface UseFileUploadOptions {
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Accepted file types (MIME types or extensions) */
    accept?: string[];
    /** Maximum number of files */
    maxFiles?: number;
    /** Custom upload function */
    uploadFn?: (file: File, onProgress: (progress: number) => void) => Promise<unknown>;
    /** Callback when file is added */
    onFileAdded?: (file: UploadedFile) => void;
    /** Callback when upload completes */
    onUploadComplete?: (file: UploadedFile) => void;
    /** Callback when upload fails */
    onUploadError?: (file: UploadedFile, error: Error) => void;
}

export declare interface UseFileUploadReturn {
    /** List of uploaded files */
    files: UploadedFile[];
    /** Whether any file is currently uploading */
    isUploading: boolean;
    /** Overall upload progress (0-100) */
    overallProgress: number;
    /** Add files to upload queue */
    addFiles: (files: FileList | File[]) => void;
    /** Upload a specific file */
    uploadFile: (fileId: string) => Promise<void>;
    /** Upload all pending files */
    uploadAll: () => Promise<void>;
    /** Remove a file from the list */
    removeFile: (fileId: string) => void;
    /** Clear all files */
    clearFiles: () => void;
    /** Reset state */
    reset: () => void;
    /** Validate a file against options */
    validateFile: (file: File) => {
        valid: boolean;
        error?: string;
    };
}

/**
 * Hook for managing multi-step wizard form state
 *
 * @example
 * ```tsx
 * interface FormData {
 *   name: string;
 *   email: string;
 *   plan: string;
 *   amount: number;
 * }
 *
 * const {
 *   currentStep,
 *   currentStepConfig,
 *   data,
 *   next,
 *   prev,
 *   updateData,
 *   isLastStep,
 *   submit
 * } = useFormWizard<FormData>({
 *   steps: [
 *     {
 *       id: 'details',
 *       title: 'Customer Details',
 *       fields: ['name', 'email'],
 *       validate: (data) => !!data.name && !!data.email
 *     },
 *     {
 *       id: 'plan',
 *       title: 'Select Plan',
 *       fields: ['plan', 'amount'],
 *       validate: (data) => !!data.plan && (data.amount ?? 0) > 0
 *     },
 *     { id: 'review', title: 'Review & Confirm' }
 *   ],
 *   onComplete: async (data) => {
 *     await submitToServer(data);
 *   }
 * });
 * ```
 */
export declare function useFormWizard<T extends Record<string, unknown>>(options: UseFormWizardOptions<T>): UseFormWizardReturn<T>;

export declare interface UseFormWizardOptions<T> {
    /** Wizard steps configuration */
    steps: FormWizardStep<T>[];
    /** Initial form data */
    initialData?: Partial<T>;
    /** Callback when wizard completes */
    onComplete?: (data: T) => void | Promise<void>;
    /** Callback on step change */
    onStepChange?: (stepIndex: number, step: FormWizardStep<T>) => void;
}

export declare interface UseFormWizardReturn<T> {
    /** Current step index */
    currentStep: number;
    /** Current step configuration */
    currentStepConfig: FormWizardStep<T>;
    /** Total number of steps */
    totalSteps: number;
    /** Whether on first step */
    isFirstStep: boolean;
    /** Whether on last step */
    isLastStep: boolean;
    /** Form data */
    data: Partial<T>;
    /** Step validation errors */
    errors: Record<string, string>;
    /** Whether form is submitting */
    isSubmitting: boolean;
    /** Whether current step is valid */
    isStepValid: boolean;
    /** Go to next step */
    next: () => Promise<boolean>;
    /** Go to previous step */
    prev: () => void;
    /** Go to specific step */
    goToStep: (index: number) => void;
    /** Update form data */
    updateData: (updates: Partial<T>) => void;
    /** Set a specific field value */
    setField: <K extends keyof T>(field: K, value: T[K]) => void;
    /** Validate current step */
    validateStep: () => Promise<boolean>;
    /** Validate all steps */
    validateAll: () => Promise<boolean>;
    /** Submit the form */
    submit: () => Promise<void>;
    /** Reset the wizard */
    reset: () => void;
    /** Get step status */
    getStepStatus: (index: number) => 'pending' | 'active' | 'complete' | 'error';
    /** Check if step is accessible */
    canAccessStep: (index: number) => boolean;
}

/**
 * User feedback collector
 *
 * Thumbs up/down, rating, or emoji feedback.
 *
 * @example
 * ```tsx
 * <UserFeedback
 *   type="thumbs"
 *   showComment
 *   onSubmit={(value, comment) => {
 *     sendFeedback({ rating: value, comment });
 *   }}
 * />
 * ```
 */
export declare const UserFeedback: default_2.FC<UserFeedbackProps>;

export declare interface UserFeedbackProps {
    /** Feedback type */
    type?: FeedbackType;
    /** Callback when feedback is submitted */
    onSubmit?: (value: FeedbackValue, comment?: string) => void;
    /** Show comment input after selection */
    showComment?: boolean;
    /** Comment placeholder */
    commentPlaceholder?: string;
    /** Pre-selected value */
    value?: FeedbackValue | null;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

/**
 * User message bubble (right-aligned)
 *
 * Displays a user's message with optional avatar, timestamp, and attachments.
 * Styled with a blue-tinted background to distinguish from AI responses.
 *
 * @example
 * ```tsx
 * <UserMessage
 *   content="Hello, can you help me with something?"
 *   timestamp={new Date()}
 *   avatarFallback="JD"
 * />
 * ```
 */
export declare const UserMessage: default_2.FC<UserMessageProps>;

export declare interface UserMessageProps {
    /** Message content */
    content: string;
    /** Message timestamp */
    timestamp?: Date | string;
    /** File attachments */
    attachments?: Attachment[];
    /** User avatar source */
    avatarSrc?: string;
    /** User initials for avatar fallback */
    avatarFallback?: string;
    /** Show avatar */
    showAvatar?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Animate entry */
    animate?: boolean;
}

/**
 * Hook for character-by-character text streaming
 *
 * @example
 * ```tsx
 * const { text, isComplete, start } = useStreamingText({ speed: 50 });
 *
 * useEffect(() => {
 *   start("Hello, how can I help you today?");
 * }, []);
 *
 * return <p>{text}{!isComplete && <span className="cursor">|</span>}</p>;
 * ```
 */
export declare function useStreamingText(options?: UseStreamingTextOptions): UseStreamingTextReturn;

export declare interface UseStreamingTextOptions {
    /** Characters per second */
    speed?: number;
    /** Callback when streaming completes */
    onComplete?: () => void;
    /** Auto-start streaming */
    autoStart?: boolean;
}

export declare interface UseStreamingTextReturn {
    /** Current displayed text */
    text: string;
    /** Whether streaming has completed */
    isComplete: boolean;
    /** Whether currently streaming */
    isStreaming: boolean;
    /** Start streaming the text */
    start: (content: string) => void;
    /** Stop streaming */
    stop: () => void;
    /** Reset to initial state */
    reset: () => void;
    /** Skip to end of text */
    skipToEnd: () => void;
}

/**
 * Hook for orchestrating multi-phase streaming sequences
 *
 * @example
 * ```tsx
 * const { showPhase, isPhaseActive, completePhase, start } = useStreamPhases({
 *   phases: [
 *     { id: 'narrative', duration: 2000 },
 *     { id: 'data', delay: 500, duration: 1000 },
 *     { id: 'insight', delay: 400 },
 *     { id: 'actions' }
 *   ],
 *   autoStart: true
 * });
 *
 * return (
 *   <>
 *     {showPhase('narrative') && <Narrative onComplete={completePhase} />}
 *     {showPhase('data') && <DataTable />}
 *     {showPhase('insight') && <Insight />}
 *     {showPhase('actions') && <Actions />}
 *   </>
 * );
 * ```
 */
export declare function useStreamPhases(options: UseStreamPhasesOptions): UseStreamPhasesReturn;

export declare interface UseStreamPhasesOptions {
    /** Array of phases to orchestrate */
    phases: StreamPhase[];
    /** Callback when all phases complete */
    onAllComplete?: () => void;
    /** Auto-start the sequence */
    autoStart?: boolean;
}

export declare interface UseStreamPhasesReturn {
    /** Current active phase ID */
    currentPhase: string | null;
    /** Current phase index */
    currentIndex: number;
    /** Check if a specific phase should be shown */
    showPhase: (phaseId: string) => boolean;
    /** Check if a specific phase is active */
    isPhaseActive: (phaseId: string) => boolean;
    /** Check if a specific phase is complete */
    isPhaseComplete: (phaseId: string) => boolean;
    /** Mark current phase as complete and advance */
    completePhase: () => void;
    /** Start the phase sequence */
    start: () => void;
    /** Reset to initial state */
    reset: () => void;
    /** Whether all phases are complete */
    isAllComplete: boolean;
}

/**
 * Voice recording button
 *
 * Button that activates voice input with visual feedback.
 * Uses Web Speech API for transcription when available.
 *
 * @example
 * ```tsx
 * const [isRecording, setIsRecording] = useState(false);
 *
 * <VoiceInput
 *   isRecording={isRecording}
 *   onRecording={setIsRecording}
 *   onTranscript={(text) => setInput(text)}
 *   onError={(err) => toast.error(err)}
 * />
 * ```
 */
export declare const VoiceInput: default_2.FC<VoiceInputProps>;

export declare interface VoiceInputProps {
    /** Called when recording state changes */
    onRecording?: (isRecording: boolean) => void;
    /** Called with transcript when speech is recognized */
    onTranscript?: (transcript: string) => void;
    /** Called on error */
    onError?: (error: string) => void;
    /** Current recording state (controlled) */
    isRecording?: boolean;
    /** Disable the button */
    disabled?: boolean;
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

/**
 * Multi-step wizard form
 *
 * Orchestrates a multi-step form with validation and navigation.
 *
 * @example
 * ```tsx
 * <WizardForm
 *   steps={[
 *     {
 *       id: 'details',
 *       title: 'Payment Details',
 *       content: ({ data, updateData, next }) => (
 *         <PaymentDetailsStep
 *           data={data}
 *           onChange={updateData}
 *           onNext={next}
 *         />
 *       ),
 *       validate: (data) => !!data.amount,
 *       getSummary: (data) => `Amount: ${data.amount}`
 *     },
 *     {
 *       id: 'confirm',
 *       title: 'Confirm',
 *       content: ({ data, prev }) => (
 *         <ConfirmStep data={data} onBack={prev} />
 *       )
 *     }
 *   ]}
 *   onComplete={(data) => processPayment(data)}
 * />
 * ```
 */
export declare const WizardForm: default_2.FC<WizardFormProps>;

export declare interface WizardFormProps {
    /** Wizard steps */
    steps: WizardStep[];
    /** Called when wizard completes */
    onComplete: (data: Record<string, unknown>) => void;
    /** Initial form data */
    initialData?: Record<string, unknown>;
    /** Called when step changes */
    onStepChange?: (stepIndex: number, stepId: string) => void;
    /** Additional CSS classes */
    className?: string;
    /** Show step indicators */
    showStepIndicators?: boolean;
}

export declare interface WizardStep {
    /** Step ID */
    id: string;
    /** Step title */
    title: string;
    /** Step content renderer */
    content: (props: WizardStepProps) => default_2.ReactNode;
    /** Validation function */
    validate?: (data: Record<string, unknown>) => boolean | string;
    /** Summary generator */
    getSummary?: (data: Record<string, unknown>) => string;
}

export declare interface WizardStepProps {
    /** Current step data */
    data: Record<string, unknown>;
    /** Update step data */
    updateData: (updates: Record<string, unknown>) => void;
    /** Go to next step */
    next: () => void;
    /** Go to previous step */
    prev: () => void;
    /** Is this the last step */
    isLast: boolean;
    /** Is this the first step */
    isFirst: boolean;
}

export { }
