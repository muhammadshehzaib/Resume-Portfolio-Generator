from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    XAI_API_KEY: str
    DATABASE_URL: str = "sqlite:///./portfolios.db"

    class Config:
        env_file = ".env"

settings = Settings()
