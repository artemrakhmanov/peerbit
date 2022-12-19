import React, { useEffect, useState } from "react";
import { B2, S2, T3 } from "../designsystem/TypographyStyles";
import styled from "styled-components";
import { Colors } from "../designsystem/ColorStyles";
import { useHistory, useLocation } from "react-router";

import SegmentedControl from "./SegmentedControl";
import SubmissionDetailsView from "./CodeSubmissionDetails";
import CodeRenderer from "./CodeRenderer";
import SourceDetails from "./SourceDetails";
import CommentRenderer from "./CommentRenderer";
import AttachmentViewer from "./AttachmentViewer";

import { commentData, data } from "./dummydata";

import { addNewComment, addNewReply } from "../viewmodels/CodeView";
import { getSubmissionData } from "../viewmodels/DBQueries";
import LoadingScreen from "../components/LoadingScreen";
import { WidthAdjustmentDiv } from "../designsystem/GlobalStyles";
import ReviewProgressView, { ElementPadding } from "./ReviewProgressView";
import { ImgButton, RectButton1 } from "../designsystem/Buttons";
import { reviewSubmission } from "../viewmodels/PeerReview";
import ReviewSection from "./ReviewSection";

import xmarkGlyph from '../assets/glyphicons/xmarkGlyph.png';

import {Dropdown} from "reactjs-dropdown-component";

