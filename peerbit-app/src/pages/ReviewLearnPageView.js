import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { PageWrapper, TemplatePageTypeIndicator } from "./PageStyles";
import { B3T, B4T, T1, T2, B2T, S3 } from "../designsystem/TypographyStyles";

import Switch from "react-ios-switch"
import { Colors } from "../designsystem/ColorStyles";

import searchIcon from "../assets/glyphicons/search.png";
import SearchField from "../components/SearchField";
import { useHistory } from "react-router";
import { redirectFromInitialURL, reset } from "../reducers/redirectReducer";
import store from "../reducers/store";
import CodePreview from "../components/CodePreview";
import { WidthAdjustmentDiv } from "../designsystem/GlobalStyles";
import learnReviewArt from "../assets/art/learnReviewArt.png"
import {
    RectButton4,
    RectButton5,
    Link
} from "../designsystem/Buttons";



//change
export default function ReviewLearnPageView() {
    const history = useHistory()

    return (
        <ContainerWrapper>
            <TitleWrapper>
                <T1>Learn about peerbit review</T1>
                <br></br><br></br>
            </TitleWrapper>
            <TextWrapper>
                <S3>
                    The purpose for Peerbit is to offer a centralised service that hosts, exhibits academic source code whilst also aiding the review process of academic source code. The review process has been a major topic of discourse in the group as we determine what is the best way for Peerbit to follow a peer review procedure. 
                </S3>
                <br></br>
                <S3>
                    Once a submission is uploaded, a code submission must be reviewed by two distinct peerbit accounts. Each reviewer has the ability to add issues they find with the code submission. Each submission holds a review status: not reviewed, needs reviewers, under review, and reviewed. This provides the user with a simple flow of the review process, which is made clear with the app’s UI.
                </S3>
                <br></br>
                <S3>
                    Code submission’s also have a general view page, with a description section - to present an extensive description of the source code, a code browser - to view the source code, a discussion section - that hosts comments under the code, an attachments section - which offers some other attaching documents to the source code such as readmes, pdfs, and images.
                </S3>
                {/* <S3>Academic journals have long been the standard for publishing peer-reviewed research publications. They provide a hub for academics to share and refine their work with their peers and possibly form partnerships to collaborate on future projects. We set out to engineer a similar platform expressly for coding. Users are able to publish their code and receive feedback from others through a multistage peer-reviewing process or provide feedback of their own to other code submissions via an easily searchable discovery page. Our platform, Peerbit, does not exist in isolation, however, it exists as part of a federation of servers able to communicate by sharing users and having the ability to import or export code submissions. We were successful in implementing all of these features and even extended some of them beyond what was required of us, such as the ability to edit user details, code versioning, and optimization of our user interface and backend structure.</S3> */}
                <br></br>
                <S3></S3>
            </TextWrapper>
            <RightSectionWrapper>
                <ArtSectionWrapper>
                        {/* <InsidePadding>
                            <T1>Learn Peerbit's review process</T1>
                        </InsidePadding> */}
                        <ArtImg src={learnReviewArt}/>
                </ArtSectionWrapper>
            </RightSectionWrapper>
            <ButtonWrapper>
                <RectButton5 
                            buttonText={"Back"}
                            onClick={() => {
                                history.goBack()
                            }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginLeft: "0px"
                            }}
                />   
            </ButtonWrapper>         
        </ContainerWrapper>
    )   
}

const ButtonWrapper = styled.div`
`

const ContainerWrapper = styled(WidthAdjustmentDiv)`
    position: absolute;
    /* width: 100%; */
    height: 100vh;
    transition: all .3s ease-in-out;
`

const TitleWrapper = styled.div`
    position: absolute;
    top: 15%;
    transform: translate(0, -50%);
    width: 400px;
    text-align: left;
    margin-left: 16px;
`

const TextWrapper = styled.div`
    position: absolute;
    top: 40%;
    transform: translate(0, -50%);
    width: 55%;
    text-align: left;
    margin-left: 16px
`

const ArtSectionWrapper = styled.div`
    top: 10%  ;  
    z-index: -1;
    position: relative;
    height: 75%;
    width: 100%;
    background-color: ${props=>props.isHoveredOver ? Colors.grayish : Colors.lightgray};
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 10px;

    transition: all 0.2s ease-in-out;
`

const ArtImg = styled.img`
z-index: -1;

    object-fit: contain;
    height: ${props=>props.raise ? "300px" : "298px"};
    position: absolute;
    bottom: ${props=>props.raise ? "0px" : "-20px"};
    right: 0px;

    transition: all 0.3s ease-in-out;
`

const RightSectionWrapper = styled.div`
    width: 100%;
    height: 75%
    
`