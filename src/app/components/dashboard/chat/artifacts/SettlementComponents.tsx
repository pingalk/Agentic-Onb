import React from 'react';
import svgPaths from '@/imports/svg-rvo2ii4voy';

// --- Assets ---

// Credit card with clock icon
function CreditCardClockIcon({ color = '#0F78AD' }: { color?: string }) {
  return (
    <div className="absolute left-1/2 size-[38px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <svg className="block size-full" fill="none" viewBox="0 0 38 38" preserveAspectRatio="none">
        <path d={svgPaths.p4f7f000} fill={color} />
      </svg>
    </div>
  );
}

// Instant/Lightning icon for instant settlements
function LightningIcon() {
  return (
    <div className="absolute left-1/2 size-[38px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <svg className="block size-full" fill="none" viewBox="0 0 38 38" preserveAspectRatio="none">
        <path d="M21.5 3L9.5 22H19L16.5 35L28.5 16H18.5L21.5 3Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// --- Configurable Settlement Card ---

interface SettlementCardProps {
  amount: string;
  scheduledFor: string;
  status: 'Scheduled' | 'Processing' | 'Completed';
  type?: 'regular' | 'instant';
  progressSteps?: number; // 1-4 filled steps
}

export const ConfigurableSettlementCard: React.FC<SettlementCardProps> = ({
  amount,
  scheduledFor,
  status,
  type = 'regular',
  progressSteps = 1
}) => {
  const isInstant = type === 'instant';
  const statusColor = isInstant ? '#F59E0B' : '#0f78ad';
  const statusBgGradient = isInstant
    ? 'linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(255, 251, 235) 100%)'
    : 'linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 27.731%, rgb(255, 255, 255) 71.787%, rgb(227, 246, 255) 100%)';
  const iconBgGradient = isInstant
    ? 'linear-gradient(115.198deg, rgb(255, 255, 255) 22.005%, rgb(254, 249, 235) 90.552%)'
    : 'linear-gradient(115.198deg, rgb(255, 255, 255) 22.005%, rgb(234, 245, 251) 90.552%)';
  const titleText = isInstant ? 'Instant Settlement' : 'Settlement on the way';

  // Parse amount for display
  const [mainAmount, decimal] = amount.includes('.') ? amount.split('.') : [amount, '00'];

  return (
    <div
      className="relative rounded-[12px] w-full max-w-[573px] overflow-hidden border border-[rgba(181,217,250,0.23)] shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)] h-[108px]"
      style={{ backgroundImage: statusBgGradient }}
    >
      {/* Icon Box */}
      <div className="absolute left-[8px] top-[8px] size-[96px]">
        <div
          className="absolute inset-0 rounded-[6px] overflow-clip"
          style={{ backgroundImage: iconBgGradient }}
        >
          <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-[135.714px] overflow-clip size-[76px]">
            {isInstant ? <LightningIcon /> : <CreditCardClockIcon color={statusColor} />}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="absolute flex gap-[2px] items-center left-[115px] top-[71px] content-stretch">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className="h-[4px] shrink-0 w-[77px]"
            style={{ backgroundColor: step <= progressSteps ? (isInstant ? '#F59E0B' : '#10c382') : '#dfdfdf' }}
          />
        ))}
      </div>

      {/* Status Text */}
      <p className="absolute left-[115px] top-[83px] text-[10px] text-black opacity-50 font-medium leading-[14px] font-sans">
        Settlement status: {status}
      </p>

      {/* Main Content Text */}
      <div className="absolute left-[118px] top-[12px] leading-[0]">
        <span className="block leading-[24px] text-[18px] font-sans font-medium" style={{ color: statusColor }}>
          {titleText}
        </span>
        <span className="block h-[2px]" />
        <span className="block leading-[20px] text-[#768ea7] text-[14px] font-normal font-sans">
          {scheduledFor}
        </span>
      </div>

      {/* Amount - Right Aligned */}
      <div className="absolute right-[16px] top-[12px] flex items-end justify-end">
        <div className="flex items-baseline relative shrink-0 gap-[2px]">
          <div className="flex items-baseline opacity-64 relative shrink-0">
            <p className="font-medium leading-[20px] text-[#192839] text-[14px] text-right font-sans">₹</p>
          </div>
          <div className="flex items-baseline relative shrink-0">
            <div className="flex items-baseline relative shrink-0">
              <p className="font-medium leading-[26px] text-[#192839] text-[20px] text-right font-sans">
                {mainAmount}
              </p>
            </div>
            <div className="flex items-baseline opacity-64 relative shrink-0">
              <p className="font-medium leading-[20px] text-[#192839] text-[14px] text-right font-sans">
                .{decimal.padEnd(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inner Shadow overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />
    </div>
  );
};

// --- Settlement Status Table ---

interface SettlementStatusRow {
  status: string;
  amount: string;
}

interface SettlementStatusTableProps {
  rows: SettlementStatusRow[];
}

export const SettlementStatusTable: React.FC<SettlementStatusTableProps> = ({ rows }) => {
  return (
    <div className="w-full rounded-[12px] border border-[#E4E7EC] overflow-hidden">
      {/* Table Header */}
      <div className="flex h-[48px] text-[14px] font-medium text-[#192839] bg-[rgba(108,132,157,0.06)] px-[16px] border-b border-[rgba(108,132,157,0.18)]">
        <div className="flex-1 flex items-center pl-[20px]">Status</div>
        <div className="w-[150px] flex items-center justify-end pr-[20px]">Amount</div>
      </div>
      {/* Table Rows */}
      <div className="bg-white">
        {rows.map((row, index) => {
          const isTotal = row.status.toLowerCase().includes('total');
          return (
            <div
              key={index}
              className={`flex h-[56px] items-center px-[16px] border-b border-[#E4E7EC] last:border-b-0 ${isTotal ? 'bg-[#F9FAFB]' : ''}`}
            >
              <div className={`flex-1 text-[14px] pl-[20px] ${isTotal ? 'font-medium text-[#192839]' : 'text-[#5D6B82]'}`}>
                {row.status}
              </div>
              <div className={`w-[150px] text-[14px] text-right pr-[20px] ${isTotal ? 'font-medium text-[#192839]' : 'font-medium text-[#1D2939]'}`}>
                {row.amount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Fee Calculator Card ---

interface FeeCardProps {
  percentage: string;
  feeAmount: string;
  settlementAmount: string;
}

export const FeeCalculatorCard: React.FC<FeeCardProps> = ({ percentage, feeAmount, settlementAmount }) => {
  return (
    <div className="w-full max-w-[400px] rounded-[12px] p-[16px] bg-[#F9FAFB] border border-[#E4E7EC]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#5D6B82]">Settlement Amount</span>
          <span className="text-[14px] font-medium text-[#192839]">{settlementAmount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#5D6B82]">Fee ({percentage})</span>
          <span className="text-[14px] font-medium text-[#192839]">{feeAmount}</span>
        </div>
        <div className="h-[1px] bg-[#E4E7EC]" />
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-medium text-[#192839]">You'll receive</span>
          <span className="text-[16px] font-medium text-[#059669]">
            ₹{(parseFloat(settlementAmount.replace(/[₹,]/g, '')) - parseFloat(feeAmount.replace(/[₹,]/g, ''))).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
