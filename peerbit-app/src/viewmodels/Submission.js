
import { codeFileExtensions } from "../assets/ProgrammingFileExtensions"
import { upload } from "./UploadFiles"
import { uploadAttachments } from "./UploadAttachments"
import { addNewSubmission } from "./DBQueries"
import store from "../reducers/store"
import { getUserData } from "./UserDBQueries"


export function getProgrammingFileExtensions() {
    return codeFileExtensions
}

export const SubmissionCredentials = {
    NAME: 0,
    SHORTDESCR: 1,
    FILE: 2
}

export function validateSubmissionCredentials(submissionName, shortDescription, file) {
    const result = new Array()

    console.log("hey")

    if (submissionName.length == 0) {
        result.push(SubmissionCredentials.NAME)
    }

    if (shortDescription.length == 0) {
        result.push(SubmissionCredentials.SHORTDESCR)
    }

    if (file == null) {
        result.push(SubmissionCredentials.FILE)
    }

    return result
}

export async function createSubmission(
                    submissionName, 
                    shortDescription, 
                    file, 
                    attachmentFiles,
                    fullDescription, 
                    makePublic) {
    console.log(submissionName, shortDescription, file, fullDescription, makePublic)

//Code adapted from https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
    const reader = new FileReader()
    const fileName = file.name
    const lines = await getSourceCodeLines(file)
    const uid = store.getState().login.value.uid

    console.log(uid)

    //NEED TO STORE FILE URL IN THE SUBMISSION OBJECT
    const fileURL = await upload(file)

    console.log("ZIPURL", fileURL)

    const userDetails = await getUserData()

    console.log("USERDATA CHECK", userDetails)

    const attachmentStr = attachmentFiles.map((file) => file.fileName)

    const attachmentURLS = []

    for(let i = 0; i < attachmentFiles.length; i++ ) {
        const url = await uploadAttachments(attachmentStr[i], attachmentFiles[i]);
        console.log("attachment " + i + ": " + attachmentStr[i])

        attachmentURLS.push(url);
    }

    const addedNewSubmission = await addNewSubmission(
        attachmentStr,
        attachmentURLS,
        submissionName, 
        shortDescription, 
        fullDescription, 
        uid,
        fileName,
        lines, 
        fileURL,
        userDetails,
        makePublic
    )
    }

// https://simon-schraeder.de/posts/filereader-async/
export function getSourceCodeLines(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => {
            const result = reader.result
            //get lines
            // https://stackoverflow.com/questions/23331546/how-to-use-javascript-to-read-local-text-file-and-read-line-by-line
            const lines = result.split(/\r\n|\n/) //more accurate regex expression for windows / unix files
            // resolve the promise
            resolve(lines)
        }

        reader.onerror = reject

        reader.readAsText(file)
    })
}