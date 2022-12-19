import React from "react"
import styled from "styled-components"
import { Formik, Form } from "formik";
import { InputField2, TextAreaStyle } from "../designsystem/Fields";
import { TextButton2 } from "../designsystem/Buttons";
import { ReplyWrapper, CommentWrapper } from "./CommentRenderer";


export default function NewCommentField(props) {

    const isReply = props.isReply
    const replyUsername = props.replyToUsername
    const username = props.username
    const setIsAddingComment = props.setIsAddingComment
    const onNewCommentAdd = props.onNewCommentAdd

    const FieldBody = (
        <div>
            <Formik
                initialValues={{
                    commentBody: ""
                }}
                onSubmit={values=>{
                    const commentBody = values.commentBody
                    if (commentBody.length > 0) {
                        console.log("submitted new comment: " + values.commentBody)
                        onNewCommentAdd(commentBody)
                    } else {
                        console.log("empty comment == cancel")
                        setIsAddingComment(false)
                    }
                }}
                >
                    {commentProps => (
                        <Form noValidate>
                            <InputField2
                                type="text"
                                as={TextAreaStyle}
                                name="commentBody"
                                value={commentProps.values.commentBody}
                                placeholder="Enter your comment"
                                isValid={true}
                                onChange={(e) => {
                                    commentProps.setFieldValue("commentBody", e.target.value)
                                }}
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "80px",
                                    border: "none",
                                    backgroundColor: "transparent"
                                }}
                            />

                            <div style={{
                                display: "inline-flex",
                                justifyContent: "space-between"
                            }}>
                                <TextButton2
                                    buttonText={"Send"}
                                    onClick={commentProps.handleSubmit}
                                    style={{
                                        // display: "inline-block", 
                                        width: "70px"
                                    }}
                                />

                                <TextButton2
                                    buttonText={"Cancel"}
                                    onClick={() => {
                                        setIsAddingComment(false)
                                    }}
                                    style={{
                                        // display: "inline-block", 
                                        width: "70px"
                                    }}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
        </div>
    )

    return (
        <div>
            {!isReply
            ?
            <CommentWrapper isNew={true}>
                {FieldBody}        
            </CommentWrapper>
            :
            <ReplyWrapper isNew={true}>
                {FieldBody}        
            </ReplyWrapper>
            }
        </div>
    )
}
