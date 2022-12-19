import requests
from internal.auth import db
from firebase_admin import credentials, auth, firestore


async def get_file_url(endpoint_url):
    r = requests.get(endpoint_url)
    return r.url


async def import_submission(file_url, metadata):
    # check that user is present in our database

    # if yes, form a payload and add to transfers collection

    # if no, ignore and return corresponding message

    return ""


async def get_submission_zip_url(submissionID):
    try:
        submission_ref = db.collection(
            "codeSubmissions").document(submissionID)
        submission_snapshot = await submission_ref.get()
        if submission_snapshot.exists:
            data = submission_snapshot.to_dict()
            try:
                # change to new format
                zip_url = data["zipURL"]
                return {
                    "status": "success",
                    "url": zip_url
                }
            except:
                return {
                    "status": "error",
                    "message": "Submission does not have a zip, internal deprecated behaviour"
                }
        else:
            return {
                "status": "error",
                "message": "No such submission exists"
            }
    except:
        return {
            "status": "error",
            "message": "Internal Error"
        }


async def get_submission_metadata(submissionID):
    try:
        submission_ref = db.collection(
            "codeSubmissions").document(submissionID)

        submission_snapshot = await submission_ref.get()

        # change to new format
        if submission_snapshot.exists:
            data = submission_snapshot.to_dict()
            name = submissionID
            title = data["name"]
            author_id = data["author"]["userID"] + ":t09"
            short_description = data["shortDesc"]
            return {
                "status": "ok",
                "data": {
                    "publication": {
                        "name": name,
                        "title": title,
                        "owner": author_id,
                        "introduction": short_description,
                        "revision": "v1.0.0",
                        "collaborators": []
                    },
                    "reviews": []
                }
            }
        else:
            return {
                "status": "error",
                "message": "submission does not exist"
            }

    except:
        return {
            "status": "error",
            "message": "Internal Error"
        }
