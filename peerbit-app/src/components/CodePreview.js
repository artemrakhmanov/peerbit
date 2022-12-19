import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Colors } from "../designsystem/ColorStyles";
import { Link, ReviewStageBadge } from "../designsystem/Buttons";
import { B4, B4T, B5T, S1, S4, B3 } from "../designsystem/TypographyStyles";

import account1 from "../assets/branding/account1.jpg"

import bookmarkIdle from "../assets/glyphicons/bookmarkIdle.png"
import bookmarkActive from "../assets/glyphicons/bookmarkActive.png"
import { getUserData } from "../viewmodels/UserDBQueries";

import noUserPicture from "../assets/branding/nouser.png"


export default function CodePreview(props) {
    const title = props.title ? props.title : "<title>"
    const shortDescription = props.shortDescription ? props.shortDescription : "<short description>"
    const isReviewed = props.isReviewed ? props.isReviewed : true
    const reviewStage = typeof props.reviewStage != 'undefined' ? props.reviewStage : 3

    const uid = props.uid

    // const authorName = props.authorName ? props.authorName : "<Author Name>"
    // const authorWorkplace = props.authorWorkplace ? props.authorWorkplace : ""
    // const authorPosition = props.authorPosition ? props.authorPosition : ""
    // const linkText = props.linkText ? props.linkText : "<link>"

    const [authorName, setAuthorName] = useState("")   
    const [authorWorkplace, setAuthorWorkplace] = useState("")   
    const [authorPosition, setAuthorPosition] = useState("")
    const [username, setUsername] = useState("")
    const [pictureURL, setPictureURL] = useState("")


    const viewsCount = props.viewsCount ? props.viewsCount : 0
    const savedCount = props.savedCount ? props.savedCount : 0
    // const [isSaved, setSsSaved] = useState(props.isSaved)
    const [isSaved, setIsSaved] = useState(false)

    const onTap = props.onTap ? props.onTap : () => {console.log("onTap code preview")}

    const [tapped, setTapped] = useState(false)

    const [sentRequest, setSentRequest] = useState(false)

    function tap() {
        setTapped(true)
        setTimeout(() => {
            setTapped(false)
            onTap()
        }, 300)
    }

    useEffect(() => {
        if (!sentRequest && uid) {

            if (props.author) {
                setAuthorName(props.author.displayName)
                setAuthorPosition(props.author.position)
                setAuthorWorkplace(props.author.workplace)
                setPictureURL(props.author.profileURL)
                setSentRequest(true)
                return
            }

            getUserData(uid)
            .then((userData)=> {

                setAuthorName(userData.displayName)
                setAuthorWorkplace(userData.workplace)
                setAuthorPosition(userData.position)
                setUsername(userData.username)
                if (userData.profileURL.length > 0) {
                    setPictureURL(userData.profileURL)
                } else {
                    setPictureURL(noUserPicture)
                }
                console.log(pictureURL)
            })
            setSentRequest(true)
        }
    })

    return (
        <div>
            <CodePreviewWrapper
            tapped={tapped}
            onClick={tap}
            >


            <TopRightBlockWrapper>

                <CentralBlockItemWrapper style={{marginTop: "3px"}}>
                    <S1>{title}</S1>
                    <ReviewStageBadge stage={reviewStage} />
                </CentralBlockItemWrapper>

                <CentralBlockItemWrapper style={{marginTop: "3px"}}>
                    <B4T>{shortDescription}</B4T>
                </CentralBlockItemWrapper>
            </TopRightBlockWrapper>

            
            <AccountBlockWrapper>
                <AccountImageWrapper>
                    <AccountImage src={pictureURL} />
                </AccountImageWrapper>

                <AccountAboutBlock>
                    <AccountFullNameWrapper
                        style={{
                            transform: 
                                authorWorkplace.length > 0 && authorPosition.length > 0
                                ?
                                null
                                :
                                "translateY(15px)"
                        }}
                    >
                        <S4>{authorName}</S4>    
                    </AccountFullNameWrapper>  

                    {authorWorkplace.length > 0 && authorPosition.length > 0
                    ?
                    <div>
                        <AccountWorkplaceWrapper>
                            <B4>{authorWorkplace}</B4>  
                        </AccountWorkplaceWrapper>

                        <AccountPositionWrapper>
                            <B5T>{authorPosition}</B5T>
                        </AccountPositionWrapper>
                    </div>
                    :
                    <div />}
                </AccountAboutBlock>    
            </AccountBlockWrapper>


        
            <SaveButtonWrapper>
                <BookmarkGlyph 
                    src={isSaved ? bookmarkActive : bookmarkIdle} 
                    onClick={() => {
                        setIsSaved(!isSaved)
                    }}
                />
            </SaveButtonWrapper>



            <StatsContainer>
                <StatsWrapper>
                    <B4>{savedCount ? savedCount : "0"}</B4>
                    <StatsDiv />
                    <B5T>Saved</B5T>
                </StatsWrapper>
                <StatsWrapper>
                    <B4>{viewsCount ? viewsCount : "0"}</B4>
                    <StatsDiv />
                    <B5T>Views</B5T>
                </StatsWrapper>
            </StatsContainer>

        </CodePreviewWrapper>
        </div>
    )
}

