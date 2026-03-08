from datetime import datetime

def get_current_month_range():
    # Start of month
    start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Start of next month
    if start_of_month.month == 12:
        # If December, move to January of next year
        start_of_next_month = start_of_month.replace(year=start_of_month.year + 1, month=1)
    else:
        # Otherwise, just increment the month
        start_of_next_month = start_of_month.replace(month=start_of_month.month + 1)

    return start_of_month, start_of_next_month