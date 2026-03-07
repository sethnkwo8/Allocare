# Base class for all auth errors
class OnboardingError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

class BucketAllocationError(OnboardingError):
    def __init__(self):
        super().__init__(
            message=f"Allocations must equal 100",
            status_code=400,
            code="INCORRECT_ALLOCATION_CALCULATION"
        )

class BucketAccessDenied(OnboardingError):
    def __init__(self):
        super().__init__(
            message=f"Not authorized to edit this bucket",
            status_code=403,
            code="UNAUTHORIZED_USER"
        )

class IncorrectBucketCount(OnboardingError):
    def __init__(self):
        super().__init__(
            message=f"There has to be 3 buckets",
            status_code=403,
            code="INCORRECT_BUCKET_COUNT"
        )

class OnboardingAlreadyComplete(OnboardingError):
    def __init__(self):
        super().__init__(
            message=f"Onboarding process already completed",
            status_code=403,
            code="ONBOARDING_ALREADY_COMPLETED"
        )