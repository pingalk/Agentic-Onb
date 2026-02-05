import React from 'react';
import { motion } from 'motion/react';
import { X, MoreHorizontal, Check, Copy, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

// Type definitions for transaction data
export interface TransactionData {
  id: string;
  type: 'refund' | 'payment' | 'settlement';
  amount: string;
  status: string;
  date: string;
  email?: string;
  phone?: string;
  rrn?: string;
  refundId?: string;
  paymentId?: string;
  description?: string;
  method?: string;
}

interface TransactionPreviewPaneProps {
  transaction: TransactionData;
  onClose: () => void;
}

// Helper to format current date
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Copy button component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="size-[16px] text-slate-400 hover:text-slate-600 transition-colors"
      title={copied ? "Copied!" : "Copy"}
    >
      <Copy size={14} />
    </button>
  );
};

// Info row component
const InfoRow = ({
  label,
  value,
  copyable = false,
  isLink = false
}: {
  label: string;
  value: string;
  copyable?: boolean;
  isLink?: boolean;
}) => (
  <div className="flex items-start justify-between py-[4px]">
    <span className="text-[14px] font-medium text-[#768ea7] leading-[20px] flex-1">
      {label}
    </span>
    <div className="flex items-center gap-[6px] flex-1">
      <span className={clsx(
        "text-[14px] font-medium leading-[20px]",
        isLink ? "text-[#2563EB] underline decoration-blue-300 underline-offset-2" : "text-[#40566d]"
      )}>
        {value}
      </span>
      {copyable && <CopyButton text={value} />}
    </div>
  </div>
);

