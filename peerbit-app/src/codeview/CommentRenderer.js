import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { Colors } from "../designsystem/ColorStyles";
import { B4T, B4 } from "../designsystem/TypographyStyles";
import { TextButton2 } from "../designsystem/Buttons";

import NewCommentField from "./NewCommentField";
import { useSelector } from "react-redux";
// import { get } from "@reduxjs/toolkit/node_modules/immer/dist/internal";

export default function CommentRenderer(props) {

    const revisionNo = props.revisionNo

    const username = useSelector(state => state.login.value.username)

    //actual logic function
    const addNewCommentToDB = props.addNewCommentToDB
    const addNewReplyToDB = props.addNewReplyToDB

    // const [isAddingComment, setIsAddingComment] = useState(false)
    const [isAddingReply, setIsAddingReply] = useState(false)
    const [newReplyParentID, setNewReplyParentID] = useState(0)
    const [replyDestinationUsername, setReplyDestinationUsername] = useState("")

    const [addedNewComment, setAddedNewComment] = useState(false)

    const commentsData = props.commentsData
    const selectedLine = props.selectedLine
    const [commentLines, setCommentLines] = useState([])
    const setComLines = props.setCommentLines
    const submissionData = props.submissionData
    const isAddingComment = props.isAddingComment
    const setIsAddingComment = props.setIsAddingComment

    const submissionID = props.submissionID

    function getCommentLines() {
        setCommentLines(current=>[...submissionData.code.contents[revisionNo].comments.map((comment)=>comment.line)])
    }

    function getCommentsAtLine(line) {
        console.log("reading comments at line", line)
        console.log("heyyyyy",submissionData.code[revisionNo], line )
        // console.log("heyyyyy",submissionData.code[0])
        if (submissionData.code.contents[revisionNo].comments) {
            const branchAtLine = submissionData.code.contents[revisionNo].comments.find(comment => comment.line === line)
            console.log("branch", branchAtLine)
            console.log(branchAtLine)

            if (!branchAtLine) {
                return []
            }

            if (branchAtLine.comments) {
                return branchAtLine.comments
            } else {
                return []
            }
        } else {
            return []
        }
    }

    useEffect(() => {
        console.log("rerendering comments, new comment state: " + isAddingComment, selectedLine)
        console.log(getCommentsAtLine(selectedLine))
        setIsAddingComment(false)
        setIsAddingReply(false)
        setNewReplyParentID(0)
        setReplyDestinationUsername("")
        setAddedNewComment(false)
        getCommentLines()
    }, [selectedLine, addedNewComment])

    function onAddNewComment(commentBody) {

        console.log("HEEEEEEEEEEYYEYEYYEYEY", submissionData.code[revisionNo])
        addNewCommentToDB(
            username,
            commentBody,
            submissionData.code,
            commentLines,
            selectedLine,
            setComLines,
            submissionID,
            submissionData,
            revisionNo
        )
        .then((status) => {
            console.log("then from addNewCommentToDB")
            if (status) {
                setAddedNewComment(true)
            }
        })
    }

    function onAddNewReply(commentBody, replyParentID) {
        addNewReplyToDB(
            username,
            commentBody,
            replyParentID,
            submissionData.code,
            selectedLine,
            submissionID,
            submissionData,
            revisionNo
        )
        .then((status) => {
            setNewReplyParentID(0)
            setReplyDestinationUsername("")
            setAddedNewComment(true)
        })
    }

    function showReplyForm(parentCommentID, destinationUsername) {
        setNewReplyParentID(parentCommentID)
        setReplyDestinationUsername(destinationUsername)
        setIsAddingReply(true)
    }

    return (
        <CommentRenderWrapper>
            {/* {selectedLine !== 0
            ?
            <TextButton2 
            buttonText={"Add Comment"} 
            onClick={() => {
                setIsAddingComment(true)
            }}
            />
            :
            <div style={{textAlign: "center"}}>
                <B4>Choose a line to add comment to.</B4>
            </div>
            } */}

            {isAddingComment 
            ?
            <NewCommentField 
                isReply={false} 
                setIsAddingComment={setIsAddingComment}
                onNewCommentAdd={(newCommentBody) => {
                    onAddNewComment(newCommentBody)
                }}
            />
            :
            <div/>
            }
            
            <div>
                {commentLines.includes(selectedLine)
                ?
                // <div onClick={()=>{
                //     console.log(getCommentsAtLine(selectedLine))
                // }}>{selectedLine}</div>
                getCommentsAtLine(selectedLine).map((parentComment) => {
                    return (
                    <div>
                        <CommentComponent 
                            isReply={false}
                            commentBody={parentComment.body}
                            username={parentComment.username}
                            onReply={() => {
                                showReplyForm(parentComment.id, parentComment.uid)
                            }}
                        />

                        {parentComment.replies.length > 0
                        ?
                        parentComment.replies.map((childComment) => {
                            return <CommentComponent
                                        isReply={true}
                                        commentBody={childComment.body}
                                        username={childComment.username}
                                        onReply={() => {
                                            showReplyForm(parentComment.id, childComment.uid)
                                        }}
                                    />
                        })
                        :
                        <div/>
                        }

                        {isAddingReply && parentComment.id === newReplyParentID
                        ?
                        <NewCommentField
                            isReply={true}
                            setIsAddingComment={setIsAddingReply}
                            onNewCommentAdd={(newReplyBody) => {
                                onAddNewReply(newReplyBody,parentComment.id)
                            }}
                        />
                        :
                        <div/>
                        }

                    </div>
                    )
                })
                :
                <div />
                }
            </div>

        </CommentRenderWrapper>
    )
}

