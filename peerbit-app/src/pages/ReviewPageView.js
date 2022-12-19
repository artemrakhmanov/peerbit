import React, { useEffect, useState } from "react";
import { PageWrapper } from "./PageStyles";
import { T1, T3, S3, B3, B3T, B4, B2, B2T, B4T, S4, B5T, S2 } from "../designsystem/TypographyStyles";
import styled from "styled-components";
import { Colors } from "../designsystem/ColorStyles";

import account1 from "../assets/branding/account1.jpg"
import { Formik, Form } from "formik";
import { InputField2, TextAreaStyle } from "../designsystem/Fields";
import { Switch, Route, useParams, useLocation } from "react-router";
import { useHistory } from "react-router";
import { FormContainerViewWrapper, FormMenuComponentStyled, FormPageGrid, WidthAdjustmentDiv } from "../designsystem/GlobalStyles";
import { getUserSubmissionData, getCurrentlyUnderReview } from "../viewmodels/DBQueries";


import findCodeArt from "../assets/art/findCodeArt.png"
import learnReviewArt from "../assets/art/learnReviewArt.png"
import { off } from "process";

export default function ReviewPageView(props) {

    return (
        <div>
            <Switch>
                <Route path="/review" component={ReviewPageContent} />
            </Switch>
        </div>
    ) 
}

// const reviewProgressData = {
//     mySubmissions: [
//         {
//             submissionName: "Eulerian Video Magnification",
//             approvalsNumber: 1,
//             isLookingForReviewers: false,
//             openIssuesNumber: 3,
//             submissionID: "OldVersionForTesting"
//         },
    
//         {
//             submissionName: "Eulerian Video Magnification",
//             approvalsNumber: 0,
//             isLookingForReviewers: true,
//             openIssuesNumber: 0,
//             submissionID: "OldVersionForTesting"
//         },
    
//     ],
//     others: [
//         {
//             submissionName: "Eulerian Video Magnification",
//             approvalsNumber: 1,
//             isLookingForReviewers: false,
//             openIssuesNumber: 3,
//             submissionID: "OldVersionForTesting"
//         },
    
//         {
//             submissionName: "Eulerian Video Magnification",
//             approvalsNumber: 2,
//             isLookingForReviewers: false,
//             openIssuesNumber: 6,
//             submissionID: "OldVersionForTesting"
//         },
//         {
//             submissionName: "Eulerian Video Magnification",
//             approvalsNumber: 0,
//             isLookingForReviewers: false,
//             openIssuesNumber: 1,
//             submissionID: "OldVersionForTesting"
//         },
    
//     ]
// }

