from . import schema, service
from app.utils.calculate_spending_percentage import calculate_percentage

# Serialize dashboard data for response
def serialiaze_dashboard(db_session, session_token):
    total_income, total_spent, remaining_balance, recent_expenses, unread_count, goals, bucket_results, category_results, currency_code, user_name = service.get_dashboard_data(db_session, session_token)

    return schema.DashboardResponse(
        # Financial overview
        financial_overview=schema.FinancialOverview(
            total_income=float(total_income),
            total_spent=float(total_spent),
            remaining_balance=remaining_balance,
            currency_code=currency_code,
            name=user_name
        ),
        # Budget percentage allocation
        budget_percentage_allocation=[
            schema.BudgetAllocation(
                budget_name=bucket.name,
                percentage_allocation=bucket.percentage_allocation
            ) for bucket, spent, limit in bucket_results
        ],
        # Recent expenses
        recent_expenses=[
            schema.RecentExpense(
                id=expense.id,
                title = expense.title,
                amount=expense.amount,
                created_at=expense.date,
                category_id=expense.category_id
            ) for expense in recent_expenses
        ],
        goal_savings=[
            schema.SavingsGoal(
                name=goal.name,
                target_amount=goal.target_amount,
                current_amount=goal.current_amount,
                progress_percentage=calculate_percentage(goal.current_amount, goal.target_amount),
                remaining_amount=goal.target_amount - goal.current_amount
            ) for goal in goals
        ],
        category_spendings=[
            schema.ExpenseCalculationResponse(
                category_id=category.id,
                category_name=category.name,
                total_spent=total,
                budget_limit=category.monthly_limit,
                remaining_budget=(category.monthly_limit - total)
            ) for category, total in category_results
        ],
        bucket_spendings=[
            schema.BucketCalculationResponse(
                bucket_id=bucket.id,
                bucket_name=bucket.name,
                total_spent=total_spent,
                budget_limit=total_limit,
                remaining_budget=(total_limit - total_spent),
                spending_percentage=calculate_percentage(total_spent, total_limit)
            ) for bucket, total_spent, total_limit in bucket_results
        ],
        unread_count=schema.UnreadCount(
            unread_count=unread_count
        )
    )