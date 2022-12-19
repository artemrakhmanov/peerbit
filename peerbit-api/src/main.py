from fastapi import Body, FastAPI, Depends

from internal import auth
from routers import sso, submission_transfer


from fastapi.param_functions import Query
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

from routers import users

from starlette.responses import RedirectResponse

from fastapi.middleware.cors import CORSMiddleware

journal_url = "https://peerbit-6557f.web.app/"

app = FastAPI(

)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sso.router)
app.include_router(submission_transfer.router)
app.include_router(users.router)
