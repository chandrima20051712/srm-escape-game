import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    db_driver = os.getenv("DB_DRIVER", "sqlite").lower()
    sqlite_path = os.getenv("SQLITE_PATH", "./srmescape.db")

    db_user = os.getenv("DB_USER", "postgres")
    db_password = os.getenv("DB_PASSWORD", "postgres")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "5432"))
    db_name = os.getenv("DB_NAME", "srmescape")

    jwt_secret = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expiry_days = int(os.getenv("JWT_EXPIRY_DAYS", "7"))
    port = int(os.getenv("PORT", "5000"))
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    email_service = os.getenv("EMAIL_SERVICE", "gmail")
    email_user = os.getenv("EMAIL_USER", "")
    email_password = os.getenv("EMAIL_PASSWORD", "")

    @property
    def database_url(self) -> str:
        if self.db_driver == "sqlite":
            return f"sqlite+aiosqlite:///{self.sqlite_path}"

        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()