const CodePreviewWrapper = styled.div`
    display: block;
    position: relative;
    /* border: 1px solid ${Colors.gray}; */
    border-bottom: 1px solid ${Colors.gray};
    width: 100%;
    min-width: 500px;
    /* width */
    height: 200px;
    box-shadow: 0px 0px 0px ${Colors.shadow};

    transform: scale(${props => props.tapped ? "0.99" : "1"});
    opacity: ${props => props.tapped ? "0.5" : "1"};

    background-color: white;

    cursor: pointer;

    transition: all .3s ease-in-out;

    margin-bottom: 10px;

    :hover {
        /* box-shadow: 0px 0px 10px ${Colors.shadow} */
        filter: brightness(95%);
    }
`

const TopRightBlockWrapper = styled.div`
    position: absolute;
    left: 10px;
    margin: 0;
    /* border: 1px solid red; */
    /* left: 10px; */
    top: 10px;
`

const LinkWrapper = styled.div`
    display:  block;
    position: relative;
    height: 20px;
`

const CentralBlockItemWrapper = styled.div`
    display: block;
`

const AccountBlockWrapper = styled.div`
    display: block;
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 200px;
    height: 50px;
    /* border: 1px solid blue; */
`

const AccountImageWrapper = styled.div`
    display: inline-block;
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

const AccountAboutBlock = styled.div`
    display: inline-block;
    position: absolute;
    height: 50px;
    /* border: 1px solid black; */
    top: 0;
    margin: 0px 5px;
`

const AccountFullNameWrapper = styled.div`
    display: block;
    height: 15px;
    margin-bottom: 2px;
`

const AccountWorkplaceWrapper = styled.div`
    display: block;
    height: 15px;
    margin-bottom: 2px;
`

const AccountPositionWrapper = styled.div`
    display: block;
    height: 15px;
`


const SaveButtonWrapper = styled.div`
    display: block;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 50px;
    height: 50px;
    /* border: 1px solid purple; */
`

const BookmarkGlyph = styled.img`
    object-fit: contain;
    width: 20px;
    position: absolute;
    right: 0px;
    top: 0px;

    cursor: pointer;
`

const StatsContainer = styled.div`
    display: block;
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 75px;
    height: 30px;
    width: 100px;
    /* border: 1px solid green; */
    float: right;
`

const StatsWrapper = styled.div`
    /* display: inline-block; */
    float: right;
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    margin-left: 10px;
    /* border: 1px dashed red; */
`

const StatsDiv = styled.div`
    margin: 5px;
`

const PseudoLink = styled(B3)`
    color: ${Colors.linkblue};
`
