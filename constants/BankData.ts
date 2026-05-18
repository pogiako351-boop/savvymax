export type BankCategory = 'Fintech' | 'High-Yield' | 'Traditional';

export interface Bank {
  id: string;
  name: string;
  cat: BankCategory;
  apy: number;
  req: string;
  url: string;
  annualFee?: number;
}

export const bankDataset: Bank[] = [
  {
    id: 'robinhood-gold',
    name: 'Robinhood Gold',
    cat: 'Fintech',
    apy: 5.00,
    req: '$60/yr Gold fee',
    url: 'https://robinhood.com/gold',
    annualFee: 60,
  },
  {
    id: 'betterment',
    name: 'Betterment',
    cat: 'Fintech',
    apy: 4.75,
    req: 'New customers only',
    url: 'https://betterment.com',
  },
  {
    id: 'wealthfront',
    name: 'Wealthfront',
    cat: 'Fintech',
    apy: 4.50,
    req: 'Direct deposit requirement',
    url: 'https://wealthfront.com',
  },
  {
    id: 'sofi',
    name: 'SoFi',
    cat: 'Fintech',
    apy: 4.60,
    req: 'New customers only',
    url: 'https://sofi.com',
  },
  {
    id: 'ufb-direct',
    name: 'UFB Direct',
    cat: 'High-Yield',
    apy: 4.01,
    req: 'No fees',
    url: 'https://ufbdirect.com',
  },
  {
    id: 'ally-bank',
    name: 'Ally Bank',
    cat: 'High-Yield',
    apy: 4.25,
    req: 'No fees',
    url: 'https://ally.com',
  },
  {
    id: 'varo',
    name: 'Varo',
    cat: 'Fintech',
    apy: 3.30,
    req: 'Direct deposit required',
    url: 'https://varomoney.com',
  },
  {
    id: 'marcus',
    name: 'Marcus by Goldman Sachs',
    cat: 'High-Yield',
    apy: 4.25,
    req: 'No fees',
    url: 'https://marcus.com',
  },
  {
    id: 'capital-one-360',
    name: 'Capital One 360',
    cat: 'High-Yield',
    apy: 4.20,
    req: 'No fees',
    url: 'https://capitalone.com',
  },
  {
    id: 'discover',
    name: 'Discover',
    cat: 'High-Yield',
    apy: 4.10,
    req: 'No fees',
    url: 'https://discover.com',
  },
  {
    id: 'chase',
    name: 'Chase',
    cat: 'Traditional',
    apy: 0.01,
    req: 'Monthly fee',
    url: 'https://chase.com',
  },
];

export const INFLATION_RATE = 3.2;

// Lifestyle conversion costs
export const BURRITO_COST = 10;
export const STREAMING_MONTHLY = 15;
export const FLIGHT_COST = 250;
