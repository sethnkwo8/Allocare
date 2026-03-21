# Convert income to monthly based on frequency
def convert_to_monthly(amount: float, frequency: str) -> float :
    if frequency == "weekly":
        return amount * 4.33
    elif frequency == "biweekly":
        return amount * 2.16
    elif frequency == "yearly":
        return amount / 12
    return amount # If monthly