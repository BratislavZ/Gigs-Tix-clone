export type User = {
  id: string;
  email: string;
};

export type Ticket = {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
};

export type Order = {
  id: string;
  userId: string;
  status: 'created' | 'cancelled' | 'awaiting:payment' | 'complete';
  expiresAt: string;
  ticket: {
    id: string;
    title: string;
    price: number;
    version: number;
  };
  version: number;
};
