from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.param_functions import Query
from firebase_admin.auth import verify_id_token
from starlette.responses import RedirectResponse
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

from internal.auth import get_user_data, verify_token

router = APIRouter(
    prefix="/api/sg/users"
)


@router.get("/{id}")
async def get_user_details(id: str):
    # remove the SG protocol uid appendage
    internal_uid = id[:-4]
    # call firebase to retieve user data
    user_details = await get_user_data(internal_uid)
    return user_details
