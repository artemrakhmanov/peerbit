import { Colors } from "../designsystem/ColorStyles"
import styled from "styled-components"
import { S1, S3 } from "../designsystem/TypographyStyles"
import { RectButton4, RectButton5 } from "../designsystem/Buttons"
import { getUID } from "../viewmodels/PeerReview"

const dummyReviewProps = {
    reviewers: {
        numberOfReviewers: 2,
        1: {
            userID: "djslkdjls",
            approved: false
        },
        2: {
            userID: "djsdhk",
            approved: true
        }
    },
    reviewStage: 2,
    issues: {
        numberOfOpenIssues: 3,
        issuesByReviewer: {
            1: [
                {
                    name: "issue1",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    isResolved: true,
                    changes: [
                        {
                            changesMadeMessage: "myChangesMade",
                            date: Date(),
                            isAccepted: true,
                            responseMessage: "my response message",
                            revision: 2
                        }
                    ]
                }
            ],
            2: []
        }
    }
}

export default function ReviewProgressView(props) {

    const reviewProps = props.reviewProps ? props.reviewProps : dummyReviewProps
    const joinReview = props.joinReview ? props.joinReview : function () {}

    function getNumberOfApprovals() {
        if (reviewProps.reviewStage <= 1) {
            let approvalsNumber = reviewProps.reviewers["1"].approved ? 1 : 0
            approvalsNumber = approvalsNumber + (reviewProps.reviewers["2"].approved ? 1 : 0)
            return approvalsNumber
        } else {
            return 0
        }
    }

    function showForAuthor() {
        const myUID = getUID()
        console.log("SHOW FOR AUTHOR", reviewProps.author.userID, myUID, reviewProps.author.userID === myUID)
        return reviewProps.author.userID === myUID
    }

    function getSubtitle() {
        if (reviewProps.reviewStage <= 1) {
            return getNumberOfApprovals() + "/2 Approvals"
        }

        if (reviewProps.reviewStage === 2) {
            return "Looking for editors"
        }
    }

    function isReviewing() {
        const reviewerID = reviewProps.reviewers.numberOfReviewers === 1 ? reviewProps.reviewers["1"].userID : "0"
        return getUID() === reviewerID
    }

    return (
        <ReviewStatusWrapper>
            <ElementPadding><S1>Review Progress</S1></ElementPadding>

            <S3 style={{paddingLeft: "16px", color: Colors.gray}}>{getSubtitle()}</S3>

            <ProgressCapsule approvalsNumber={getNumberOfApprovals()} isLookingForReviewers={reviewProps.reviewers.numberOfReviewers < 2} />

            <BottomLeftContainer>
                {reviewProps.reviewStage === 2
                ?
                <OpenIssuesContainer>
                    <S3 style={{marginRight: "46px"}}>{reviewProps.reviewers.numberOfReviewers + "/2 Reviewers"}</S3>

                    <div>
                        {isReviewing()
                        ?
                        <S3 style={{color: Colors.green}}>REVIEWER</S3>
                        :
                        <div>
                            {!showForAuthor()
                            ?
                            <RectButton5 buttonText="Join" onClick={()=>{joinReview()}}/>
                            :
                            <div/>
                            }
                        </div>
                        }
                    </div>
                </OpenIssuesContainer>
                :
                <OpenIssuesContainer>
                    <S3 style={{marginRight: "46px"}}>{reviewProps.issues.numberOfOpenIssues + " open issues"}</S3>

                    {getUID() === reviewProps.author.userID
                    ?
                    <RectButton5 buttonText="Resolve" />
                    :
                    <div/>}
                </OpenIssuesContainer>
                }
            </BottomLeftContainer>

        </ReviewStatusWrapper>
    )
}

const ReviewStatusWrapper = styled.div`
    height: 100%;
    position: relative;
    width: 100%;
    margin: 0px 10px;
    border-radius: 10px;
    background-color: ${Colors.lightgray};
`

export const ElementPadding = styled.div`
    padding: 16px;
`

const ProgressCapsule = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 97%;
    height: 60px;
    border-radius: 50px;
    /* margin */
    background-color: ${Colors.lightgray};
    background: ${props=> props.isLookingForReviewers 
    ?
    Colors.white
    :
    (props.approvalsNumber === 0
    ?
    "linear-gradient(90deg, rgba(172,0,0,1) 0%, rgba(255,0,0,1) 21%, rgba(255,0,0,1) 21%, rgba(220,220,220,1) 21%, rgba(220,220,220,1) 100%)"
    :
    (props.approvalsNumber === 1
        ?
        "linear-gradient(90deg, rgba(172,0,0,1) 0%, rgba(255,207,0,1) 58%, rgb(255,255,255) 58%)"
        :
        Colors.green)
    )};
`

const BottomLeftContainer = styled.div`
    position: absolute;
    left: 16px;
    bottom: 16px;
`

const OpenIssuesContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: ${Colors.white};
    border: 1px solid ${Colors.gray};
    border-radius: 16px;
    height: 30px;
`