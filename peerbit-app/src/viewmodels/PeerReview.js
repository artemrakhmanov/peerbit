import {
    getFirestore, doc, setDoc, addDoc,
    updateDoc, increment, arrayUnion, arrayRemove,
    getDoc, collection, getDocs,
    where, query, serverTimestamp, Firestore
} from "firebase/firestore";
import { async } from "@firebase/util";
import store from "../reducers/store";
import JSZip from "jszip";

import { getSourceCodeLines } from "./Submission";
import { upload } from "./UploadFiles";

const db = getFirestore()

export function getUID() {
    return store.getState().login.value.uid
}

export async function reviewSubmission(submissionData) {

    if (getUID() === submissionData.author.userID) {return}

    try {
        const uid = store.getState().login.value.uid
        const submission = doc(db, "codeSubmissions", submissionData.id);
        
        if (submissionData.reviewers.numberOfReviewers === 0) {
            await updateDoc(submission, {
                "reviewers.numberOfReviewers" : 1,
                "reviewers.1" : {
                    approved: false,
                    userID: uid
                }
            })
        } else if (submissionData.reviewers.numberOfReviewers === 1 & submissionData.reviewers["1"].userID !== uid) {
            await updateDoc(submission, {
                "reviewers.numberOfReviewers" : 2,
                "reviewStage" : 1,
                "reviewers.2" : {
                    approved: false,
                    userID: uid
                }
            })
            //update teaser
        }

        return true
    } catch (error) {
        alert(error)
        return false
    }
}

export async function createIssue(submissionData, issueName, issueDescription, authorN) {
    console.log("CREATE ISSUE", submissionData, issueName, issueDescription, authorN)
    try {
        const payload = {
            changes: [],
            description: issueDescription,
            name: issueName,
            isResolved: false
        }

        //add new issue
        const submission = doc(db, "codeSubmissions", submissionData.id)

        if (authorN === 1) {
            await updateDoc(submission, {
                "issues.issuesByReviewer.1": arrayUnion(payload)
            })
        } else {
            await updateDoc(submission, {
                "issues.issuesByReviewer.2": arrayUnion(payload)
            })
        }

        //increment issue count
        await updateDoc(submission, {
            "issues.numberOfOpenIssues": submissionData.issues.numberOfOpenIssues + 1
        })

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


export async function respondToIssueAPI(
                    submissionData,
                    responseMessage,
                    isResolved,
                    issue,
                    changeDate
                ) {
    console.log("RESPOND TO ISSUE", responseMessage, isResolved, issue, submissionData.author)
    //form payload
    const payload = {
        responseMessage: responseMessage,
        isResolved: isResolved
    }
    //find location for the changes to be inserted at
    let issueIndex = -1
    let authorN = 0
    if (
        submissionData.issues.issuesByReviewer["1"].indexOf(issue) !== -1
    ) {
        issueIndex = submissionData.issues.issuesByReviewer["1"].indexOf(issue)
        authorN = 1
    } else {
        issueIndex = submissionData.issues.issuesByReviewer["2"].indexOf(issue)
        authorN = 2
    }

    submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].isResolved = isResolved
    //find change
    const change = submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].changes.filter((change)=>change.date === changeDate)
    const changeIndex = submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].changes.indexOf(change[0])

    console.log("BOSS", change)

    submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].changes[changeIndex].responseMessage = responseMessage
    submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].changes[changeIndex].isResolved = isResolved
    submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].changes[changeIndex].isResponded = true

    //change count of open issues if resolved one
    if (isResolved) {
        submissionData.issues.numberOfOpenIssues = submissionData.issues.numberOfOpenIssues - 1
    }

    console.log("BOSS2", submissionData)

    const submission = doc(db, "codeSubmissions", submissionData.id)

    await updateDoc(submission, {
        "issues": submissionData.issues
    })

    return true
}

export async function pushChangesToIssueDB(
                            codeFile,
                            changesMadeMessage,
                            issue,
                            submissionData
                        ) {
    console.log("PUSHING CHGABGES TO FIRBASE", codeFile, changesMadeMessage, issue, submissionData)

    //read lines and upload code version
    const reader = new FileReader()
    const fileName = codeFile.name
    const lines = await getSourceCodeLines(codeFile)

    const fileURL = await upload(codeFile)

    //increment revision no
    const submission = doc(db, "codeSubmissions", submissionData.id)
    const newNoRevisions = submissionData.noRevisions + 1
    await updateDoc(submission, {
        noRevisions: newNoRevisions
    })

    //append to array of changes of author
    const issueChangesPayload = {
        changesMadeMessage: changesMadeMessage,
        date: new Date(),
        revision: newNoRevisions,
        responseMessage: "",
        isResponded: false,
        isResolved: false
    }
    //find location for the changes to be inserted at
    let issueIndex = -1
    let authorN = 0
    if (
        submissionData.issues.issuesByReviewer["1"].indexOf(issue) !== -1
    ) {
        issueIndex = submissionData.issues.issuesByReviewer["1"].indexOf(issue)
        authorN = 1
    } else {
        issueIndex = submissionData.issues.issuesByReviewer["2"].indexOf(issue)
        authorN = 2
    }

    submissionData.issues.issuesByReviewer[authorN.toString()][issueIndex.toString()].changes.push(issueChangesPayload)
    await updateDoc(submission, {
        "issues": submissionData.issues
    })

    //form payload and add a version to code.contents
    const revisionPayload = {
        lines: lines,
        revisionNo: newNoRevisions,
        filename: fileName,
        comments: []
    }

    await updateDoc(submission, {
        "code.contents" : arrayUnion(revisionPayload)
    })

    return true
}

export async function approveSubmission(authorN, submissionData) {

    submissionData.reviewers[authorN.toString()].approved = true
    //check if other approved, if yes - move reviewStage to 0
    if (submissionData.reviewers["1"].approved & submissionData.reviewers["2"].approved) {
        submissionData.reviewStage = 0
    }
    
    const submission = doc(db, "codeSubmissions",submissionData.id)

    await updateDoc(submission, {
        reviewStage: submissionData.reviewStage,
        reviewers: submissionData.reviewers
    })

    return true
}