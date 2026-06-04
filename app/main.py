from fastapi import FastAPI
from app.api.routes import (upload_route,health_route,home_route,query_route)
from app.core.lifespan import lifespan
from app.core.config import APP_NAME

app=FastAPI(
    title=APP_NAME,
    lifespan=lifespan
)

app.include_router(upload_route.router,prefix="/api/v1")
app.include_router(query_route.router,prefix="/api/v1")
app.include_router(health_route.router,prefix="/api/v1")
app.include_router(home_route.router)

