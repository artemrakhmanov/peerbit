import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { T2, S2, B2, B3, B2T } from "../designsystem/TypographyStyles";
import { RectButton4, TextButton1 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import {getUserToken, logOut} from "../viewmodels/Auth.js"

import account1 from "../assets/branding/account1.jpg"

import LoadingScreen from "../components/LoadingScreen";
import { getUserData } from "../viewmodels/UserDBQueries";
import { useSelector } from "react-redux";
import { getUserSubmissions } from "../viewmodels/DBQueries";
import CodePreview from "../components/CodePreview";
import CodePreviewGrid from "../components/CodePreviewGrid";

import noUserPicture from "../assets/branding/nouser.png"
import { WidthAdjustmentDiv } from "../designsystem/GlobalStyles";

export default function AccountPageView() {

    const history = useHistory();

    const [madeRequest, setMadeRequest] = useState(false)

    const [userData, setUserData] = useState(null)

    const [userSubmissions, setUserSubmissions] = useState([])

    const uid = useSelector(state => state.login.value.uid)

    function handleSettings() {
        history.push("account/settings");
    }

    useEffect(()=>{
        if(!madeRequest) {
            //user data
            getUserData()
            .then((data)=> {
                setUserData(data)
            })
            //user's submissions
            getUserSubmissions()
            .then((submissions)=>{
                setUserSubmissions(submissions)
            })
            setMadeRequest(true)
        }
    })

    //function to navigate to the code view page to the submission selected (based on passed ID)
    function gotoCodeView(submissionID) {
        history.push("/code?id=" + submissionID)
    }

    return (
        <div>
            {userData
            ?
            <div>
                <AccountViewWrapper>
                    <ProfilePicture 
                        src={userData.profileURL.length > 0 
                            ? userData.profileURL
                            : noUserPicture
                            } 
                        alt="profile"></ProfilePicture>
                    <DetailsWrapper>
                        <T2 style={{marginBottom: "10px"}}>{userData.displayName}</T2>
                        {/* <DetailsDiv></DetailsDiv> */}
                        <S2 style={{marginBottom: "10px"}}>{userData.workplace}</S2>
                        {/* <DetailsDiv></DetailsDiv> */}
                        <B2 style={{marginBottom: "10px"}}>{userData.position}</B2>
                        <LargeDiv></LargeDiv>
                        <LowerDetailsBlock>
                            <StatsWrapper style={{marginLeft: "-10px"}}>
                                <B3>0</B3>
                                <StatsDiv></StatsDiv>
                                <B3>Uploads</B3>
                            </StatsWrapper>
                            <StatsWrapper>
                                <B3>0</B3>
                                <StatsDiv></StatsDiv>
                                <B3>Reviews</B3>
                            </StatsWrapper>
                            <StatsWrapper>
                                <B3>0</B3>
                                <StatsDiv></StatsDiv>
                                <B3>Comments</B3>
                            </StatsWrapper>
                        </LowerDetailsBlock>
                    </DetailsWrapper>
                    <ButtonsWrapper>
                        <RectButton4 buttonText="Settings" onClick={handleSettings}></RectButton4>
                        <ButtonsDiv></ButtonsDiv>
                        <RectButton4 buttonText="Log out" onClick={logOut}></RectButton4>
                        {/* <ButtonsDiv></ButtonsDiv>
                        <RectButton4 buttonText="Get Token" onClick={()=> {
                            getUserToken()
                            .then((token)=> {
                                console.log("token", token)
                            })
                            .catch((error)=> {
                                console.log("token error", error)
                            })
                        }}></RectButton4> */}
                    </ButtonsWrapper>

                    <SubmissionsSectionWrapper>

                        <T2>My submissions</T2>

                        {userSubmissions.length !== 0
                        ?
                        <div style={{marginTop: "16px"}}>
                            <CodePreviewGrid>
                                {userSubmissions.map((submission)=>(
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
                        <div style={{
                            marginTop: "50px"
                        }}
                        >
                            <B2T>Your submissions will appear here.</B2T>
                        </div>
                        }

                    </SubmissionsSectionWrapper>

                </AccountViewWrapper>

                {/* <SubmissionPagesWrapper>

                    <T2>My submissions</T2>

                    {userSubmissions.length !== 0
                    ?
                    <div style={{marginTop: "16px"}}>
                        <CodePreviewGrid>
                            {userSubmissions.map((submission)=>(
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
                    <div style={{
                        marginTop: "50px"
                    }}
                    >
                        <B2T>Your submissions will appear here.</B2T>
                    </div>
                    }

                </SubmissionPagesWrapper> */}
            </div>
            :
            <LoadingScreen />
            }
        </div>
    ) 
}

const AccountViewWrapper = styled(WidthAdjustmentDiv)`
    display: inline;
    position: absolute;
    top: 60px;
    width: 100%;
    height: 95vh;
    /* overflow: hidden; */
    overflow-y: scroll;

    /* left: 50%;
    transform: translateX(-50%); */
`

const ProfilePicture = styled.img`
    display: inline-block;
    object-fit: contain;
    border-radius: 50%;
    height: 250px;
    width: 250px;
    background-color: ${Colors.lightgray};
    box-shadow: 0px 5px 10px ${Colors.gray};
    margin-left: 10px;
    margin-top: 10px;
`

const ButtonsWrapper = styled.div`
    position: absolute;
    display: inline-block;
    right: 10px;
    top: 8vh;
`

const DetailsWrapper = styled.div`
    position: absolute;
    display: inline-block;
    /* transform: translate(85%, -57.5%); */
    width: 300px;
    height: 250px;
    margin-left: 30px;
    margin-top: 10px;
`

const DetailWrapper = styled.div`
    position: relative;
    display: block;
    margin: 0;
`

const ButtonsDiv = styled.div`
    margin: 10px;
`

const DetailsDiv = styled.div`
    margin: 22.5px;
`

const LargeDiv = styled.div`
    /* margin: 100px; */
`

const LowerDetailsBlock = styled.div`
    display: block;
    position: absolute;
    bottom: 0px;
    width: 270px;
`

const StatsWrapper = styled.div`
    display: inline-block;
    position: relative;
    width: 75px;
    text-align: center;
    margin-right: 10px;
`

const StatsDiv = styled.div`
    margin: 10px;
`

const TextButtonWrapper = styled.div`
    position: absolute;
    display: block;
    transform: translate(0%, 600%);
`

const TextButtonLayout = styled.div`
    display: inline-block;
    width: 250px;
`

const SubmissionsSectionWrapper = styled.div`
    margin-top: 50px;
    width: 100%;
`

const SubmissionPagesWrapper = styled(WidthAdjustmentDiv)`
    position: absolute;
    display: block;
    top: 350px;
    left: 10px;
`

const SubmissionPageButtonWrapper = styled.div`
    position: relative;
    display: inline-block;
    width: 150px;
    text-align: center;
`


