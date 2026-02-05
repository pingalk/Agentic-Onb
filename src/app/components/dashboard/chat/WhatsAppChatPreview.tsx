import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, Check, CheckCheck } from 'lucide-react';

export interface WhatsAppMessage {
  id: string;
  sender: 'customer' | 'merchant';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppChatPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone?: string;
  messages: WhatsAppMessage[];
}

// Message status indicator
const MessageStatus = ({ status }: { status?: 'sent' | 'delivered' | 'read' }) => {
  if (!status) return null;

  if (status === 'sent') {
    return <Check size={14} className="text-[#8696a0]" />;
  }
  if (status === 'delivered') {
    return <CheckCheck size={14} className="text-[#8696a0]" />;
  }
  return <CheckCheck size={14} className="text-[#53bdeb]" />;
};

export const WhatsAppChatPreview: React.FC<WhatsAppChatPreviewProps> = ({
  isOpen,
  onClose,
  customerName,
  customerPhone,
  messages
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[70] bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed z-[71] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-h-[85vh] rounded-[12px] overflow-hidden shadow-2xl"
      >
        {/* WhatsApp Header */}
        <div className="bg-[#008069] px-4 py-3 flex items-center gap-3">
          {/* Back/Close button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center text-[#54656f] font-medium text-lg">
            {customerName.charAt(0).toUpperCase()}
          </div>

          {/* Contact Info */}
          <div className="flex-1">
            <div className="text-white font-medium text-[16px]">{customerName}</div>
            {customerPhone && (
              <div className="text-white/70 text-[13px]">{customerPhone}</div>
            )}
          </div>
        </div>

        {/* Chat Background */}
        <div
          className="bg-[#efeae2] min-h-[400px] max-h-[60vh] overflow-y-auto p-3 flex flex-col gap-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d4cdc4' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'merchant' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  relative max-w-[85%] px-3 py-2 rounded-lg shadow-sm
                  ${msg.sender === 'merchant'
                    ? 'bg-[#d9fdd3] rounded-tr-none'
                    : 'bg-white rounded-tl-none'}
                `}
              >
                {/* Message tail */}
                <div
                  className={`
                    absolute top-0 w-0 h-0
                    ${msg.sender === 'merchant'
                      ? 'right-[-8px] border-l-[8px] border-l-[#d9fdd3] border-t-[8px] border-t-transparent'
                      : 'left-[-8px] border-r-[8px] border-r-white border-t-[8px] border-t-transparent'}
                  `}
                />

                <p className="text-[14px] text-[#111b21] leading-[19px] whitespace-pre-wrap">
                  {msg.text}
                </p>

                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[11px] text-[#667781]">{msg.time}</span>
                  {msg.sender === 'merchant' && <MessageStatus status={msg.status} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area (disabled, just for visual) */}
        <div className="bg-[#f0f2f5] px-3 py-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-[14px] text-[#667781]">
            Type a message
          </div>
        </div>
      </motion.div>
    </>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
};

// Pre-defined chat scenarios based on persona
export const WHATSAPP_CHAT_SCENARIOS: Record<string, { customerName: string; customerPhone: string; messages: WhatsAppMessage[] }> = {
  shyam: {
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    messages: [
      {
        id: '1',
        sender: 'customer',
        text: 'Hi, I tried to make a payment of ₹15,000 for the order but it failed',
        time: '2:34 PM',
      },
      {
        id: '2',
        sender: 'merchant',
        text: 'Hi Rahul! Let me check that for you. Can you share the screenshot of the error?',
        time: '2:35 PM',
        status: 'read',
      },
      {
        id: '3',
        sender: 'customer',
        text: 'Yes, here it is. The money got deducted from my account but the payment shows failed on your website 😟',
        time: '2:36 PM',
      },
      {
        id: '4',
        sender: 'customer',
        text: '🏦 HDFC Bank\nTransaction Failed\n\nAmount: ₹15,000.00\nTo: ShyamTextiles\nRef: TXN847291038\nTime: 2:32 PM\n\nYour bank could not process this transaction. Please try again.',
        time: '2:36 PM',
      },
      {
        id: '5',
        sender: 'merchant',
        text: 'I can see the issue. Let me check with my payment gateway and get back to you.',
        time: '2:38 PM',
        status: 'read',
      },
      {
        id: '6',
        sender: 'customer',
        text: 'Please check soon, I need to place this order urgently 🙏',
        time: '2:40 PM',
      },
    ],
  },
  // Add more scenarios for other personas as needed
  default: {
    customerName: 'Customer',
    customerPhone: '+91 00000 00000',
    messages: [
      {
        id: '1',
        sender: 'customer',
        text: 'Hi, I have a question about my payment',
        time: '10:00 AM',
      },
      {
        id: '2',
        sender: 'merchant',
        text: 'Hello! How can I help you today?',
        time: '10:01 AM',
        status: 'read',
      },
    ],
  },
};

export default WhatsAppChatPreview;
