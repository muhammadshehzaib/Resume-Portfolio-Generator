from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    AI_PROVIDER: str = "ollama"
    AI_MODEL: str = "qwen2.5:7b-instruct"
    AI_BASE_URL: str | None = None
    OPENAI_API_KEY: str | None = None
    DATABASE_URL: str = "sqlite:///./portfolios.db"
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3005"
    FRONTEND_URL: str = "http://localhost:3005"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

settings = Settings()
