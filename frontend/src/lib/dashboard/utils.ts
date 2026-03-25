import { currencies } from "../onboarding/currency";

// Get user currency symbol
export function getCurrencySymbol(code: string) {
    return currencies.find(c => c.code === code)?.symbol || code;
}

// Format amount with currency
export const formatWithCommas = (value: number | string) => {
    const num = Number(value || 0);
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};