from fastapi import FastAPI, status, Response
from fastapi.routing import APIRouter
from fastapi.param_functions import Query
from firebase_admin import auth
from firebase_admin.auth import UidAlreadyExistsError, verify_id_token
from firebase_admin.exceptions import FirebaseError
from starlette.responses import RedirectResponse
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

from internal.auth import get_user_data, verify_token, create_user_token

import asyncio

client = "https://peerbit-6557f.web.app"

router = APIRouter(
    prefix="/api/sg/sso"
)

# write a login with token method to check that others token is correct, return token to front-end


@router.get("/createuser", status_code=200)
async def create_sso_user(
    email,
    uid
):
    try:
        # call firebase to create  a user
        user_record = auth.create_user(uid=uid, email=email)
        token = auth.create_custom_token(uid)

        return {"status": "oknew", "token": token}
    except UidAlreadyExistsError:
        token = auth.create_custom_token(uid)
        return {"status": "okexists", "token": token}
    except Exception as e:
        return {"status": "error", "message": e}


@router.get("/login")
async def login_sso(
        secondary_journal_url: HttpUrl = Query(..., alias="from"),
        state: str = Query(...)):
    # return "hey"
    return RedirectResponse(client + "/sso?from=" +
                            secondary_journal_url + "&state=" + state)


@router.post("/verify", status_code=200)
async def verify_sso_login(token: str):

    # return {"hey verifying token"}

    is_valid = verify_token(token)

    if is_valid[0]:
        uid = is_valid[1][:-4]  # remove journal appendage
        user_data = await get_user_data(uid)

        if user_data["status"] != "ok":
            return {
                "status": "error",
                "error": "User doesnt have name, internal"
            }

        return {
            "status": "ok",
            "user_id": is_valid[1],
            "name": user_data["name"],
            "email": is_valid[3],
        }
    else:
        return {
            "status": "error",
            "error": is_valid[1]
        }


@router.get("/callback")
async def approve_login(token: str, state: str):
    # redirect to the client page to deal with it
    clientURL = "https://e0f4-138-251-172-37.ngrok.io"
    resultURL = clientURL + "?token=" + token + "&state=" + state
    return RedirectResponse(resultURL)
