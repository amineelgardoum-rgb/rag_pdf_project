from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import (upload_route,health_route,home_route,query_route,scalar_route)
from app.core.lifespan import lifespan
from app.core.config import APP_NAME


app = FastAPI(
    title=APP_NAME,
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_route.router,prefix="/api/v1")
app.include_router(query_route.router,prefix="/api/v1")
app.include_router(health_route.router,prefix="/api/v1")
app.include_router(home_route.router)
app.include_router(scalar_route.router)

if __name__=="__main__":
    import uvicorn
    uvicorn.run("app.main:app",host="127.0.0.1",port=8000,reload=True)