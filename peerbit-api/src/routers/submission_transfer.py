from fastapi import FastAPI, status, Response
from fastapi.param_functions import Query
from fastapi.params import Depends
from fastapi.routing import APIRouter
from pydantic.main import BaseModel
from jose import jwt

from fastapi.responses import FileResponse, Response
from starlette.responses import RedirectResponse, StreamingResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from internal.transfer import get_submission_metadata, get_submission_zip_url, get_file_url

from io import StringIO
import requests
import zipfile
import asyncio

router = APIRouter(
    prefix="/api/sg"
)


# class Token(BaseModel):
#     access_token: str


# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/import")
async def import_submission(
        from_url: str = Query(..., alias="from"),
        id: str = Query(...),
        token: str = Query(...)
):
    # retrieve submission metadata

    #
    url = await get_file_url(id, from_url, token)

    # call the import submission

    return url

    # return {"not implemented"}

    # completed, pending = await asyncio.wait([get_internal_uid(author_external_uid)])


@router.get("/export/publication/{submission_id}", status_code=200)
async def serve_codefiles(
    submission_id: str,
    response: Response
    # token: str = Depends(oauth2_scheme)
):
    completed, pending = await asyncio.wait([get_submission_zip_url(submission_id)])
    zip_url = completed.pop().result()

    if zip_url is not None:
        if zip_url["status"] != "success":
            response.status_code = status.HTTP_400_BAD_REQUEST
            return zip_url
        else:
            return RedirectResponse(zip_url["url"])
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "status": "error",
            "message": "No such submission exists"
        }


@router.get("/export/publication/{submission_id}/metadata", status_code=200)
async def server_submission_metadata(
    submission_id: str,
    response: Response
    # token: str = Depends(oauth2_scheme)
):
    completed, pending = await asyncio.wait([get_submission_metadata(submission_id)])
    metadata = completed.pop().result()
    if metadata is not None:
        if metadata["status"] != "error":
            return metadata
        else:
            response.status_code = HTTP_400_BAD_REQUEST
            return metadata
    else:
        response.status_code = HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "status": "error",
            "message": "internal server error"
        }
