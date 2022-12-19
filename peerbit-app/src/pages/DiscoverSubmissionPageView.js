import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { PageWrapper, TemplatePageTypeIndicator } from "./PageStyles";
import { B3T, B4T, T1, T2, B2T } from "../designsystem/TypographyStyles";

import Switch from "react-ios-switch"
import { Colors } from "../designsystem/ColorStyles";

import searchIcon from "../assets/glyphicons/search.png";
import SearchField from "../components/SearchField";
import { useHistory } from "react-router";
import { redirectFromInitialURL, reset } from "../reducers/redirectReducer";
import store from "../reducers/store";
import CodePreview from "../components/CodePreview";
import { getAllSubmissions, getSubmissionsForFindReview } from "../viewmodels/DBQueries";
import { getUserData } from "../viewmodels/UserDBQueries";
import LoadingScreen from "../components/LoadingScreen";

import CodePreviewGrid from "../components/CodePreviewGrid";
import { WidthAdjustmentDiv } from "../designsystem/GlobalStyles";




export default function DiscoverSubmissionPageView() {

    const history = useHistory()

    const [submissions, setSubmissions] = useState(null)
    const [numberOfColumns, setNumberOfColumns] = useState(1)
    const [sentQuery, setSentQuery] = useState(false)

    const [showOnlyReviewed, setOnlyReviewed] = useState(true)

    const updateNumberOfColumns = () => {
        let width = window.innerWidth;
        if (width > 1000) {
            setNumberOfColumns(2)
        }
        else {
            setNumberOfColumns(1)
        }
    }

    window.addEventListener("resize", function(){
        updateNumberOfColumns()
    })

    //updates the number of columns on component lifecycle events
    useEffect(() => {
        if (!sentQuery) {
            console.log("discover page queries for submissions")
            getSubmissionsForFindReview()
            .then(data=>{
                setSubmissions(data)
                console.log(data)
            })
            setSentQuery(true)
        }
        updateNumberOfColumns()
    })

    //function to navigate to the code view page to the submission selected (based on passed ID)
    function gotoCodeView(submissionID) {
        history.push("/code?id=" + submissionID)
    }

    return (
        <ContainerWrapper>

            {submissions
            ?
            <div>
                {submissions.length !== 0
                ?
                <div>
                    <div style={{marginTop: "120px"}}>
                        <CodePreviewGrid>
                            {submissions.map((submission) => (
                                <CodePreview 
                                    onTap={() => {
                                        console.log(submission.submissionID);
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
                    </div>
                            
                    {/* bottom spacing */}
                    <div style={{height: "100px"}}/>
                            
                    <SearchBar 
                        showOnlyReviewed={showOnlyReviewed}
                        setOnlyReviewed={setOnlyReviewed}
                    />
                </div>
                :
                <DummyCentralBlockWrapper>
                    <T1>There are no submissions on the platform yet!</T1>
                    <div style={{height: "16px"}}/>
                    <B2T>Be the first to submit your code</B2T>
                </DummyCentralBlockWrapper>
                }
            </div>
            :
            <LoadingScreen />
            }

        </ContainerWrapper>

    ) 
}

function SearchBar(props) {

    const showOnlyReviewed = props.showOnlyReviewed
    const setOnlyReviewed = props.setOnlyReviewed

    return (
        <SearchBarWrapper>

                <SearchBarLeadingWrapper>
                    <T2>Submissions to review</T2>
                </SearchBarLeadingWrapper>
            </SearchBarWrapper>
    )
}


const ContainerWrapper = styled(WidthAdjustmentDiv)`
    position: absolute;
    /* width: 100%; */
    height: 100vh;
`

const CentralBlockItem = styled.div`
    /* margin: 5px auto; */
`

const CentralBlockWrapper = styled.div`
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
`

const SearchBarWrapper = styled.div`
    display: inline;
    position: fixed;
    top: 50px;
    height: 50px;
    width: 100%;
    text-align: center;
    background-image: linear-gradient(180deg, ${Colors.white} 25%, rgba(255, 255, 255, 0));
`


const SearchBarLeadingWrapper = styled.div`
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 500px;
    text-align: left;
    margin-left: 16px;
`

const SearchBarTrailingWrapper = styled.div`
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);

    width: 225px;

    display: flex;
    flex-direction: row;
    justify-content: center;
`

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
    /* width: 100%; */
    /* height: 100vh; */
`