function ReviewPageContent() {

    const history = useHistory()

    const [findCodeHover, setFindCodeHover] = useState(false)
    const [learnReviewHover, setLearnReviewHover] = useState(false)

    const [publishedSubmissions, setPublishedSubmissions] = useState([])
    const [submissionsUnderReview, setSubmissionsUnderReview] = useState([])

    const [reviewProgressData, setReviewProgressData] = useState({mySubmissions: [], others:[]})

    const [sentQuery, setSentQuery] = useState(false)

    const [hasMySubmissions, setHasMySubmissions] = useState(false)
    const [hasOthers, setHasOthers] = useState(false)


    function gotoCodeView(submissionID) {
        history.push("/code?id=" + submissionID)
    }

    function reviewProgressItem(item) {
        return (
            <ProgressItemWrapper onClick={()=>{
                gotoCodeView(item.submissionID)
            }}>
                <InsidePadding padding={"10px"}>
                    <S3>{item.submissionName}</S3>
                    <S4 style={{color: Colors.gray, marginTop: "6px"}}>{item.isLookingForReviewers ? "Looking for reviewers" : item.approvalsNumber + "/2 Approvals"}</S4>
                    <ProgressBar approvalsNumber={item.approvalsNumber} isLookingForReviewers={item.isLookingForReviewers}/>
                    <S4 style={{color: Colors.gray}}>{item.approvalsNumber === 2 ? "Review Completed" : item.openIssuesNumber + " open issues"}</S4>
                </InsidePadding>
            </ProgressItemWrapper>
        )
    }

    useEffect(() => {
        if (!sentQuery) {
            console.log("getting user submission data")
            getUserSubmissionData()
                .then((publishedSubmissions) => {
                    let mySubmissions = [];
                    for (let i = 0; i < publishedSubmissions.length; i++) {
                        const submission = publishedSubmissions[i]
                        let isLookingForReviewers;
                        isLookingForReviewers = true
                        let approvals = 0;
                        switch(submission.reviewers.numberOfReviewers) {
                            case 1:
                                if(submission.reviewers["1"].approved == true) {
                                    approvals += 1;
                                }
                                break;
                            case 2:
                                if(submission.reviewers["1"].approved == true) {
                                    approvals += 1;
                                }
                                if(submission.reviewers["2"].approved == true) {
                                    approvals += 1;
                                }
                                isLookingForReviewers = false;
                                break;
                        }
                        console.log("submiss")
                        console.log(submission)
                        mySubmissions.push({
                            submissionName: submission.name,
                            approvalsNumber: approvals,
                            isLookingForReviewers: isLookingForReviewers,
                            openIssuesNumber: submission.issues.numberOfOpenIssues,
                            submissionID: submission.id,
                            reviewStage: submission.reviewStage
                        })
                    }
                    console.log("submissions")
                    console.log(mySubmissions)
                    setReviewProgressData({
                        mySubmissions: mySubmissions,
                        //CHANGE
                        others: [
                            {
                                submissionName: "Eulerian Video Magnification",
                                approvalsNumber: 1,
                                isLookingForReviewers: false,
                                openIssuesNumber: 3,
                                submissionID: "OldVersionForTesting"
                            },
                        
                            {
                                submissionName: "Eulerian Video Magnification",
                                approvalsNumber: 2,
                                isLookingForReviewers: false,
                                openIssuesNumber: 6,
                                submissionID: "OldVersionForTesting"
                            },
                            {
                                submissionName: "Eulerian Video Magnification",
                                approvalsNumber: 0,
                                isLookingForReviewers: false,
                                openIssuesNumber: 1,
                                submissionID: "OldVersionForTesting"
                            }
                        ]                    
                    })
                })
            
            // getCurrentlyUnderReview()
            // .then((submissions)=>{
            //     setSubmissionsUnderReview(submissions)
            // })
            

            // let others = [];
            // for (let i = 0; i < others.length; i++) {
            //     const submission = others[i]
            //     let isLookingForReviewers;
            //     if(submission.reviewStage == 2){
            //         isLookingForReviewers = true;
            //     }
            //     else{
            //         isLookingForReviewers = true;
            //     }
            //     others.push({
            //         submissionName: submission.name,
            //         approvalsNumber: 3 - submission.reviewStage,
            //         isLookingForReviewers: isLookingForReviewers,
            //         openIssuesNumber: submission.issues.numberOfOpenIssues,
            //         submissionID: submission.id
            //     })
            // }
            // console.log("My submissions:")
            // console.log(mySubmissions)
            // if(mySubmissions.length > 0){
            //     setHasMySubmissions(true);
            // }
            // if(others.length > 0){
            //     setHasOthers(true);
            // }
            setSentQuery(true);
        }
    })

    return (
        <FormContainerViewWrapper>
            <ReviewPageGrid showTwoColumns={true}>
                <ReviewProgressSection>
                    <InsidePadding>
                        <T1>Review Progress</T1>

                        <ReviewSection>
                            <T3 style={{color: Colors.gray}}>My code</T3>
                            {(reviewProgressData.mySubmissions.length > 0) &&
                                reviewProgressData.mySubmissions.map((item) => {
                                    return reviewProgressItem(item)
                                })
                            }
                            {(reviewProgressData.mySubmissions.length == 0) &&
                                <B4>Any submissions you post will appear here!</B4>
                            }
                        </ReviewSection>

                        <ReviewSection>
                            <T3 style={{color: Colors.gray}}>Code currently reviewing</T3>
                            {(reviewProgressData.others.length > 0) &&
                                reviewProgressData.others.map((item) => {
                                    return reviewProgressItem(item)
                                })
                            }
                            {(reviewProgressData.others.length == 0) &&
                                <B4>When you review your first submission it will appear here!</B4>
                            }
                        </ReviewSection>
                    </InsidePadding>

                </ReviewProgressSection>
                <RightSectionWrapper>
                    <ArtSectionWrapper
                        onClick={() => {
                            history.push("/SubmissionsToReview")
                        }}
                        onMouseEnter={()=>setFindCodeHover(true)}
                        onMouseLeave={()=>setFindCodeHover(false)}
                        isHoveredOver={findCodeHover}
                    >
                        <InsidePadding>
                            <T1>Find code to review</T1>
                        </InsidePadding>

                        <ArtImg src={findCodeArt} raise={findCodeHover}/>

                    </ArtSectionWrapper>

                    <ArtSectionWrapper
                        onClick={() => {
                            history.push("/LearnMore")
                        }}
                        onMouseEnter={()=>setLearnReviewHover(true)}
                        onMouseLeave={()=>setLearnReviewHover(false)}
                        isHoveredOver={learnReviewHover}
                    >
                        <InsidePadding>
                            <T1>Learn Peerbit's review process</T1>
                        </InsidePadding>

                        <ArtImg src={learnReviewArt} raise={learnReviewHover}/>

                    </ArtSectionWrapper>
                </RightSectionWrapper>

                </ReviewPageGrid> 

        </FormContainerViewWrapper>
    )
}

