export type CheckoutInfo = {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type PaymentInfo = {
  cardHolder: string;
  cardNumber: string;
  expiration: string;
  securityCode: string;
};

const FIRST = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey'];
const LAST = ['Rivera', 'Chen', 'Patel', 'Nguyen', 'Brooks', 'Hayes'];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateCheckoutInfo(): CheckoutInfo {
  const suffix = Date.now().toString().slice(-4);
  return {
    fullName: `${pick(FIRST)} ${pick(LAST)} ${suffix}`,
    address1: `${100 + Math.floor(Math.random() * 900)} Demo Street`,
    address2: `Apt ${1 + Math.floor(Math.random() * 20)}`,
    city: 'Truro',
    state: 'Cornwall',
    zip: String(10_000 + Math.floor(Math.random() * 89_999)),
    country: 'United Kingdom',
  };
}

export function generatePaymentInfo(cardHolder?: string): PaymentInfo {
  return {
    cardHolder: cardHolder ?? 'Rebecca Winter',
    cardNumber: '3258125675687891',
    expiration: '03/28',
    securityCode: '123',
  };
}

export function parseCurrency(text: string): number {
  return Number(text.replace(/[^0-9.-]+/g, ''));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
