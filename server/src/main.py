from fastapi import FastAPI

from src.generation.router import generation_router


def initialize_app() -> FastAPI:
    from src.core.settings import AppSettings

    server_instance = FastAPI(
        title=AppSettings().app_name,
        version=AppSettings().app_version,
        description="Code documentation and analysis automation tool powered by AI",
    )

    server_instance.include_router(generation_router)
    return server_instance


app = initialize_app()


@app.get("/")
async def index():
    return {"message": "Setting up server!"}