export function CodeView(props) {
    

    const [submission, setSubmission] = useState(null)
    const [madeRequest, setMadeRequest] = useState(false)
    const [hidden, setHidden] = useState(false);

    const codeLines = data.lines
    const [commentLines, setCommentLines] = useState([])
    
    const [selectedLine, setSelectedLine] = useState(0)

    const [segmentedMenuSelection, setSegmentedMenuSelection] = useState(0)

    const [submissionID, setSubmissionID] = useState("")

    const [selectedRevision, setSelectedRevision] = useState(0)

    const location = useLocation()
    const history = useHistory()

    function getSubmissionID() {
        const id = new URLSearchParams(location.search).get("id")
        return id
    }

    function getCommentLines(comments) {
        console.log("GET COMMENT LINES", comments)
        // comments.comments ? comments.comments.map((comment)=>comment.line) :
        return []
    }

    useEffect(() => {
        console.log(getSubmissionID() + " submission")
        if (!madeRequest) {
            const submissionID = getSubmissionID()
            if (submissionID) {
                setSubmissionID(submissionID)
                getSubmissionData(submissionID)
                .then(submissionData => {
                    console.log("received submission data", submissionData)
                    //set commentlines
                    // setCommentLines(getCommentLines(submissionData.comments))
                    //set submission
                    setSelectedRevision(submissionData.noRevisions)
                    setSubmission(submissionData)
                    if (submissionData.reviewStage === 1) {
                        setShowReview(current => !current)
                    }
                })
            } else {
                history.push("/discover")   //no submission id
            }
            
            setMadeRequest(true)
        }
    })

    function onSelectLine() {
        setSegmentedMenuSelection(1)
    }

    function goBack() {
        history.goBack()
    }

    const [showDescription, setShowDescription] = useState(false)
    const [showCodeBrowser, setShowCodeBrowser] = useState(false)
    const [showReview, setShowReview] = useState(false)
    const [showDiscussions, setShowDiscussions] = useState(false)
    const [showAttachments, setShowAttachments] = useState(false)

    function getListOfRevisions() {
        return submission.code.contents.map((revision)=> {return {
            label: "Revision " + revision.revisionNo,
            value: revision.revisionNo
        }})
    }

    return (
        <div>
            {submission
            ?
            <div>
            {submission !== 100
            ?
            <ContainerWrapper>

                <TopRowSection>
                    <SubmissionDetailsView 
                        onBack={goBack}
                        title={submission.name}
                        isReviewed={submission.isPeerReviewed}
                        shortDescription={submission.shortDesc}
                        views={submission.views}
                        authorName={submission.author.displayName}
                        authorUID={submission.author.userID}
                        authorWorkplace={submission.author.workplace}
                        authorPosition={submission.author.position}
                        authorImage={submission.author.profileURL}
                        authorUsername={submission.author.username}
                        reviewStage={submission.reviewStage}
                    />

                    {submission.reviewStage <= 2 & submission.reviewStage !== 0
                    ?
                    <ReviewProgressView 
                        reviewProps={submission} 
                        joinReview={()=>{
                            reviewSubmission(submission)
                            .then((response)=>{
                                //reload to get updated submission data values
                                window.location.reload(false);
                            })
                            .catch(error => {
                                console.log("UNSUCCESSFUL JOINING TO REVIEW")
                            })
                        }}
                    />
                    :
                    <div/>
                    }
                </TopRowSection>

                {submission.reviewStage <=2
                ?
                <SectionWrapper open={showReview} onClick={()=>{
                    if (!showReview) {setShowReview(current=>!current)}
                }}>
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <ElementPadding><T3 style={{color: showReview ? Colors.black : Colors.gray}}>Peer Review</T3></ElementPadding>

                        <div>
                            {showReview
                            ?
                            <ImgButton imgsrc={xmarkGlyph} height="15" action={()=> {
                                setShowReview(current=>!current)
                            }} />
                            :
                            <div/>}
                        </div>
                    </div>

                    {showReview
                    ?
                    <div>
                        {submission.reviewStage === 2
                        ?
                        <ElementPadding style={{width: "90%"}}>
                            <B2>This submission is currently looking for reviewers. After the review begins, you will see the review process here.</B2>
                        </ElementPadding>
                        :
                        <ReviewSection submission={submission} />
                        }
                    </div>
                    :
                    <div/>}
                </SectionWrapper>
                :
                <div/>
                }

                {submission.longDesc.length > 0
                ?
                <SectionWrapper open={showDescription} onClick={()=>{
                    setShowDescription(current=>!current)
                }}>
                    <ElementPadding><T3 style={{color: showDescription ? Colors.black : Colors.gray}}>Description</T3></ElementPadding>

                    {showDescription
                    ?
                    <ElementPadding style={{width: "90%"}}>
                        <B2>{submission.longDesc}</B2>
                    </ElementPadding>
                    :
                    <div/>}
                </SectionWrapper>
                :
                <div/>
                }

                <SectionWrapper open={showAttachments} onClick={()=>{
                    if(!showAttachments) {setShowAttachments(current=>!current)}
                }}>
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <ElementPadding><T3 style={{color: showReview ? Colors.black : Colors.gray}}>Attachments</T3></ElementPadding>

                        <div>
                            {showAttachments
                            ?
                            <ImgButton imgsrc={xmarkGlyph} height="15" action={()=> {
                                setShowAttachments(current=>!current)
                            }} />
                            :
                            <div/>}
                        </div>
                    </div>

                    {showAttachments
                    ?
                    <div>

                    <AttachmentViewer id = {submissionID} attachmentURLS={submission.attachmentURLS} attachmentStr={submission.attachmentStr} />
                    </div>
                    : 
                    <div/>}
                </SectionWrapper>
                
                <ElementPadding><T3>Code</T3></ElementPadding>

                <Dropdown
                    name="Code Revision Version"
                    title="Select revision"
                    list={getListOfRevisions()}
                    select={{value: submission.noRevisions}}
                    // ref={useRef()}
                    onChange={(item, name)=>{
                        console.log("REVISION CHANGE", item, name)
                        setSelectedRevision(item.value)
                    }}
                />

                <CodeRenderer 
                    selectedLine = {selectedLine}
                    setSelectedLine = {setSelectedLine}
                    code={submission.code}
                    revisionNo={selectedRevision}
                    codeLines = {submission.code.contents[selectedRevision].lines}
                    commentLines = {commentLines}
                    onSelectLine={onSelectLine}
                    fileName={submission.code.contents[selectedRevision].filename}
                    addNewCommentToDB={addNewComment}
                    addNewReplyToDB={addNewReply}
                    commentsData={submission.code.contents[selectedRevision].comments}
                    setCommentLines={setCommentLines}
                    submissionID={submissionID}
                    submissionData={submission}
                    // onFileDownload={}
                    // onFileCopy={}
                    // onFileRaw={}
                />

                <div style={{height: "200px"}}/>
            </ContainerWrapper>
            :
            <DummyContainerWrapper>
                <DummyCentralBlockWrapper>
                        <S2>No submission {getSubmissionID()} found.</S2>
                </DummyCentralBlockWrapper>
            </DummyContainerWrapper>
            }
            </div>
            :
                <LoadingScreen />
            }
        </div>
    )
}

const DummyContainerWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    transition: all .3s ease-in-out;
`

const DummyCentralBlockWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`

const ContainerWrapper = styled(WidthAdjustmentDiv)`
    /* width: 100%; */
    position: absolute;
    top: 50px;
    /* border: 1px dashed pink; */
`

const CodeSideWrapper = styled.div`
    /* display: inline-block; */
    /* position: absolute; */
    border: 1px solid red;
    /* left: 10px; */
    width: 100%;
    height: 600px;
`

const TopRowSection = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 16px;
    height: 290px;
    margin-bottom: 16px;
`
const SectionWrapper = styled.div`
    border-bottom: 1px solid ${Colors.gray};
    width: 100%;
    
    :hover {
        background-color: ${props=>props.open ? "transparent" : Colors.lightgray};
        cursor: pointer;
    }
`


