# KYC Onboarding Flow Guide

## Overview

This document describes the AI-powered KYC (Know Your Customer) onboarding flow implemented for Razorpay merchants. The flow is guided by Ray, an AI assistant that makes the onboarding process conversational and user-friendly.

## Accessing the Flow

Visit: `http://localhost:5173/#kyc` or `http://localhost:5173/#onboarding`

## Flow Architecture

The KYC flow supports two main paths:

### Path 1: CKYC Available (Faster)
```
Intro → Phone Entry → OTP Verify → Documents Retrieved → Website → Business Model → Bank → Review → Success
```

### Path 2: No CKYC (Manual)
```
Intro → Documents Upload → Address Entry → Website → Business Model → Bank → Review → Success
```

## Step-by-Step Breakdown

### 1. Introduction
- Ray greets the user and explains the onboarding process
- Sets expectations for what information will be needed
- Single CTA: "Let's get started"

### 2. CKYC Path

#### Step 2a: Phone Number Entry
- User enters phone number linked to their PAN/Aadhaar
- Explains that details will be fetched from Central KYC registry (CERSAI)
- Shows PAN number (masked) for context
- Action: Send OTP

#### Step 2b: OTP Verification
- 6-digit OTP entry
- Shows masked phone number
- Action: Verify OTP

#### Step 2c: Documents Retrieved
- Shows success state with green checkmarks
- Lists verified documents:
  - PAN Card
  - Aadhaar Card
  - Business Address
- Action: Confirm & Continue

### 3. Non-CKYC Path

#### Step 3a: Document Upload
- Upload Aadhaar front and back
- Drag-and-drop or click to upload
- Accepts PDF, JPG, PNG up to 10MB
- Action: Continue

#### Step 3b: Address Entry
- Street address
- City
- State
- Pincode (6 digits)
- Action: Continue

### 4. Website Verification

#### Step 4a: Website Entry
- User can enter website URL or skip
- Two options:
  - "Continue with Website" → triggers scraping
  - "I don't have a website" → goes to payment channels
- Action: Based on choice

#### Step 4b: Website Scraping (if provided)
- Animated progress bar (0-100%)
- Shows scanning steps:
  - 🔍 Scanning homepage (0-30%)
  - 📊 Analyzing business category (30-60%)
  - 🎯 Extracting product information (60-90%)
  - ✅ Analysis complete (90-100%)
- Auto-advances to business model confirmation
- Duration: ~5 seconds

### 5. Payment Channels (if no website)
- Multi-select grid of options:
  - Website
  - Android App
  - iOS App
  - Offline Stores
  - No-code Payment Methods
  - Others
- Visual selection with icons
- Action: Continue (requires at least 1 selection)

### 6. Business Model Confirmation
- Shows AI-detected business category
- Example: "E-commerce for Fashion Accessories"
- Based on website analysis or defaults
- Two options:
  - "Yes, this is correct" → continues
  - "No, change" → allows modification
- Action: Based on confirmation

### 7. Bank Verification

#### Step 7a: UPI/RazorpayX Link
- Suggests UPI as fastest method
- Shows QR code placeholder
- Two options:
  - "Open RazorpayX" → simulates app link
  - "Enter Manually" → manual bank entry
- Action: Based on choice

#### Step 7b: Manual Bank Entry (if UPI fails/skipped)
- Account Number input
- IFSC Code input (auto-uppercase)
- Fallback message explaining UPI failure
- Action: Verify Bank Account

#### Step 7c: Penny Drop Animation
- Shows verification in progress
- Animated spinner with "Penny drop in progress..."
- After 3 seconds: Success checkmark
- Shows masked account number
- Auto-advances to review

### 8. Review & Submit
- Summary of all entered information:
  - Phone Number
  - PAN Number
  - Business Model
  - Payment Channels
  - Website (if provided)
- Action: Submit Application