const ReviewPageGrid = styled.div`
    margin-top: 16px;
    padding: 0px 16px;
    display: grid;
    grid-gap: 16px 16px;
    grid-template-columns: ${props=> props.showTwoColumns ? "40% 60%" : "auto"};
    grid-auto-columns: 40% 60%;
    align-items: start;
    /* width: 100%; */
`

const ReviewProgressSection = styled.div`
    width: 100%;
    height: 800px;
    background-color: ${Colors.lightgray};
    border-radius: 14px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: left;
`

const ProgressItemWrapper = styled.div`
    width: 100%;
    border-radius: 8px;
    background-color: ${Colors.white};
    margin: 16px 0px;

    cursor: pointer;
    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;

    :hover {
        background-color: ${Colors.grayish};
    }
`

const ProgressBar = styled.div`
    width: 100%;
    height: 40px;
    border-radius: 50px;
    margin: 16px 0px;
    background-color: ${Colors.lightgray};
    background: ${props=> props.isLookingForReviewers 
    ?
    Colors.lightgray
    :
    (props.approvalsNumber === 0
    ?
    "linear-gradient(90deg, rgba(172,0,0,1) 0%, rgba(255,0,0,1) 21%, rgba(247,247,247,1) 21%)"
    :
    (props.approvalsNumber === 1
        ?
        "linear-gradient(90deg, rgba(172,0,0,1) 0%, rgba(255,207,0,1) 58%, rgba(247,247,247,1) 58%)"
        :
        Colors.green)
    )};
`

const InsidePadding = styled.div`
    padding: ${props=>props.padding ? props.padding : "16px"};
    opacity: ${props=>props.isHoveredOver ? 0.3 : 1};
`

const ReviewSection = styled.div`
    margin: 16px 0px;
`


const RightSectionWrapper = styled.div`
    width: 100%;
    height: 800px;
`

const ArtSectionWrapper = styled.div`
    position: relative;
    height: 49.5%;
    width: 100%;
    background-color: ${props=>props.isHoveredOver ? Colors.grayish : Colors.lightgray};
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 10px;

    transition: all 0.2s ease-in-out;
`
const ArtImg = styled.img`
    object-fit: contain;
    height: ${props=>props.raise ? "300px" : "298px"};
    position: absolute;
    bottom: ${props=>props.raise ? "0px" : "-20px"};
    right: 0px;

    transition: all 0.3s ease-in-out;
`