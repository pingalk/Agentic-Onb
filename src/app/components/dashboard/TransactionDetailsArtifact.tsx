import React, { useMemo } from 'react';
import { useFormStore } from './FormStore';
import { GenericFormLayout, TransactionDetailsSection, TransactionDetailRow } from './GenericFormLayout';
import { Check, Info, ChevronDown, ChevronRight, MoreHorizontal, X, AlertCircle } from 'lucide-react';

export const TransactionDetailsArtifact = () => {
    const { activeTransactionId, close } = useFormStore();

    const transactionData = useMemo(() => {
        const dataMap: Record<string, any> = {
            'pay_captured_23jan': {
                id: "pay_captured_23jan",
                amount: "21,312.12",
                status: "Captured",
                method: "UPI",
                bank: "HDFC Bank",
                createdAt: "Jan 23, 2026",
                updatedAt: "Jan 23, 2026",
                capturedAt: "Jan 23, 2026",
                customer: "pingal@gmail.com",
                phone: "9882331122",
                rrn: "6482937429",
                paidVia: "HDFC Bank UPI",
                feeBearer: "Fee paid by customer",
                orderId: "ord_23jan001",
                description: "Payment for Invoice #INV-2026-001"
            },
            'pay_captured_22jan': {
                id: "pay_captured_22jan",
                amount: "8,750.50",
                status: "Captured",
                method: "Card",
                bank: "ICICI Bank",
                createdAt: "Jan 22, 2026",
                updatedAt: "Jan 22, 2026",
                capturedAt: "Jan 22, 2026",
                customer: "rahul@gmail.com",
                phone: "9876500000",
                rrn: "1242940202",
                paidVia: "Credit Card",
                feeBearer: "Fee paid by merchant",
                orderId: "ord_22jan002",
                description: "E-commerce purchase"
            },
            'pay_failed_21jan': {
                id: "pay_failed_21jan",
                amount: "2,000.00",
                status: "Failed",
                method: "Netbanking",
                bank: "SBI",
                createdAt: "Jan 21, 2026",
                updatedAt: "Jan 21, 2026",
                capturedAt: "--",
                customer: "arvind@gmail.com",
                phone: "9882331122",
                rrn: "9876543210",
                paidVia: "SBI Netbanking",
                feeBearer: "Fee paid by customer",
                orderId: "ord_21jan003",
                description: "The payment failed due to insufficient funds in the customer's bank account."
            },
            'pay_auth_20jan': {
                id: "pay_auth_20jan",
                amount: "15,600.00",
                status: "Authorised",
                method: "UPI",
                bank: "Axis Bank",
                createdAt: "Jan 20, 2026",
                updatedAt: "Jan 20, 2026",
                capturedAt: "--",
                customer: "priya@gmail.com",
                phone: "9988776655",
                rrn: "4567891230",
                paidVia: "Axis Bank UPI",
                feeBearer: "Fee paid by customer",
                orderId: "ord_20jan004",
                description: "Authorised payment waiting for capture"
            },
            'pay_captured_19jan': {
                id: "pay_captured_19jan",
                amount: "5,500.25",
                status: "Captured",
                method: "Wallet",
                bank: "Paytm",
                createdAt: "Jan 19, 2026",
                updatedAt: "Jan 19, 2026",
                capturedAt: "Jan 19, 2026",
                customer: "vikram@gmail.com",
                phone: "9123456789",
                rrn: "3216549870",
                paidVia: "Paytm Wallet",
                feeBearer: "Fee paid by merchant",
                orderId: "ord_19jan005",
                description: "Wallet recharge"
            },
            'pay_arvind_1': {
                id: "pay_arvind_1",
                amount: "15,000.00",
                status: "Captured",
                method: "UPI",
                bank: "HDFC Bank",
                createdAt: "Today, 10:30 AM",
                updatedAt: "Today, 10:31 AM",
                capturedAt: "Today, 10:31 AM",
                customer: "arvind@gmail.com",
                phone: "9876543210",
                rrn: "6482937429",
                paidVia: "Google Pay",
                feeBearer: "Fee paid by merchant",
                orderId: "ord_arvind_001",
                description: "Monthly Subscription Payment"
            },
            'pay_arvind_2': {
                id: "pay_arvind_2",
                amount: "5,000.00",
                status: "Failed",
                method: "Netbanking",
                bank: "HDFC Bank",
                createdAt: "Yesterday, 4:30 PM",
                updatedAt: "Yesterday, 4:35 PM",
                capturedAt: "--",
                customer: "arvind@gmail.com",
                phone: "9876543210",
                rrn: "9876543210",
                paidVia: "HDFC Netbanking",
                feeBearer: "Fee paid by customer",
                orderId: "ord_arvind_002",
                description: "The payment failed due to insufficient funds in the customer's bank account."
            },
            'pay_arvind_3': {
                id: "pay_arvind_3",
                amount: "2,000.00",
                status: "Captured",
                method: "Card",
                bank: "ICICI Bank",
                createdAt: "2 days ago, 2:15 PM",
                updatedAt: "2 days ago, 2:16 PM",
                capturedAt: "2 days ago, 2:16 PM",
                customer: "arvind@gmail.com",
                phone: "9876543210",
                rrn: "1242940202",
                paidVia: "Credit Card",
                feeBearer: "Fee paid by merchant",
                orderId: "ord_arvind_003",
                description: "Add-on purchase"
            }
        };

        return dataMap[activeTransactionId || ''] || dataMap['pay_failed_21jan'];
    }, [activeTransactionId]);

    const StatusBadge = ({ status }: { status: string }) => {
        const isCaptured = status === 'Captured';
        const isFailed = status === 'Failed';
        
        let bgClass = 'bg-[rgba(18,145,208,0.09)]'; // Blue/Default
        let textClass = 'text-[#0f78ad]';
        let icon = (
             <div className="relative shrink-0 size-[16px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                    <path d="M8.00001 11.333C8.3682 11.333 8.667 11.6318 8.667 12V14.667C8.66682 15.035 8.36808 15.333 8.00001 15.333C7.63193 15.333 7.3332 15.035 7.33302 14.667V12C7.33302 11.6318 7.63182 11.333 8.00001 11.333ZM4.70216 10.3555C4.96251 10.0951 5.38419 10.0951 5.64454 10.3555C5.90487 10.6158 5.90488 11.0375 5.64454 11.2979L3.75782 13.1846C3.49748 13.4449 3.07578 13.4449 2.81544 13.1846C2.55511 12.9242 2.55514 12.5026 2.81544 12.2422L4.70216 10.3555ZM10.3555 10.3555C10.6158 10.0951 11.0375 10.0951 11.2979 10.3555L13.1846 12.2422C13.4449 12.5026 13.4449 12.9243 13.1846 13.1846C12.9243 13.4449 12.5026 13.4449 12.2422 13.1846L10.3555 11.2979C10.0951 11.0375 10.0951 10.6158 10.3555 10.3555ZM4.00001 7.33302C4.3682 7.33302 4.667 7.63182 4.667 8.00001C4.667 8.36819 4.36819 8.667 4.00001 8.667H1.33302C0.964977 8.66683 0.667008 8.36809 0.667003 8.00001C0.667003 7.63193 0.964973 7.33319 1.33302 7.33302H4.00001ZM14.667 7.33302C15.035 7.3332 15.333 7.63193 15.333 8.00001C15.333 8.36808 15.035 8.66682 14.667 8.667H12C11.6318 8.667 11.333 8.3682 11.333 8.00001C11.333 7.63182 11.6318 7.33302 12 7.33302H14.667ZM2.81544 2.81544C3.07578 2.5551 3.49747 2.55512 3.75782 2.81544L5.64454 4.70216C5.90487 4.96251 5.90488 5.3842 5.64454 5.64454C5.3842 5.90488 4.96251 5.90487 4.70216 5.64454L2.81544 3.75782C2.55512 3.49747 2.5551 3.07578 2.81544 2.81544ZM12.2422 2.81544C12.5026 2.55514 12.9242 2.55511 13.1846 2.81544C13.4449 3.07578 13.4449 3.49748 13.1846 3.75782L11.2979 5.64454C11.0375 5.90488 10.6158 5.90487 10.3555 5.64454C10.0951 5.38419 10.0951 4.96251 10.3555 4.70216L12.2422 2.81544ZM8.00001 0.667003C8.36809 0.667008 8.66683 0.964977 8.667 1.33302V4.00001C8.667 4.36819 8.36819 4.667 8.00001 4.667C7.63182 4.667 7.33302 4.3682 7.33302 4.00001V1.33302C7.33319 0.964973 7.63193 0.667003 8.00001 0.667003Z" fill="currentColor" />
                  </svg>
             </div>
        );

        if (isCaptured) {
            bgClass = 'bg-[rgba(0,162,81,0.09)]';
            textClass = 'text-[#008743]';
            icon = <Check size={14} strokeWidth={3} className="shrink-0" />;
        } else if (isFailed) {
            bgClass = 'bg-[rgba(217,45,32,0.09)]';
            textClass = 'text-[#d92d20]';
            icon = <AlertCircle size={14} strokeWidth={2.5} className="shrink-0" />;
        }

        return (
            <div className={`${bgClass} ${textClass} flex items-center gap-[4px] h-[24px] px-[12px] rounded-[1000px] text-[12px] font-['Inter:Medium'] mt-2 mb-4 w-fit`}>
                {icon}
                <span className="leading-[18px] relative">{status}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
             {/* Gradient Background Overlay for Header */}
             <div 
                className="absolute top-0 left-0 right-0 h-[284px] pointer-events-none z-0"
                style={{ 
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 380 284\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\\'100%\\' width=\\\'100%\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\'/><defs><radialGradient id=\\\'grad\\' gradientUnits=\\\'userSpaceOnUse\\' cx=\\\'0\\' cy=\\\'0\\' r=\\\'10\\' gradientTransform=\\\'matrix(4.0279e-16 -28.4 55.842 -1.9123e-14 190 284)\\'><stop stop-color=\\\'rgba(255,255,255,0)\\\' offset=\\\'0\\'/><stop stop-color=\\\'rgba(18,145,208,0.09)\\\' offset=\\\'1\\'/></radialGradient></defs></svg>')" 
                }}
            />

            {/* Custom Header matching TitleBar in design */}
            <div className="flex items-center justify-between p-[20px] relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <h2 className="text-[#40566d] text-[18px] font-['TASA_Orbiter_Display:SemiBold'] font-medium leading-[24px]">Transaction Details</h2>
                </div>
                <div className="flex items-center gap-[16px] pl-[8px]">
                    <button className="flex items-center justify-center w-[20px] h-[20px] text-[#768EA7]">
                        <MoreHorizontal size={20} />
                    </button>
                    <button onClick={close} className="flex items-center justify-center w-[20px] h-[20px] text-[#768EA7]">
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto relative z-10">
                <div className="flex flex-col items-center px-6 pb-6">
                    <div className="flex items-baseline text-[#192839] mb-1 gap-[2px]">
                        <span className="text-[24px] font-['Inter:SemiBold'] font-medium opacity-60 leading-[32px]">₹</span>
                        <span className="text-[40px] font-['TASA_Orbiter_Display:SemiBold'] font-medium leading-[46px]">{transactionData.amount.split('.')[0]}</span>
                        <span className="text-[24px] font-['TASA_Orbiter_Display:SemiBold'] font-medium opacity-60 leading-[32px]">.{transactionData.amount.split('.')[1]}</span>
                    </div>
                    
                    <StatusBadge status={transactionData.status} />

                    <div className="flex justify-center w-full px-4">
                        <p className="text-center text-[#40566d] text-[18px] font-['TASA_Orbiter_Display:Regular'] leading-[24px]">
                            {transactionData.status === 'Captured' 
                                ? `Payment was successfully captured on ${transactionData.capturedAt}, will be settled by Jan 25.` 
                                : transactionData.description}
                        </p>
                    </div>

                    <p className="text-[12px] text-[#768ea7] font-['Inter:Medium'] font-medium mt-5 leading-[18px]">
                        Created {transactionData.createdAt} • Updated {transactionData.updatedAt}
                    </p>
                </div>

                <div className="px-6 py-2 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Payment Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Bank RRN</span>
                                <span className="text-sm text-slate-900 font-medium">{transactionData.rrn}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Paid via</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-slate-900 font-medium">{transactionData.paidVia}</span>
                                    <Info size={14} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Transfer method</span>
                                <div className="flex items-center gap-2">
                                    {/* Using a placeholder for the UPI icon based on description, or lucide icon */}
                                    {/* In a real app we'd use the specific bank/UPI svg */}
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-slate-600">
                                            <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-900 font-bold">{transactionData.method}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Fee Bearer</span>
                                <span className="text-sm text-slate-900 font-medium">{transactionData.feeBearer}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Order ID</span>
                                <span className="text-sm text-slate-900 font-medium">{transactionData.orderId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Payment ID</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-slate-900 font-medium">{transactionData.id}</span>
                                    <Info size={14} className="text-slate-400" />
                                </div>
                            </div>
                            <button className="flex items-center gap-1 text-sm text-blue-600 font-medium mt-1">
                                More details <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-900">Customer Details</h3>
                            <button className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                view more <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Email</span>
                                <span className="text-sm text-slate-900 font-medium">{transactionData.customer}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Phone</span>
                                <span className="text-sm text-slate-900 font-medium">{transactionData.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Other details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-500 font-medium">Refund</span>
                                <span className="text-sm text-slate-900 font-medium text-right max-w-[200px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer removed from artifact view in design, but keeping container structure if needed or empty */}
        </div>
    );
};
