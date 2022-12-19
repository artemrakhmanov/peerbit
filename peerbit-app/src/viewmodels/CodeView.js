import { confirmPasswordReset } from "@firebase/auth"
import store from "../reducers/store"
import { incrementCurrentCommentID, updateComments } from "./DBQueries"


export async function addNewComment(
                        username,
                        commentBody, 
                        commentsObject, 
                        commentLines, 
                        selectedLine,
                        setCommentLines,
                        submissionID,
                        submissionData,
                        revisionNo
                        ) {
    console.log("ADD NEW COMMENT")
    console.log(commentsObject)
    const uid = store.getState().login.value.uid
    submissionData.currentCommentID += 1
    const commentID = submissionData.currentCommentID
    
    incrementCurrentCommentID(submissionID)

    const newComment = {
        uid: uid,
        username: username,
        id: commentID,
        body: commentBody,
        replies: []
    }
    if (commentLines.includes(selectedLine)) {

        console.log("CHECK REVISION NO", revisionNo, commentsObject)

        commentsObject.contents[revisionNo].comments.find(comment=> comment.line === selectedLine)
            .comments.unshift(newComment)

        submissionData.code = commentsObject

        console.log(submissionData)

        console.log("ABOUT TO UPDATE COMMENTS")
        const updateResponse = await updateComments(submissionID, commentsObject, submissionData)
        console.log("updated comments, add:", updateResponse)

        return Promise.resolve(true)
    } else {

        const newLineComment = {
            line: selectedLine,
            comments: [newComment]
        }

        if (commentsObject.contents[revisionNo].comments) {
            console.log("PUSH comment")
            commentsObject.contents[revisionNo].comments.push(
                newLineComment
            )
        } else {
            console.log("create array with comment")
            commentsObject.contents[revisionNo].comments = [
                newLineComment
            ]
        }
        setCommentLines(commentLines.concat([selectedLine]))
        //db action, from where return promise
        console.log("ABOUT TO UPDATE COMMENTS")
        const updateResponse = await updateComments(submissionID, commentsObject)
        console.log("updated comments, add:", updateResponse)

        return Promise.resolve(true)
    }
}

export async function addNewReply(
                        username,
                        commentBody,
                        replyParentID,
                        commentsObject,
                        selectedLine,
                        submissionID,
                        submissionData,
                        revisionNo
                        ) {
    const uid = store.getState().login.value.uid

    submissionData.currentCommentID += 1
    const commentID = submissionData.currentCommentID
    
    incrementCurrentCommentID(submissionID)

    // const replyParentUsername = 
    //     commentsObject
    //         .comments.find(comment => comment.line === selectedLine)
    //         .comments.find(comment => comment.id === replyParentID)
    //         .username

    const newReply = {
        uid: uid,
        username: username,
        id: commentID,
        body: commentBody
    }

    const newComObj = commentsObject.contents[revisionNo]
        .comments.find(comment => comment.line === selectedLine)
        .comments.find(comment => comment.id === replyParentID)
        .replies.push(newReply)

    const updateResponse = await updateComments(submissionID, commentsObject)
    console.log("updated comments, reply:", updateResponse)

    // return Promise.resolve(true)
}