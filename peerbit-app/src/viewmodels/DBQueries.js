import { functionExpression } from "@babel/types";
import { async } from "@firebase/util";
import {
    getFirestore, doc, setDoc, addDoc,
    updateDoc, increment, arrayUnion, arrayRemove,
    getDoc, collection, getDocs,
    where, query
} from "firebase/firestore";
import { promised } from "q";
import store from "../reducers/store";

import { app } from '../viewmodels/Firebase';
import { getUserData } from "./UserDBQueries";

const db = getFirestore();
const date = new Date();




export async function addNewSubmission(
    attachmentStr,
    attachmentURLS,
    name,
    shortDesc,
    fullDesc,
    posterUserID,
    fileName,
    codeLines,
    zipURL,
    userDetails,
    shouldBeReviewed
) {
    try {

        const reviewStage = shouldBeReviewed ? 2 : 3

        const docRef = await addDoc(collection(db, "codeSubmissions"), {
            attachmentStr:attachmentStr,
            attachmentURLS:attachmentURLS,
            author: {
                displayName: userDetails.displayName,
                position: userDetails.position,
                profileURL: userDetails.profileURL,
                userID: userDetails.uid,
                username: userDetails.username,
                workplace: userDetails.workplace
            },
            name: name,
            shortDesc: shortDesc,
            longDesc: fullDesc,
            views: 0,
            datePosted: date,
            code: {
                contents: [
                    {
                        revisionNo: 0,
                        lines: codeLines,
                        filename: fileName,
                        comments: []
                    }
                ]
            },
            noRevisions: 0,
            fileName: fileName,
            currentCommentID: 0,
            reviewStage: reviewStage,
            zipURL: zipURL,
            discussions: {
                contents: [

                ]
            },
            issues: {
                numberOfOpenIssues: 0,
                issuesByReviewer : {
                    1: [],
                    2: []
                }
            },
            reviewers : {
                numberOfReviewers: 0
            }
        })
        console.log("Added to db, with ID : " + docRef.id);
        addToTeaser(docRef.id, name, shortDesc, userDetails, reviewStage);
        console.log("with authorid:", posterUserID)
        return (docRef);
    }
    catch (error) {
        console.log(error.message);
        return (error.code);
    }
}

export async function addToTeaser(docID, name, shortDesc, userDetails, reviewStage) {
    try {
        const teasers = doc(db, "submissionTeaser", "teaser");
        console.log(docID, name, shortDesc, userDetails, "CHGEEEJKKLJL")
        const check = await updateDoc(teasers, {
            "teaserArray": arrayUnion({
                submissionID: docID,
                name: name,
                shortDesc: shortDesc,
                reviewStage: reviewStage,
                posterUserID: userDetails.uid,
                author: {
                    pictureURL: userDetails.profileURL,
                    displayName: userDetails.displayName,
                    workplace: userDetails.workplace,
                    position: userDetails.position
                }
            })
        })
    }
    catch (error) {
        console.log(error)
        return (error.code)
    }
}



export async function getSubmissionData(
    submissionID
) {
    try {
        const docRef = doc(db, "codeSubmissions", submissionID);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const submissionData = docSnap.data()
            submissionData.id = docSnap.id
            // const authorDetails = await getUserData(submissionData.posterUserID)
            // submissionData.author = authorDetails
            console.log("SUBMISSION DATA WITH AUTHOR OBJECT")
            console.log(submissionData)
            return submissionData;
        } else {
            console.log("No such document");
            return (100);
        }
    }
    catch (error) {
        return (error.code);
    }
}


export async function getTeasers() {
    try {
        const docRef = doc(db, "submissionTeaser", "teaser");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const teasers = docSnap.data()
            const teaserArray = teasers.teaserArray;
            return teaserArray.reverse();
        } else {
            console.log("No teasers");
            return (100);
        }
    }
    catch (error) {
        return (error.code);
    }
}


export async function getAllSubmissions() {
    try {
        let teaserArray = await getTeasers();
        for (let i = 0; i < teaserArray.length; i++) {
            teaserArray.id = teaserArray.submissionID;
        }
        return teaserArray;
    }

    catch (error) {
        return (error.code);
    }
}



