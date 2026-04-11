import uuid
from sqlmodel import select, func, cast, Integer
from app.models.expense import Expense
from app.models.budget_category import BudgetCategory
from app.models.user_insights import UserInsights
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Function to get financial summary for OpenAI insights
def get_financial_summary(db_session, user_id: uuid.UUID, month: int, year: int):
    # Join Expense with Category to sum by Bucket
    statement = (
        select(BudgetCategory.bucket, func.sum(Expense.amount).label("total"))
        .join(BudgetCategory, Expense.category_id == BudgetCategory.id)
        .where(Expense.user_id == user_id)
        .where(cast(func.extract('month', Expense.date), Integer) == month)
        .where(cast(func.extract('year', Expense.date), Integer) == year)
        .group_by(BudgetCategory.bucket)
    )
    
    results = db_session.exec(statement).all()
    
    # Transform into a dict for the AI
    # Default to 0 if no expenses found
    summary = {"Needs": 0, "Wants": 0, "Savings": 0}
    for bucket, total in results:
        if bucket in summary:
            summary[bucket] = float(total)

    # Get the Top Category name and amount
    top_cat_statement = (
        select(BudgetCategory.name, func.sum(Expense.amount).label("total"))
        .join(BudgetCategory, Expense.category_id == BudgetCategory.id)
        .where(Expense.user_id == user_id)
        .where(cast(func.extract('month', Expense.date), Integer) == month)
        .where(cast(func.extract('year', Expense.date), Integer) == year)
        .group_by(BudgetCategory.name)
        .order_by(func.sum(Expense.amount).desc())
        .limit(1)
    )
    
    top_result = db_session.exec(top_cat_statement).first()
    
    # Final return package for AI
    return {
        "buckets": summary,
        "top_category": top_result[0] if top_result else "None",
        "top_category_amount": float(top_result[1]) if top_result else 0,
        "month_name": datetime(year, month, 1).strftime("%B")
    }

# Function to talk to OpenAI
def generate_ai_insight(financial_data: dict) -> str:
    # Prepare the data for prompt
    buckets = financial_data["buckets"]
    top_cat = financial_data["top_category"]
    top_amt = financial_data["top_category_amount"]
    month = financial_data["month_name"]

    prompt_content = f"""
    User finances for {month}:
    - Needs: ₦{buckets['Needs']:,.2f}
    - Wants: ₦{buckets['Wants']:,.2f}
    - Savings: ₦{buckets['Savings']:,.2f}
    - Top Spending Category: {top_cat} (₦{top_amt:,.2f})
    """

    # Response sent to openAI client
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a witty, helpful financial advisor for an app called Allocare. Give a 1-sentence insight about the user's spending. Be punchy. Use ₦. If spending is 0, encourage them to start tracking."},
            {"role": "user", "content": prompt_content}
        ],
        max_tokens=50,
        temperature=0.7
    )

    return response.choices[0].message.content

# Function to get insight
def get_and_cache_insight(db_session, user_id: uuid.UUID, month: int, year: int):
    # Check if insight for this month and year exists
    statement = select(UserInsights).where(
        UserInsights.user_id == user_id,
        UserInsights.month == month,
        UserInsights.year == year
    )
    insight = db_session.exec(statement).first()

    # If it exists, return it (cache logic)
    if insight:
        return insight.content

    # If not, generate a new one
    package = get_financial_summary(db_session, user_id, month, year)
    response_text = generate_ai_insight(package)

    # Save to database
    new_insight = UserInsights(
        user_id=user_id,
        content=response_text,
        month=month,
        year=year
    )
    db_session.add(new_insight)
    db_session.commit()
    db_session.refresh(new_insight)

    return new_insight.content
