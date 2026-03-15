import os
from sqlmodel import create_engine, Session
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

# Fetch url
postgres_url = os.getenv("DATABASE_URL")

if not postgres_url:
    raise ValueError("DATABASE_URL not found in .env file")

is_dev = os.getenv("ENV", "development") == "development" # development is default
engine = create_engine(postgres_url, echo=is_dev, connect_args={"options": "-c timezone=utc"}) # echo logs all generated SQL to terminal

# Ensure sessions are safe in async
def get_session():
    with Session(engine) as session:
        yield session


