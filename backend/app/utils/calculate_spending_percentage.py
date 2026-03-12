# Function to calculate spending percentage for buckets
def calculate_percentage(spent, limit):
    if limit > 0:
        return int((spent / limit) * 100)
    return 0