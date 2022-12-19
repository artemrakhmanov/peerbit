import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { T1, T3, S3, B3, B3T, B4, B2, B4T, S4, B5T, S2 } from "../designsystem/TypographyStyles";
import { Colors } from "../designsystem/ColorStyles";
import Tab from "../components/Tab";
import account1 from "../assets/branding/account1.jpg"

import bookmarkIdle from "../assets/glyphicons/bookmarkIdle.png"
import bookmarkActive from "../assets/glyphicons/bookmarkActive.png"
import {
    RectButton4,
    RectButton5,
    Link,
    ReviewStageBadge
} from "../designsystem/Buttons";
import { storage } from "../viewmodels/Firebase";
import { useSelector } from "react-redux";

import noUserPicture from "../assets/branding/nouser.png"

export default function SubmissionDetailsView(props) {
    console.log("IN SUBMISSIONDETAILSVIEW WITH SUBMISSION " + props.title)

    const onBack = props.onBack
    const title = props.title
    const reviewStatus = props.reviewStatus
    const shortDescription = props.shortDescription
    const viewedCount = 0
    const saved = 0
    const authorName = props.authorName
    const authorUID = props.authorUID
    const ownSubmission = false
    const authorWorkplace = props.authorWorkplace
    const authorPosition = props.authorPosition
    const pictureURL = props.authorImage
    const reviewStage = props.reviewStage
    // const authorImage = props.authorImage.length > 0 ? props.authorImage : noUserPicture
    const authorUsername = props.authorUsername


    // const [isSaved, setSsSaved] = useState(props.isSaved)
    const [isSaved, setIsSaved] = useState(false)

    useEffect(()=>{
        console.log(authorName)
        console.log(authorWorkplace)
        console.log(authorUID)
    })

    const ReviewStatus = () => {
        let color = 'red'
        let str_status = 'Not Reviewed'
        switch(reviewStatus){
            case (0):
                str_status = 'Reviewed'
                color = "lime"
                break;
            case(1):
                str_status = 'Under Review'
                color = "Gold"
                break;
            case(2):
                str_status = 'Reviewer\'s Needed'
            

        }

        return (
            <ReviewWrapper >
                {/* <TrafficLight style={{"float":"left"},{"backgroundColor":color}}/>
                <B4 style = {{"float": "right"}}>{str_status}</B4> */}
            </ReviewWrapper>
        )
    
    }

    return (
        <SubmissionDetailsWrapper>

                    <NavigationWrapper>
                        <RectButton5 
                            buttonText={"Back"}
                            onClick={() => {
                                onBack()
                            }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginLeft: "0px"
                            }}
                        />

                        <Link
                            linkText={authorUsername}
                            // onClick={}
                            style={{
                                marginLeft: "10px",
                                display: "inline-flex",
                                alignItems: "center",
                                width: "100px"
                            }}
                        />
                    </NavigationWrapper>

                    <TitleWrapper
                        style={{marginTop: "15px"}}
                    >
                        <T1>
                            {title}
                        </T1>
                        
                        <ReviewStageBadge stage={reviewStage} />
                    </TitleWrapper>

                    <DescriptionWrapper>
                        <br/>
                        <br/>
                        <br/>
                        <B2>
                            {shortDescription}
                        </B2>
                    </DescriptionWrapper>
                    <br/>
                    <br/>
                    <br/>

                    <AuthorDetailsWrapper
                        style={{marginTop: "15px"}}
                    >
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <AccountImageWrapper>
                                <AccountImage src={pictureURL} />
                            </AccountImageWrapper>

                            <AccountAboutWrapper>

                                <div 
                                    style={{
                                        display: "block",
                                        marginBottom: "5px",
                                        transform: authorWorkplace.length === 0 
                                                    || authorPosition.length === 0 ?
                                                    "translateY(-20px)" : null
                                    }}
                                >
                                    <S4>{authorName}</S4>
                                </div>
                                
                                {authorWorkplace.length !== 0 
                                && authorPosition.length !== 0 
                                ?
                                <div>
                                    <div 
                                        style={{
                                            display: "block",
                                            marginBottom: "5px"
                                        }}
                                    >
                                        <B4>{authorWorkplace}</B4>
                                    </div>
                                    
                                    <div 
                                        style={{
                                            display: "block"
                                        }}
                                    >
                                        <B5T>{authorPosition}</B5T>
                                    </div>
                                </div>
                            :
                                <div />
                                }

                            </AccountAboutWrapper>
                        </div>

                        <AccountLeadingBlockWrapper>

                            <StatsWrapper>
                                    <B4>{saved}</B4>
                                    <StatsDiv></StatsDiv>
                                    <B5T>Saved</B5T>
                                </StatsWrapper>
                                <StatsWrapper>
                                    <B4>{viewedCount}</B4>
                                    <StatsDiv></StatsDiv>
                                    <B5T>Views</B5T>
                            </StatsWrapper>

                            <SaveButtonWrapper>
                                    <BookmarkGlyph 
                                        src={isSaved ? bookmarkActive : bookmarkIdle} 
                                        onClick={() => {
                                            setIsSaved(!isSaved)
                                        }}
                                    />
                            </SaveButtonWrapper>

                            
                        </AccountLeadingBlockWrapper>

                    </AuthorDetailsWrapper>

                    {/* <Tab title={"Description"}> */}

                    {/* </Tab>  */}


                </SubmissionDetailsWrapper>
    )
}