function CommentComponent(props) {

    const isReply = props.isReply
    const commentBody = props.commentBody
    const username = props.username
    const onReply = props.onReply

    return (
        <div>
            {!isReply
            ?
            <CommentWrapper>
                <div style={{margin: "5px"}}>
                    <B4>{commentBody}</B4>
                </div>

                <CommentBottomBar 
                    username={username}
                    onReply={onReply}
                />
            </CommentWrapper>
            :   
            <ReplyWrapper>

                <div style={{margin: "5px"}}>
                    <B4>{commentBody}</B4>
                </div>
                
                <CommentBottomBar
                    username={username}
                    onReply={onReply}
                />
            </ReplyWrapper>
            }
        </div>
    )
}

function CommentBottomBar(props) {

    const username = props.username
    const img = props.img
    const onReply = props.onReply

    return (
        <div>
            <div style={{height: "30px"}} />

            <div
                style={{
                    position: "absolute",
                    display: "inline",
                    bottom: "0px",
                    height: "20px",
                    margin: "5px"
                }}
            > 
                <B4T>{username}</B4T>
            </div>

            <div
                style={{
                    position: "absolute",
                    display: "inline",
                    right: "0px",
                    bottom: "0px",
                    height: "20px",
                    margin: "5px"
                }}
            > 
                <TextButton2 
                    buttonText={"Reply"} 
                    onClick={onReply}
                    style={{
                        width: "50px",
                        transform: "translateY(-2px)"
                    }}
                />
            </div>
        </div>
    )
}

const CommentRenderWrapper = styled.div`
    /* position: absolute;
    height: 84vh;
    width: 100%;
    overflow: scroll; */
`

export const CommentWrapper = styled.div`
    position: relative;
    min-height: 100px;
    width: 50%;
    border: 1px solid ${props => props.isNew ? Colors.orange : Colors.gray};
    border-radius: 10px;
    margin: 7px;
    box-shadow: 0px 2px 5px ${Colors.shadow};
`

export const ReplyWrapper = styled.div`
    position: relative;
    min-height: 100px;
    width: 50%;
    margin: 7px;
    margin-left: 50px;
    border: 1px solid ${props => props.isNew ? Colors.orange : Colors.gray};
    border-radius: 10px;
`