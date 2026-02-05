// src/data/demoConfig.ts

export type PersonaId = 'blank' | 'maya' | 'arjun' | 'sarah' | 'sam' | 'shyam' | 'kiara' | 'varun' | 'spark' | 'showcase';
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

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  subtitle: string;  // One-line user story description
  theme: Theme;
  landing: {
    greeting: string;
    initialPrompt: string;
    cards: DashboardCard[];
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
      greeting: "Good afternoon, Maya",
      initialPrompt: "Show me recent payments from arvind@gmail.com",
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
  arjun: {
    id: 'arjun',
    name: 'Negative Balance & Add Funds',
    subtitle: 'Settlements paused due to high refunds, need to add funds via UPI',
    theme: 'negative',
    landing: {
      greeting: "Good afternoon, Arjun",
      initialPrompt: "Where are my settlements? Why is my account balance negative? We had high value txns this week",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "Today's Briefing",
          subtext: "Your refund volume for last 3 days was unusually high. Payment timeouts are the most common failure reason (2%)."
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Your account balance is negative",
          value: "-₹46,000.00",
          secondaryValue: "₹1,20,000.00", // Payments collected
          trend: 'down',
          status: 'critical'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Your settlements are paused",
          value: "Paused",
          subtext: "Action Required",
          status: 'paused'
        }
      ]
    }
  },
  sarah: {
    id: 'sarah',
    name: 'Auto Refunded & Capture Settings',
    subtitle: 'Customer says payment was refunded but I didn\'t initiate it',
    theme: 'neutral',
    landing: {
      greeting: "Welcome back, Sarah",
      initialPrompt: "My customer called and said payment was refunded. I didn't initiate this.. What is going on?",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "Account Action Required",
          subtext: "Please submit updated KYC documents to resume full processing."
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Payment volume is low",
          value: "₹0.00",
          secondaryValue: "₹0.00",
          trend: 'neutral',
          status: 'healthy'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Settlements on Hold",
          value: "On Hold",
          subtext: "Dormant Account",
          status: 'paused'
        }
      ]
    }
  },
  sam: {
    id: 'sam',
    name: 'Ticket Status & Escalation',
    subtitle: 'Need to check and escalate my pending support ticket',
    theme: 'positive',
    landing: {
      greeting: "Good afternoon, Sam",
      initialPrompt: "What's the status of my last ticket",
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
          secondaryValue: "₹1,00,000.00",
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
      greeting: "Good afternoon, Shyam",
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
  kiara: {
    id: 'kiara',
    name: 'Customer Transaction Status',
    subtitle: 'Need to check the status of my customer Rohan\'s last transaction',
    theme: 'positive',
    landing: {
      greeting: "Good afternoon, Kiara",
      initialPrompt: "Check the status of Rohan's last transaction",
      cards: [
        {
          id: 'briefing',
          type: 'briefing',
          title: "1 refund pending bank processing",
          subtext: "Rohan's ₹10,000 refund - ETA Feb 4"
        },
        {
          id: 'stats',
          type: 'stats',
          title: "Payment volumes steady today",
          value: "₹95,000.00",
          secondaryValue: "₹82,000.00",
          trend: 'up',
          status: 'healthy'
        },
        {
          id: 'settlement',
          type: 'settlement',
          title: "Your settlements are on track",
          value: "₹82K",
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
      greeting: "Good afternoon, Varun",
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
  spark: {
    id: 'spark',
    name: '✨ Spark Ripples POC',
    subtitle: 'WebGL glass refraction effect prototype - blank canvas for testing',
    theme: 'neutral',
    landing: {
      greeting: "",
      initialPrompt: "",
      cards: []
    }
  },
  showcase: {
    id: 'showcase',
    name: '🎨 All Cards Showcase',
    subtitle: 'Display all available card types and artifact variations',
    theme: 'neutral',
    landing: {
      greeting: "Card Showcase",
      initialPrompt: "",
      cards: []
    }
  }
};