const SubmissionDetailsWrapper = styled.div`
    display: block;
    position: relative;
    width: 50%;
    
    min-width: 500px;
    /* padding-left:10px; */
`
const NavigationWrapper = styled.div`
    /* display: flex;
    flex-direction: row;
    justify-content: left; */
    position: relative;
    height: 30px;
    width: 100%;
    /* border: 1px solid gray; */
`

const ReviewWrapper = styled.div`
    width: 8%;
    display: flex;
    justify-content: space-between;
    margin: 20px 0px 20px 0px;
`
const TitleWrapper = styled.div`
    height: 60px;
    width: 100%;
    /* border: 1px solid black; */
`

const DescriptionWrapper = styled.div`
    height: 60px;
    width: 80%;
    /* border: 1px solid black; */
`

const AuthorDetailsWrapper = styled.div`
    height: 50px;
    /* width: 50%; */
    display: flex;
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
`

const AccountImageWrapper = styled.div`
    /* display: flex;
    flex-direction: row; */
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid ${Colors.gray};
    background-color: ${Colors.lightgray};
`

const AccountImage = styled.img`
    position: absolute;
    object-fit: contain;
    width: 50px;
    height: 50px;
    border-radius: 50%;
`

const AccountAboutWrapper = styled.div`
    position: relative;
    display: inline-block;
    height: 50px;
    margin-left: 5px;
    /* border: 1px solid red; */
`

const AccountLeadingBlockWrapper = styled.div`
    // position: absolute;
    display: flex;
    flex-direction: row;
    /* float: right; */
    height: 50px;
    // border: 1px solid orange;
`

const StatsWrapper = styled.div`
    /* display: inline-block; */
    /* position: relative; */
    width: 30px;
    height: 50px;
    text-align: center;
    margin-right: 10px;
    // border: 1px dashed red;
`

const StatsDiv = styled.div`
    margin: 5px;
`
const TrafficLight = styled.div`
    border-radius: 50%;
    width:15px;
    height:15px;
`


const SaveButtonWrapper = styled.div`
    /* display: inline-block; */
    /* position: absolute;   */
    /* float:right; */
    /* right: 56%; */
    // width: 30%;
    height: 50px;
    // border: 1px solid purple;
`


const BookmarkGlyph = styled.img`
    object-fit: contain;
    width: 20px;
    /* position: absolute; */
    /* right: 0px; */
    top: 0px;

    cursor: pointer;
`