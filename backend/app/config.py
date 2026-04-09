from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    XAI_API_KEY: str
    DATABASE_URL: str = "sqlite:///./portfolios.db"
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3005"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

settings = Settings()