// Section component
const Section = ({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-[12px] w-full">
    <div className="flex items-center justify-between">
      <h3 className="text-[18px] font-medium text-[#192839] leading-[24px]">
        {title}
      </h3>
      {action}
    </div>
    <div className="flex flex-col gap-[8px]">
      {children}
    </div>
    <div className="h-[1px] bg-[#e2e8f0] w-full mt-[4px]" />
  </div>
);

export const TransactionPreviewPane: React.FC<TransactionPreviewPaneProps> = ({
  transaction,
  onClose
}) => {
  // Parse amount for display
  const amountParts = transaction.amount.replace('₹', '').trim().split('.');
  const mainAmount = amountParts[0] || '0';
  const decimal = amountParts[1] || '00';

  // Get status color and icon
  const getStatusStyle = () => {
    switch (transaction.status.toLowerCase()) {
      case 'refunded':
        return {
          bg: 'bg-[rgba(18,145,208,0.09)]',
          text: 'text-[#0f78ad]',
          icon: <Check size={14} className="text-[#0f78ad]" />
        };
      case 'captured':
      case 'processed':
        return {
          bg: 'bg-[rgba(22,163,74,0.09)]',
          text: 'text-[#16a34a]',
          icon: <Check size={14} className="text-[#16a34a]" />
        };
      case 'failed':
        return {
          bg: 'bg-[rgba(220,38,38,0.09)]',
          text: 'text-[#dc2626]',
          icon: null
        };
      case 'processing':
        return {
          bg: 'bg-[rgba(234,179,8,0.09)]',
          text: 'text-[#ca8a04]',
          icon: null
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          icon: null
        };
    }
  };

  const statusStyle = getStatusStyle();

  // Generate description based on type
  const getDescription = () => {
    if (transaction.description) return transaction.description;
    switch (transaction.type) {
      case 'refund':
        return 'This payment was auto-refunded';
      case 'payment':
        return 'Payment captured successfully';
      case 'settlement':
        return 'Settlement processed';
      default:
        return '';
    }
  };

  // Get title based on type
  const getTitle = () => {
    switch (transaction.type) {
      case 'refund':
        return 'Refund Details';
      case 'payment':
        return 'Payment Details';
      case 'settlement':
        return 'Settlement Details';
      default:
        return 'Transaction Details';
    }
  };

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  };

  const amountVariants = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 24,
        delay: 0.15,
      }
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-[8px] shadow-[0_8px_32px_-4px_rgba(18,145,208,0.18)] flex flex-col overflow-hidden">
      {/* Header with gradient */}
      <motion.div
        className="flex flex-col gap-[20px] p-[20px] shrink-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(18,145,208,0.09) 0%, rgba(255,255,255,0) 70%)'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title bar */}
        <motion.div className="flex items-center justify-between" variants={itemVariants}>
          <h2 className="text-[18px] font-medium text-[#40566d] leading-[24px]">
            {getTitle()}
          </h2>
          <div className="flex items-center gap-[16px]">
            <button className="size-[20px] text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <button
              onClick={onClose}
              className="size-[20px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>

        {/* Amount display */}
        <div className="flex flex-col items-center gap-[8px] pt-[8px]">
          <motion.div className="flex items-baseline" variants={amountVariants}>
            <span className="text-[24px] font-medium text-[#768ea7] leading-[28px]">₹</span>
            <span className="text-[40px] font-medium text-[#192839] leading-[44px]">{mainAmount}</span>
            <span className="text-[24px] font-medium text-[#768ea7] leading-[28px]">.{decimal.padEnd(2, '0')}</span>
          </motion.div>

          {/* Status badge */}
          <motion.div
            className={clsx(
              "flex items-center gap-[4px] px-[12px] h-[24px] rounded-full",
              statusStyle.bg
            )}
            variants={itemVariants}
          >
            {statusStyle.icon}
            <span className={clsx("text-[12px] font-medium", statusStyle.text)}>
              {transaction.status}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-[18px] text-[#40566d] text-center leading-[24px] mt-[12px]"
            variants={itemVariants}
          >
            {getDescription()}
          </motion.p>

          {/* Timestamps */}
          <motion.p
            className="text-[12px] font-medium text-[#768ea7]"
            variants={itemVariants}
          >
            Created {getCurrentDate()}  •  Updated {getCurrentDate()}
          </motion.p>
        </div>
      </motion.div>

      {/* Body - scrollable with staggered sections */}
      <motion.div
        className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.25,
            }
          }
        }}
      >
        {/* Refund/Transaction Details Section */}
        <motion.div variants={itemVariants}>
          <Section title={transaction.type === 'refund' ? 'Refund Details' : 'Payment Details'}>
            {transaction.rrn && (
              <InfoRow label="Bank ARN/RRN" value={transaction.rrn} copyable />
            )}
            {transaction.type === 'refund' && (
              <>
                <InfoRow label="Refund Type" value="Full refund" />
                <InfoRow label="Refund speed" value="Normal" />
                <InfoRow label="Refund fee" value="-" />
              </>
            )}
            {transaction.refundId && (
              <InfoRow label="Refund ID" value={transaction.refundId} copyable />
            )}
            {transaction.paymentId && (
              <InfoRow label="Payment ID" value={transaction.paymentId} copyable />
            )}
            <button className="text-[14px] font-medium text-[#2563EB] flex items-center gap-[4px] mt-[4px] hover:underline">
              More details
              <ExternalLink size={12} />
            </button>
          </Section>
        </motion.div>

        {/* Customer Details Section */}
        {(transaction.email || transaction.phone) && (
          <motion.div variants={itemVariants}>
            <Section
              title="Customer Details"
              action={
                <button className="text-[14px] font-medium text-[#2563EB] hover:underline">
                  view more →
                </button>
              }
            >
              {transaction.email && (
                <InfoRow label="Email" value={transaction.email} copyable />
              )}
              {transaction.phone && (
                <InfoRow label="Phone" value={transaction.phone || '9882331122'} copyable />
              )}
            </Section>
          </motion.div>
        )}

        {/* Transaction Details Section */}
        <motion.div variants={itemVariants}>
          <Section title="Transaction Details">
            <InfoRow label="Transaction amount" value={`₹${mainAmount}.${decimal}`} />
            {transaction.method && (
              <InfoRow label="Paid via" value={transaction.method} />
            )}
            {transaction.paymentId && (
              <InfoRow label="Payment ID" value={transaction.paymentId} copyable />
            )}
          </Section>
        </motion.div>

        {/* Other Details Section */}
        <motion.div variants={itemVariants}>
          <Section title="Other details">
            <InfoRow label="Notes" value="-" />
            <button className="text-[14px] font-medium text-[#2563EB] hover:underline">
              Show more
            </button>
          </Section>
        </motion.div>
      </motion.div>
    </div>
  );
};
