declare global {
    interface Window {
      katex: typeof import("katex");
    }
  }

export interface SubscriptionType {
    title: string;
    created_at: string;
    games: number;
    id: string;
    language: {
      code: string;
      id: string;
      name: string;
    };
    players: number;
    price: number;
    questions: number;
    status: string;
    type: string;
  }