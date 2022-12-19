import firebase_admin
from firebase_admin import credentials, auth, firestore
from pathlib import Path
from firebase_admin.exceptions import FirebaseError
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, TypeVar
from fastapi.param_functions import Query
import os


cred = credentials.Certificate(
    'internal/peerbit-6557f-firebase-adminsdk-rqekg-3ae7a5266b.json')

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'internal/peerbit-6557f-firebase-adminsdk-rqekg-3ae7a5266b.json'

firebase_app = firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "peerbit-655f.appspot.com"
    }
)

db = firestore.AsyncClient()

print(firebase_app.project_id)


def verify_token(token):
    try:
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        uid = decoded_token['uid']
        user = auth.get_user(uid, firebase_app)
        user_id = user.uid + ":t09"
        name = user.display_name
        email = user.email
        return [True, user_id, name, email]
    except ValueError:
        return [False, "Token was not a string, or is empty."]
    except auth.InvalidIdTokenError:
        return [False, "Invalid token."]
    except auth.ExpiredIdTokenError:
        return [False, "Token expired."]
    except auth.RevokedIdTokenError:
        return [False, "Token was revoked, illegal."]
    except auth.UserDisabledError:
        return [False, "User record is disabled."]
    except:
        return [False, "Some unidentified error with the token. Sorry."]


async def get_user_data(uid):
    try:
        user_auth_record = auth.get_user(uid)

        user_details_ref = db.collection("userDetails").document(uid)

        user_details = await user_details_ref.get()

        if user_details.exists:
            data = user_details.to_dict()
            email = user_auth_record.email
            name = data["firstName"] + " " + data["lastName"]
            profulePictureURL = data["avatar"]
            user_id = uid + ":t09"
            result = {
                "status": "ok",
                "name": name,
                "profilePictureURL": profulePictureURL,
                "email": email,
                "id": user_id
            }
            return result
        else:
            return {"status": "error", "message": "User does not exist"}
    except ValueError:
        return {"status": "error", "message": "User ID is malformed"}
    except auth.UserNotFoundError:
        return {"status": "error", "message": "User does not exist"}
    except FirebaseError:
        return {"status": "error", "message": "Error occured while retrieving the user"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# async def get_internal_uid(external_uid):
#     try:
#         uid_collection_ref = db.collection("ssoUIDs")
#         uid_query_ref = uid_collection_ref.where(
#             "externalUid", "==", external_uid)
#         uid_ref = uid_query_ref.stream()
#         async for uid in uid_ref:
#             data = uid.to_dict()
#             return data["internalUID"]
#         return None
#     except:
#         return None

async def create_user_token(uid):
    try:
        token = await auth.create_custom_token(uid)
        return {"status": "ok", "token": str(token)}
    except Exception as e:
        return {"status": "error", "exception": str(e)}