export async function getUserSubmissions(
    userID
) {
    try {
        //if no uid is passed to the function - query for current logged in user
        const uid = userID ? userID : store.getState().login.value.uid
        const submissionArray = await getAllSubmissions();
        var count = 1;
        for (let i = 0; i < submissionArray.length; i++) {
            if (submissionArray[i].posterUserID == uid) {
                count++;
            }
        }
        var submissionObjects = new Array(count);
        count = 0;
        for (let i = 0; i < submissionArray.length; i++) {
            if (submissionArray[i].posterUserID == uid) {
                submissionObjects[count] = submissionArray[i];
                count++;
            }
        }
        return submissionObjects;
    } catch (error) {
        console.log(error);
        return (error);
    }
}


export async function getUserSubmissionData() {
    try {
        const userSubmissionTeasers = await getUserSubmissions();
        console.log("submission teaserss ")
        console.log(userSubmissionTeasers);
        let fullSubmissionArray = [];
        let submission;
        for (let i = 0; i < userSubmissionTeasers.length - 1; i++) {
            console.log("LOOOOP", i)
            submission = userSubmissionTeasers[i];
            console.log(submission)
            let fullSubmission = await getSubmissionData(submission.submissionID);
            fullSubmissionArray.push(fullSubmission)
        }
        console.log(fullSubmissionArray)
        return fullSubmissionArray;
    } catch (error) {
        console.log(error)
        return (error)
    }
}
    
    export async function getCurrentlyUnderReview(
    ) {
        try {
            const uid = store.getState().login.value.uid;
            const authorDetails = await getUserData(uid);
            const submissionsToFetch = authorDetails.submissionsReviewing;
            let submissionArray = []
            for (let i = 0; i < submissionsToFetch.length; i++) {
                const submissionID = submissionsToFetch[i];
                const submission = await getSubmissionData(submissionID);
                submissionArray.push(submission);
            }
            return submissionArray;
        }
        catch (error) {
            return (error);
        }
    
    }

export async function addNewReview(
    submissionID,
    reviewTitle,
    reviewerUID,
    reviewText
) {
    const reviewObject = {
        reviewTitle: reviewTitle,
        reviewText: reviewText,
        reviewerUID: reviewerUID,
        revisionNoAttached: -1,
        resolved: false
    }
    try {
        const submission = doc(db, "codeSubmissions", submissionID);
        await updateDoc(submission, {
            reviews: arrayUnion(reviewObject)
        })
    }
    catch (error) {
        return (error);
    }

}

export async function addNewRevision(
    submissionID,
    directoryContents
) {
    try {
        const revisionNo = await getRevisionNo(submissionID);
        const submission = doc(db, "codeSubmissions", submissionID);
        await updateDoc(submission, {
            revisions: arrayUnion({
                directoryContents,
                revisionNo: revisionNo
            }),
            noRevisions: increment(1)
        })
    }
    catch (error) {
        return error;
    }
}

export async function getRevisionNo(
    submissionID
) {
    try {
        const docRef = doc(db, "codeSubmissions", submissionID);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return (docSnap.data().noRevisions);
        } else {
            return (100);
        }
    }
    catch (error) {
        return (error.code);
    }
}

export async function updateReviewStage(
    stage,
    oldStage,
    submissionID,
    submissionData
) {
    try {
        const submission = doc(db, "codeSubmissions", submissionID);
        await updateDoc(submission, {
            reviewStage: stage
        })
        await updateStageTeaser(submissionData, stage, oldStage, submissionID);
    }
    catch (error) {
        return (error);
    }

}