### 9. Success Screen
- Green success theme
- Celebration message
- Explains next steps (bank verification)
- Mentions sweets delivery
- Shows delivery address
- Action: Go to Dashboard

## Technical Implementation

### Component: `KYCOnboardingFlow.tsx`

**Location:** `src/app/components/dashboard/KYCOnboardingFlow.tsx`

**Key Features:**
- State management with `useState` for form data
- Step-based navigation with `currentStep` state
- Smooth transitions using Motion (Framer Motion)
- Form validation on each step
- Conditional routing based on user choices

**State Structure:**
```typescript
interface KYCState {
  hasCKYC: boolean;
  phoneNumber: string;
  otp: string;
  panNumber: string;
  aadharFront: File | null;
  aadharBack: File | null;
  registeredAddress: string;
  state: string;
  city: string;
  pincode: string;
  hasWebsite: boolean;
  websiteUrl: string;
  paymentChannels: string[];
  businessCategory: string;
  businessModel: string;
  additionalDoc: File | null;
  accountNumber: string;
  ifscCode: string;
  upiSuccess: boolean;
  applicationSubmitted: boolean;
}
```

### Animations

1. **Step Transitions**
   - Fade in/out with Y-axis movement
   - Duration: 300ms

2. **Website Scraping**
   - Progress bar animation
   - Rotating sparkle icon
   - Staged message updates

3. **Penny Drop**
   - Rotating spinner during verification
   - Scale animation for success checkmark
   - Auto-advance after completion

### UI Components Used

From shadcn/ui:
- `Card` - Container for form sections
- `Button` - Primary actions
- `Input` - Text inputs
- `Label` - Form labels
- `Badge` - Status indicators
- `Checkbox` - Multi-select options

Icons from Lucide React:
- `Sparkles` - Ray AI indicator
- `Globe` - Website icon
- `Upload` - File upload
- `Check` - Success states
- `Building`, `MapPin`, `CreditCard`, etc.

## Routing Integration

Added to `App.tsx`:
```typescript
if (hash === '#kyc' || hash === '#onboarding') {
  return <KYCOnboardingFlow />;
}
```

## Future Enhancements

1. **Backend Integration**
   - Real CKYC API integration
   - Actual OTP sending/verification
   - Real document upload to cloud storage
   - Live penny drop verification
   - Website scraping API

2. **Error Handling**
   - Network error states
   - Validation error messages
   - Retry mechanisms
   - Timeout handling

3. **Analytics**
   - Step completion tracking
   - Drop-off points
   - Time spent per step
   - Success rate metrics

4. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - ARIA labels
   - Focus management

5. **Mobile Responsiveness**
   - Touch-optimized controls
   - Mobile-specific layouts
   - Camera integration for document capture

## Design Principles

1. **Conversational AI**
   - Ray speaks in first person
   - Friendly, supportive tone
   - Clear next steps at each stage

2. **Progressive Disclosure**
   - One question at a time
   - Contextual help text
   - Clear progress indication

3. **Smart Defaults**
   - Auto-fill from CKYC when available
   - Pre-populate known information
   - Suggest based on analysis

4. **Minimal Friction**
   - Skip optional steps easily
   - Multiple input methods (UPI vs manual)
   - Clear error recovery paths

## Testing Checklist

- [ ] CKYC flow completes successfully
- [ ] Non-CKYC flow completes successfully
- [ ] Website scraping animation plays correctly
- [ ] Penny drop animation completes
- [ ] Form validations work properly
- [ ] Navigation between steps is smooth
- [ ] Success screen displays correctly
- [ ] All animations perform well
- [ ] Mobile layout is responsive
- [ ] Keyboard navigation works

## Related Files

- `src/app/App.tsx` - Routing configuration
- `src/app/components/dashboard/KYCOnboardingFlow.tsx` - Main component
- `src/app/components/ui/*` - UI primitives

## Support

For questions or issues, contact the development team or refer to the main project documentation.
