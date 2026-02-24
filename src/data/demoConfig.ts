// src/data/demoConfig.ts

export type PersonaId = 'blank' | 'maya' | 'shyam' | 'varun';
export type Theme = 'positive' | 'negative' | 'neutral';

export interface DashboardCard {
  id: string;
  type: 'briefing' | 'stats' | 'settlement';
  title?: string;
  subtext?: string;
  value?: string;
  secondaryValue?: string; // For things like "available balance" vs "collected"
  trend?: 'up' | 'down' | 'neutral';
  status?: 'healthy' | 'critical' | 'paused';
}

export interface ContextPrompt {
  id: string;
  text: string;
  status: 'critical' | 'info' | 'success';  // red, blue, green dots
  cta?: string;  // Optional right-aligned CTA text (e.g., "View details →")
}

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  subtitle: string;  // One-line user story description
  theme: Theme;
  landing: {
    greeting: string;
    initialPrompt: string;
    cards: DashboardCard[];
    contextPrompts?: ContextPrompt[];  // Alternative to cards - bullet list below input
    hideCards?: boolean;  // When true, show contextPrompts instead of cards
  };
}

export const PERSONAS: Record<PersonaId, PersonaConfig> = {
  blank: {
    id: 'blank',
    name: 'Blank Input',
    subtitle: 'Showcase animated placeholder text cycling',
    theme: 'neutral',
    landing: {
      greeting: "Welcome to Ray",
      initialPrompt: "",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "All systems operational",
          subtext: "Ready to assist you with any query"
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Today's overview",
          value: "₹1,00,000.00",
          secondaryValue: "₹85,000.00",
          trend: 'up',
          status: 'healthy'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Settlements on track",
          value: "₹85K",
          subtext: "Next Settlement",
          status: 'healthy'
        }
      ]
    }
  },
  maya: {
    id: 'maya',
    name: 'Double Debit Scenario',
    subtitle: 'Customer claims they were charged twice for the same order',
    theme: 'positive',
    landing: {
      greeting: "Good afternoon",
      initialPrompt: "Show me recent payments from arvind@gmail.com, this customer is claiming he was charged twice",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "No refunds or disputes so far today",
          subtext: "All systems operational"
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Payment volumes higher than usual today",
          value: "₹1,13,000.00",
          secondaryValue: "₹1,00,000.00", // Available balance
          trend: 'up',
          status: 'healthy'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Your settlements are on track",
          value: "₹1.26L",
          subtext: "Next Settlement",
          status: 'healthy'
        }
      ]
    }
  },
  shyam: {
    id: 'shyam',
    name: 'Bank Issue & Payment Link',
    subtitle: 'Client sent me a WhatsApp screenshot of their failed payment',
    theme: 'neutral',
    landing: {
      greeting: "Good afternoon",
      initialPrompt: "[Screenshot uploaded]",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "1 failed payment detected today",
          subtext: "Customer: Rahul - ₹15,000 bank timeout"
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Today's payment volume",
          value: "₹85,000.00",
          secondaryValue: "₹70,000.00",
          trend: 'up',
          status: 'healthy'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Your settlements are on track",
          value: "₹70K",
          subtext: "Next Settlement",
          status: 'healthy'
        }
      ]
    }
  },
  varun: {
    id: 'varun',
    name: 'Upcoming Settlement',
    subtitle: 'Want to know when my next settlement is coming',
    theme: 'neutral',
    landing: {
      greeting: "Good afternoon",
      initialPrompt: "What is my upcoming settlement?",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "Payment volumes are on huge surge",
          subtext: "Orders up 340% this week — record collections!"
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Payments collected",
          value: "₹10,40,000.00",
          secondaryValue: "₹13,40,000.00",
          trend: 'up',
          status: 'healthy'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Upcoming settlement",
          value: "₹3.1L",
          subtext: "T+2 Cycle",
          status: 'healthy'
        }
      ]
    }
  },
};