export async function updateStageTeaser(
    submissionData,
    stage,
    oldStage,
    submissionID
) {
    try {
        const teasers = doc(db, "submissionTeaser", "teaser");
        await updateDoc(teasers, {
            teaserArray: arrayRemove({
                submissionID: submissionID,
                name: submissionData.name,
                shortDesc: submissionData.shortDesc,
                posterUserID: submissionData.posterUserID,
                reviewStage: oldStage,
                author: {
                    profileURL: submissionData.author.profileURL,
                    displayName: submissionData.author.displayName,
                    workplace: submissionData.author.workplace,
                    position: submissionData.author.position
                }
            })
        })
        await updateDoc(teasers, {
            teaserArray: arrayUnion({
                submissionID: submissionID,
                name: submissionData.name,
                shortDesc: submissionData.shortDesc,
                posterUserID: submissionData.posterUserID,
                reviewStage: stage,
                author: {
                    profileURL: submissionData.author.profileURL,
                    displayName: submissionData.author.displayName,
                    workplace: submissionData.author.workplace,
                    position: submissionData.author.position
                }
            })
        })
    }
    catch (error) {
        return (error)
    }
}

export async function updateTeaser(
    oldTeaser,
    newTeaser
) {
    try {
        const teasers = doc(db, "submissionTeaser", "teaser");
        await updateDoc(teasers, {
            teaserArray: arrayRemove(oldTeaser)
        })
        await updateDoc(teasers, {
            teaserArray: arrayUnion(newTeaser)
        })
    }
    catch (error) {
        return (error)
    }
}


export async function updateComments(
    submissionID,
    newCommentData,
    submissionData
) {
    try {
        console.log("NEEEW comment",newCommentData)
        const submission = doc(db, "codeSubmissions", submissionID);

        const stringPayload = JSON.stringify(newCommentData)
        const parsedPayload = JSON.parse(stringPayload)

        console.log("CHECK:", parsedPayload)

        await updateDoc(submission, {
            code: parsedPayload
        })
        console.log("Added comment to DB", newCommentData);
        return true;
    }
    catch (error) {
        return error.code;
    }
}


// export async function addCommentOnLine(
//     submissionID,
//     comment,
//     posterUserID,
//     commentID,
//     lineNo
// ) {
//     try {
//         const submission = doc(db, "codeSubmissions", submissionID);
//         await updateDoc(submission, {
//             comments: arrayUnion({
//                 line: lineNo,
//                 lineComments: [
//                     {
//                         uid: posterUserID,
//                         id: commentID,
//                         body: comment,
//                         replies: []
//                     }
//                 ]
//             })
//         })
//         console.log("Added comment to DB");
//     }
//     catch (error) {
//         return (error.code);
//     }
// }


export async function getNextCommentID(
    submissionID
) {
    try {
        const docRef = doc(db, "codeSubmissions", submissionID);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return (docSnap.data().currentCommentID);
        } else {
            return (100);
        }
    }
    catch (error) {
        return (error.code);
    }
}

export async function incrementCurrentCommentID(
    submissionID
) {
    try {
        const submission = doc(db, "codeSubmissions", submissionID)
        await updateDoc(submission, {
            currentCommentID: increment(1)
        })
        console.log("Incremented current comment ID");
        return (200);
    }
    catch (error) {
        console.log(error.message);
        return (error.code);
    }
}





export async function incrementViews(
    submissionID
) {
    try {
        const submission = doc(db, "codeSubmissions", submissionID)
        await updateDoc(submission, {
            views: increment(1)
        })
        console.log("Incremented view count");
        return (200);
    }
    catch (error) {
        console.log(error.message);
        return (error.code);
    }
}


export async function getSubmissionsForFindReview()
{
    try {
        //if no uid is passed to the function - query for current logged in user
        const submissionArray = await getAllSubmissions();
        var count = 1;
        for (let i = 0; i < submissionArray.length; i++) {
            if (submissionArray[i].reviewStage === 2) {
                count++;
            }
        }
        var submissionObjects = new Array(count);
        count = 0;
        for (let i = 0; i < submissionArray.length; i++) {
            if (submissionArray[i].reviewStage === 2) {
                submissionObjects[count] = submissionArray[i];
                count++;
            }
        }
        return submissionObjects;
    } catch (error) {
        console.log(error);
        return (error);
    }
}



export async function removeRevision(
    revision, 
    submissionID
) {
    try {
        const submission = doc(db, "codeSubmissions", submissionID);
        await updateDoc(submission, {
            revisions: arrayRemove(revision)
        })
    }
    catch (error) {
        return error;
    }
}

