from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.generation.router import generation_router

cors_origins = [
    'http://localhost:3000',
    # editor window webview origin
    'vscode-webview://06d300nfbnt6l2l64dkrdgfb69pc3ajf3abui2ntbefepvduni4t',
    # sidebar webview origin
    'vscode-webview://0t0vhf9u2ojrmkulps3nh907mk5uorj80aa4d99c2m4v5v9gf9oc',
    'vscode-webview://0ivfh8s2sj67gkdibs1490ia41onkedcbakmqs9ur2o6crt99j6r'
]


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
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def index():
    return {"message": "Setting up server!"}
