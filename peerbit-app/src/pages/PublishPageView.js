import React from "react";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Colors } from "../designsystem/ColorStyles";
import {
    RectButton1,
    RectButton2,
    RectButton3,
    RectButton4,
    RectButton5,
    TextButton1,
    TextButton2,
    Link
} from "../designsystem/Buttons";

import { getFirestore } from "firebase/firestore";
import { app } from '../viewmodels/Firebase';
import { addNewSubmission, addCommentOnLine, getSubmissionData, getAllSubmissions, incrementViews, getUserSubmissions } from '../viewmodels/DBQueries'
import { render } from "@testing-library/react";
import { upload } from "../viewmodels/UploadFiles";

import { B1, B3T, B2T, T1, S4 } from "../designsystem/TypographyStyles";
import { Formik, Form, Field } from "formik";
import { InputField1, InputField2, TextAreaStyle } from "../designsystem/Fields";
import SubmissionForm from "../components/SubmissionForm";
import { Route, useHistory } from "react-router";
import { Switch } from "react-router";

import CodePreview from "../components/CodePreview";
import CodePreviewGrid from "../components/CodePreviewGrid";
import { WidthAdjustmentDiv } from "../designsystem/GlobalStyles";



export default function PublishPageView() {

    useEffect(() => {
        console.log("inside:")
    })
    
    return (
        <div>
            <Switch>
                <Route exact path="/publish/new" component={SubmissionForm} />
                <Route path="/publish" component={PublishPage} />
            </Switch>
        </div>
    )
}

function PublishPage() {

    const history = useHistory()

    const [transferredSubmissions, setTransferredSubmissions] = useState([]) 
    const [publishedSubmissions, setPublishedSubmissions] = useState([])
    const [draftSubmissions, setDraftSubmissions] = useState([])

    const [madeRequest, setMadeRequest] = useState(false)

    function toNewSubmissionForm() {
        history.push("/publish/new")
    }

    useEffect(() => {
        console.log("inside publish homepage")
        if (!madeRequest) {
            //query transferred submissions

            //query published submissions
            getUserSubmissions()
            .then((submissions)=>{
                setPublishedSubmissions(submissions)
            })

            setMadeRequest(true)
        }
    })

    //function to navigate to the code view page to the submission selected (based on passed ID)
    function gotoCodeView(submissionID) {
        history.push("/code?id=" + submissionID)
    }

    return (
        <ContainerWrapper>
            <AddButtonContainer>
                    <RectButton1
                        buttonText={"Publish your code"}
                        onClick={toNewSubmissionForm}
                    />
            </AddButtonContainer>

            <div
                style={{
                    marginLeft: "16px"
                }}
            >
                {/* transferred in */}
                <div>
                    <T1 style={{display: "inline-block"}}>Transferred Submissions</T1>

                    <TransferMessage>
                        <S4 style={{padding: "8px 15px", color: Colors.white}}>Review incoming submissions before publishing</S4>
                    </TransferMessage>
                    
                </div>
                {transferredSubmissions.length > 0
                ?
                <div 
                    style={{
                        height: "200px",
                        width: "500px",
                        border: "1px solid black",
                        marginTop: "16px",
                        marginBottom: "16px",
                    }}
                />
                :
                <B2T
                    style={{
                        marginTop: "80px",
                        marginBottom: "80px",
                    }}
                >
                    Transfer submissions to this journal, for them to appear here for editing before release
                </B2T>
                }

                {/* drafts */}
                <T1>Drafts</T1>
                {draftSubmissions.length > 0
                ?
                <div style={{marginTop: "16px"}}>
                    <CodePreviewGrid>
                        {draftSubmissions.map((submission)=>(
                            <CodePreview 
                                onTap={() => {
                                    gotoCodeView(submission.id)
                                }}
                                title={submission.name}
                                shortDescription={submission.shortDesc}
                                isReviewed={submission.isPeerReviewed}
                                uid={submission.posterUserID}
                                viewsCount={submission.views}
                                savedCount={0}
                            />
                        ))}
                    </CodePreviewGrid>

                    <div style={{height: "100px"}} />
                </div>
                :
                <B2T
                    style={{
                        marginTop: "80px",
                        marginBottom: "80px",
                    }}
                >
                    Your drafted submissions will appear here
                </B2T>
                }

                {/* published */}
                <T1>Published Submissions</T1>
                {publishedSubmissions.length > 0
                ?
                <div style={{marginTop: "16px"}}>
                    <CodePreviewGrid>
                        {publishedSubmissions.map((submission)=>(
                            <CodePreview 
                                onTap={() => {
                                    gotoCodeView(submission.submissionID)
                                }}
                                title={submission.name}
                                shortDescription={submission.shortDesc}
                                isReviewed={submission.isPeerReviewed}
                                uid={submission.posterUserID}
                                viewsCount={submission.views}
                                savedCount={0}
                            />
                        ))}
                    </CodePreviewGrid>

                    <div style={{height: "100px"}} />
                </div>
                :
                <B2T
                    style={{
                        marginTop: "80px",
                        marginBottom: "80px",
                    }}
                >
                    Your published submissions will appear here
                </B2T>
                }
            </div>

        </ContainerWrapper>
    )
}

const ContainerWrapper = styled(WidthAdjustmentDiv)`
    position: absolute;
    /* width: 100%; */
    height: 100vh;
    transition: all .3s ease-in-out;
`

const AddButtonContainer = styled.div`
    margin-top: 100px;
    height: 100px;
    text-align: center;
`

const TransferMessage = styled.div`
    display: inline-block;
    margin-left: 16px;
    border-radius: 50px;
    background-color: ${Colors.orange};
    transform: translateY(-5px);
`