export async function addRevisionWithRevisionNo(
    revision,
    submissionID
) {
    try {
        const submission = doc(db, "codeSubmissions", submissionID);
        await updateDoc(submission, {
            revisions: arrayUnion(revision)
        })
    }
    catch (error) {
        return error;
    }
}

export async function exploreFolder(contents, pathArray, depth) {
    let file;
    for (let i = 0; i < contents.length; i++) {
        file = contents[i];
        if(depth == pathArray.length - 1){
            if(file.name == pathArray[depth]){
                return file;
            }
        }
        else if(file.isFolder == true){
            if(file.name == pathArray[depth]){
                return exploreFolder(file, pathArray, depth + 1);
            }
        }
    }
}

export async function addNewCommentForFile(
    username,
    commentBody,
    commentsObject,
    commentLines,
    selectedLine,
    setCommentLines,
    submissionID,
    submissionData,
    path,
    revisionNumber
) {
    console.log(commentsObject)
    const uid = store.getState().login.value.uid



    const pathArray = path.split('/');
    const revisions = submissionData.revisions;
    let revision;
    for (let i = 0; i < revisions.length; i++) {
        if(revisions[i].revisionNo = revisionNumber) {
            revision = revisions[i];
        }
    }
    await removeRevision(revision);
    let currentLocation = revision.contents;
    let file = exploreFolder(currentLocation, pathArray, 0);
    const commentID = file.currentCommentID;
    file.currentCommentID += 1;

    const newComment = {
        uid: uid,
        username: username,
        id: commentID,
        body: commentBody,
        replies: []
    }

    if (commentLines.includes(selectedLine)) {

        commentsObject.comments.find(comment => comment.line === selectedLine)
            .comments.unshift(newComment)

        console.log("ABOUT TO UPDATE COMMENTS")
        file.comments = commentsObject;
        const updateResponse = await addRevisionWithRevisionNo(submissionID, revision)
        
        console.log("updated comments, add:", updateResponse)

        return Promise.resolve(true)
    } else {

        const newLineComment = {
            line: selectedLine,
            comments: [newComment]
        }

        if (commentsObject.comments) {
            console.log("PUSH comment")
            commentsObject.comments.push(
                newLineComment
            )
        } else {
            console.log("create array with comment")
            commentsObject = {
                comments: [
                    newLineComment
                ]
            }
        }
        setCommentLines(commentLines.concat([selectedLine]))
        //db action, from where return promise
        console.log("ABOUT TO UPDATE COMMENTS")

        file.comments = commentsObject;
        const updateResponse = await addRevisionWithRevisionNo(submissionID, revision)        
        
        console.log("updated comments, add:", updateResponse)

        return Promise.resolve(true)
    }
}


export async function addNewReplyForFile(
    username,
    commentBody,
    replyParentID,
    commentsObject,
    selectedLine,
    submissionID,
    submissionData,
    path,
    revisionNumber
) {
    const uid = store.getState().login.value.uid

    const pathArray = path.split('/');
    const revisions = submissionData.revisions;
    let revision;
    for (let i = 0; i < revisions.length; i++) {
        if(revisions[i].revisionNo = revisionNumber) {
            revision = revisions[i];
        }
    }
    await removeRevision(revision);
    let currentLocation = revision.contents;
    let file = exploreFolder(currentLocation, pathArray, 0)
    const commentID = file.currentCommentID;
    file.currentCommentID += 1;


    const replyParentUsername =
        commentsObject
            .comments.find(comment => comment.line === selectedLine)
            .comments.find(comment => comment.id === replyParentID)
            .username

    const newReply = {
        uid: uid,
        username: username,
        id: commentID,
        body: "@" + replyParentUsername + " " + commentBody
    }
    commentsObject
        .comments.find(comment => comment.line === selectedLine)
        .comments.find(comment => comment.id === replyParentID)
        .replies.push(newReply)

    file.comments = commentsObject;
    const updateResponse = await addRevisionWithRevisionNo(submissionID, revision)        
        
    return Promise.resolve(true)
}
