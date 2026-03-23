import { currencies } from "../onboarding/currency";

// Get user currency symbol
export function getCurrencySymbol(code: string) {
    return currencies.find(c => c.code === code)?.symbol || code;
}
