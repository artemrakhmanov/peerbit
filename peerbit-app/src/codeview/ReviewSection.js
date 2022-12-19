import { Colors } from "../designsystem/ColorStyles";
import styled from 'styled-components';
import { ImgButton, RectButton2, RectButton3, RectButton4, RectButton5 } from "../designsystem/Buttons";
import xmarkGlyph from '../assets/glyphicons/xmarkGlyph.png';
import { useEffect, useRef, useState } from "react";
import { approveSubmission, createIssue, getUID, pushChangesToIssueDB, respondToIssueAPI } from "../viewmodels/PeerReview";
import { B2, B3, B3T, S2, S3, S4 } from "../designsystem/TypographyStyles";

import { Formik, Form, Field } from "formik";
import { InputField1, InputField2, TextAreaStyle } from "../designsystem/Fields";
import { getProgrammingFileExtensions } from "../viewmodels/Submission";

import ReactTooltip from "react-tooltip";

export default function ReviewSection(props) {

    const [showIssueForm, setShowIssueForm] = useState(false)

    function pushChangesToIssue(codeFile, changesMadeMessage, issue) {
        console.log("PUSH CHANGES TO ISSUE", codeFile, changesMadeMessage, issue)
        if (changesMadeMessage.length === 0) {
            alert("Please add a message about changes implemented in a new version")
            return
        }

        pushChangesToIssueDB(codeFile, changesMadeMessage, issue, props.submission)
        .then((response)=>{
            console.log("check DB")
            window.location.reload(false);
        })
        .catch((error)=>{
            console.log(error)
        })
        
    }

    function respondToIssue(responseMessage, isResolved, issue, changeDate) {
        respondToIssueAPI(props.submission, responseMessage, isResolved, issue, changeDate)
        .then((response)=>{
            console.log("REPSONSE FROM RESPONSE TO CHANGE IN ISSUE", response)
            window.location.reload(false);
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    function createNewIssue(issueName, issueDescription) {
        const authorN = getAuthorNumber()
        if (issueName.length === 0) {
            alert("Add a name to the new issue")
            return
        }
        if (issueDescription.length === 0) {
            alert("add a description to the new issue")
            return
        }
        createIssue(props.submission, issueName, issueDescription, authorN)
        .then((response)=>{
            console.log(response, "CREATED NEW ISSUE")
            window.location.reload(false);
        })
        .catch((response)=>{
            console.log(response, "CREATED NEW ISSUE ERROR")
            alert("Issue could not be created, please try again")
        })
    }

    function getAuthorNumber() {
        const uid = getUID()
        if (props.submission.reviewers["1"].userID === uid) {
            return 1
        } else {
            return 2
        }
    }

    function showForReviewer() {
        const myUID = getUID()

        if (props.submission.reviewStage !== 1) {return}

        const isReviewer = props.submission.reviewers["1"].userID === myUID || 
                            props.submission.reviewers["2"].userID === myUID

        console.log("SHOWFORREVIEWER?", isReviewer, props.submission.reviewers["1"].userID, props.submission.reviewers["2"].userID, myUID)
        
        return isReviewer
    }

    function showForAuthor() {
        const myUID = getUID()
        return props.submission.author.userID === myUID
    }

    function getIssueCount(authorNumber, open) {
        const filterOpen = open ? open : false
        const authorN = authorNumber ? authorNumber : 0
        if (authorN === 0) {
            return props.submission.issues.issuesByReviewer["1"].length + props.submission.issues.issuesByReviewer["2"].length
        } else if (authorN === 1) {
            return props.submission.issues.issuesByReviewer["1"].length
        } else if (authorN === 2) {
            return props.submission.issues.issuesByReviewer["2"].length
        }
    }

    function getIssues(editorN, resolved) {
        return props.submission.issues.issuesByReviewer[editorN.toString()].filter((issue)=>issue.isResolved === resolved)
    }

    function getEditors() {
        //editor 1
        let editor1 = {
            editorN: 1,
            openIssues: 0,
            closedIssues: 0,
            isApproved: false,
            onApprove: ()=>{
                approveSubmission(1, props.submission)
                .then((response)=>{
                    window.location.reload(false);
                })
                .catch((error)=>{
                    console.log("APPROVE SUBMISSION ERROR",error)
                })
            },
            isEditorN: false
        }
        editor1.isApproved = props.submission.reviewers["1"].approved
        editor1.isEditorN = props.submission.reviewers["1"].userID === getUID()
        editor1.openIssues = getIssues(1, false).length
        editor1.closedIssues = getIssues(1, true).length

        let editor2 = {
            editorN: 2,
            openIssues: 0,
            closedIssues: 0,
            isApproved: false,
            onApprove: ()=>{
                approveSubmission(2, props.submission)
                .then((response)=>{
                    window.location.reload(false);
                })
                .catch((error)=>{
                    console.log("APPROVE SUBMISSION ERROR",error)
                })
            },
            isEditorN: false
        }
        editor2.isApproved = props.submission.reviewers["2"].approved
        editor2.isEditorN = props.submission.reviewers["2"].userID === getUID()
        editor2.openIssues = props.submission.issues.issuesByReviewer["2"].filter((issue)=>!issue.isResolved).length
        editor2.closedIssues = props.submission.issues.issuesByReviewer["2"].filter((issue)=>issue.isResolved).length

        const result = [editor1, editor2]
        console.log("EDITOR ROW DATA", result)
        return result
    }

    return (
        <div>
            <div>
                {showForReviewer()
                ?
                <div>
                    {!showIssueForm
                    ?
                    <div>
                        <RectButton3 buttonText="Add new issue" onClick={()=>{
                            setShowIssueForm(current => !current)
                        }}/>
                        <div style={{height: "16px"}}/>
                    </div>
                    :
                    <IssueForm setShowForm={setShowIssueForm} onCreateNewIssue={createNewIssue} />
                    }
                </div>
                :
                <div/>
                }
            </div>

            <div>
                {getIssueCount() > 0
                ?
                <div>
                    <S2 style={{marginBottom: "16px", marginLeft: "16px"}}>Open issues</S2>

                    {getIssues(1,false).map((issue)=>{
                        return <IssueItem issue={issue} 
                            showForAuthor={()=>{
                                return showForAuthor()
                            }}
                            showForReviewer={()=>{
                                return showForReviewer()
                            }}
                            onRespondToIssue={respondToIssue}
                            onChangesPush={pushChangesToIssue}
                            />
                    })}

                    {getIssues(2,false).map((issue)=>{
                        return <IssueItem
                        key={issue.name} 
                        issue={issue} 
                        showForAuthor={()=>{
                            return showForAuthor()
                        }}
                        showForReviewer={()=>{
                            return showForReviewer()
                        }} 
                        onRespondToIssue={respondToIssue}
                        onChangesPush={pushChangesToIssue}
                        />
                    })}

                    <S2 style={{marginBottom: "16px", marginLeft: "16px"}}>Closed issues</S2>
                                    
                    {getIssues(1,true).map((issue)=>{
                        return <IssueItem issue={issue} 
                            showForAuthor={()=>{
                                return showForAuthor()
                            }}
                            showForReviewer={()=>{
                                return showForReviewer()
                            }}
                            onRespondToIssue={respondToIssue}
                            onChangesPush={pushChangesToIssue}
                            />
                    })}
                    
                    {getIssues(2,true).map((issue)=>{
                        return <IssueItem
                        key={issue.name} 
                        issue={issue} 
                        showForAuthor={()=>{
                            return showForAuthor()
                        }}
                        showForReviewer={()=>{
                            return showForReviewer()
                        }} 
                        onRespondToIssue={respondToIssue}
                        onChangesPush={pushChangesToIssue}
                        />
                    })}
                </div>
                :
                <div>
                    <B2>No issues have been created so far in this peer review.</B2>
                    <div style={{height:"16px"}}/>
                </div>
                }
            </div>

            {props.submission.reviewStage <= 1
            ?
            <div>
                <S2 style={{marginBottom: "16px", marginLeft: "16px"}}>Editors</S2>

                {getEditors().map((editorProps)=>{
                    return <EditorRow {...editorProps} />
                })}
            </div>
            :
            <div/>}


        </div>
    )
}

function EditorRow(props) {

    const editorN = props.editorN
    const openIssues = props.openIssues
    const closedIssues = props.closedIssues
    const isApproved = props.isApproved
    const onApprove = props.onApprove
    const isEditorN = props.isEditorN

    return (
        <EditorRowWrapper>

            <RowElementPadding style={{paddingLeft: "0px"}}><S3>Editor {editorN}</S3></RowElementPadding>

            <RowElementPadding><B3>{openIssues} open issues</B3></RowElementPadding>

            <RowElementPadding><B3>{closedIssues} closed issues</B3></RowElementPadding>

            <RowElementPadding><B3>Status: <span style={{color: isApproved ? Colors.green : Colors.orange}}>{isApproved ? "Approved Submission" : "Under Review"}</span></B3></RowElementPadding>

            <RowElementPadding>
                {isEditorN & !isApproved
                ?
                <RectButton5 buttonText="Approve" onClick={()=>onApprove()}/>
                :
                <div/>
                }
            </RowElementPadding>

        </EditorRowWrapper>
    )
}

function IssueItem(props) {

    function getDateString(fb_date) {
        const date = new Date(fb_date.date.seconds * 1000 + fb_date.date.nanoseconds / 1000000)
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        return day + "/" + month + "/" + year
    }

    const [codeFile, setCodeFile] = useState(undefined)
    const codeFileRef = useRef()

    // const [isAccepted, setIsAccepted] = useState(false)
    
    return (
        <IssueWrapper>
            <ElementPadding><S3>{props.issue.name}</S3></ElementPadding>
            <ElementPadding><B3>{props.issue.description}</B3></ElementPadding>

            <ElementPadding><S4>Changes</S4></ElementPadding>
            {
                props.issue.changes.map((issue)=>{
                    return <ChangesRowWrapper key={issue.name}>
                        <B3T>{getDateString(issue)}</B3T>

                        <B3T>Revision {issue.revision}</B3T>

                        <p data-html={true} data-tip={issue.changesMadeMessage}>
                            <B3T style={{textDecoration: "underline"}}>Changes Made</B3T>
                        </p>

                        <ReactTooltip />

                        {issue.isResponded
                        ?
                        <p data-html={true} data-tip={issue.responseMessage}>
                                <B3T style={{textDecoration: "underline"}}>Response</B3T>
                        </p>
                        :
                        <div/>
                        }

                        <div>
                            {issue.isResponded
                            ?
                            <div>
                                <B3T style={{
                                    color: issue.isResolved ? Colors.green : Colors.red
                                }}>{issue.isResolved ? "Accepted" : "Declined"}{issue.isResolved}</B3T>
                            </div>
                            :
                            <div>
                                {props.showForReviewer()
                                ?
                                <Formik
                                    initialValues={{
                                        responseMessage:"",
                                        isAccepted: false
                                    }}

                                    onSubmit={values=>{
                                        props.onRespondToIssue(values.responseMessage, values.isAccepted, props.issue, issue.date)
                                    }}
                                    validator={()=>({})}
                                >
                                    {(formProps)=>(
                                        <Form noValidate>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>

                                            <InputField1 
                                                type="text" 
                                                name="responseMessage" 
                                                value={formProps.values.responseMessage} 
                                                placeholder="Response message" 
                                                isValid={true}
                                                style={{width: "200px"}}
                                            />

                                            <RectButton5 buttonText="Accept" onClick={()=>{
                                                formProps.setFieldValue("isAccepted", true)
                                                // setIsAccepted(current=>!current)
                                                formProps.handleSubmit()
                                            }}/>

                                            <RectButton5 buttonText="Decline" onClick={()=>{
                                                formProps.setFieldValue("isAccepted", false)
                                                formProps.handleSubmit()
                                            }}/>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                                :
                                <B3T style={{color: Colors.orange}}>Awaiting response from reviewer</B3T>
                                }
                            </div>
                            }
                        </div>

                    </ChangesRowWrapper>
                })
            }
            {props.showForAuthor() & !props.issue.isResolved
            ?
            <Formik
                initialValues={{
                    changesMadeMessage: ""
                }}
                onSubmit={(values)=>{
                    props.onChangesPush(codeFile, values.changesMadeMessage, props.issue)
                }}
            >
                {(formProps)=>(
                    <Form noValidate>

                        <ChangesRowWrapper>

                            {codeFile 
                            ?
                            <B3>{codeFile.name}</B3>
                            :
                            <RectButton3 buttonText="Attach new version to resolve" onClick={()=>{
                                codeFileRef.current.click()
                            }}/>
                            }

                            <input id="upload" 
                                ref={codeFileRef} 
                                type="file" 
                                accept={getProgrammingFileExtensions()}
                                onChange={(event)=> { 
                                    setCodeFile(event.target.files[0])
                                }}
                                onClick={(event)=> { 
                                    event.target.value = null
                                }}
                                style={{display: "none"}}
                            />

                            <InputField1 
                                type="text" 
                                name="changesMadeMessage" 
                                value={formProps.values.changesMadeMessage} 
                                placeholder="Changes made message" 
                                isValid={true}
                                style={{width: "225px"}}
                            />

                            <RectButton2 buttonText="Submit" onClick={()=>{
                                formProps.handleSubmit()
                            }}/>

                        </ChangesRowWrapper>
                    </Form>
                )}
            </Formik>
            :
            <div>
                
            </div>
            }

            <div style={{height: "16px"}}/>
        </IssueWrapper>
    )
}

function IssueForm(props) {

    const setShowForm = props.setShowForm

    return (
        <IssueWrapper>
            <Formik
                initialValues={{
                    issueName: "",
                    description: ""
                }}
                onSubmit={values=>{
                    props.onCreateNewIssue(values.issueName, values.description)
                }}
                validator={()=>{}}
                >
                {(formProps)=> (
                    <Form noValidate>
                        <div>
                            <InputField1
                                type="text"
                                name="issueName"
                                value={formProps.values.issueName}
                                placeholder="Issue name"
                                isValid={true}
                                onChange={(e)=>{formProps.setFieldValue("issueName", e.target.value)}}
                                style={{width: "40%", margin: "16px 16px"}}
                            />
    
                            <InputField2
                                type="text" 
                                as={TextAreaStyle}
                                rows="4"
                                name="shortDescription" 
                                value={formProps.values.description} 
                                placeholder="Issue description" 
                                isValid={true}
                                onChange={(e) => {
                                    formProps.setFieldValue("description", e.target.value)
                                }}
                                style={{width: "70%", height: "100px", margin: "16px 16px"}}
                            />

                            <RectButton2 buttonText="Create Issue" onClick={()=>{
                                formProps.handleSubmit()
                            }} />

                            <div style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px"
                            }}>
                                <ImgButton imgsrc={xmarkGlyph} action={()=>{
                                    setShowForm(current => !current)
                                }} />
                            </div>

                            <div style={{height: "16px"}}/>
                        </div>
                    </Form>
                )}
            </Formik>
        </IssueWrapper>
    )
}

const IssueWrapper = styled.div`
    position: relative;
    display: block;
    width: 100%;
    background-color: ${Colors.lightgray};
    border: 1px solid ${Colors.grayish};
    border-radius: 8px;
    margin-bottom: 16px;
`

const ElementPadding = styled.div`
    padding: 16px;
`
const ChangesRowWrapper = styled.div`
    padding: 5px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
        margin-right: 15px;
    }
`

const EditorRowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-items: left;
    align-items: center;
    margin-left: 16px;
    margin-bottom: 10px;
    margin-top: 10px;
`

const RowElementPadding = styled.div`
    padding: 0px 10px;
`
