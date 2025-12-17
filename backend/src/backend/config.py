from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Default database URL - typically this should come from environment variables
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/lokai"

class DatabaseSession:
    def __init__(self):
        self.engine = create_async_engine(DATABASE_URL, echo=True, future=True)
        self.session_maker = None

    def init(self):
        self.session_maker = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )

    async def create_all(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

    async def close(self):
        await self.engine.dispose()

    def get_session(self) -> AsyncSession:
        return self.session_maker()

db = DatabaseSession()
