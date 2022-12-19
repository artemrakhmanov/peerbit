import React, { useRef, useState} from "react";
import {Link} from "react-router-dom"
import styled from "styled-components";
import { ImgButton, RectButton4, RectButton5 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { B5T, S1 } from "../designsystem/TypographyStyles";
import { RowStyle } from "../components/SubmissionForm";
import handleDownload from "../components/FileDownload";
import commentsGlyph from '../assets/glyphicons/commentsGlyph.png';
import downloadSolid from '../assets/glyphicons/download-solid.svg';
import filesGlyph from '../assets/glyphicons/filesGlyph.png';
import xmarkGlyph from '../assets/glyphicons/xmarkGlyph.png';
import FileTreeView from "../components/FileTreeView";
import CommentRenderer from "./CommentRenderer";

import { useKeypress } from "../components/NavBar";

export default function CodeRenderer(props) {

    const code = props.code
    const codeLines = props.codeLines
    const commentLines = props.commentLines
    const selectedLine = props.selectedLine
    const setSelectedLine = props.setSelectedLine
    const onSelectLine = props.onSelectLine
    const fileName = props.fileName
    const onFileDownload = props.onFileDownload
    const onFileCopy = props.onFileCopy
    const onFileRaw = props.onFileRaw

    const revisionNo = props.revisionNo

    const addNewComment = props.addNewCommentToDB
    const addNewReply = props.addNewReplyToDB
    const commentsData = props.commentsData
    const setCommentLines = props.setCommentLines
    const submissionID = props.submissionID
    const submissionData = props.submissionData
    const url = submissionData.zipURL

    const [revisionSelected, setRevisionSelected] = useState(revisionNo)

    const [isAddingComment, setIsAddingComment] = useState(false)

    // const [openFiles, setOpenFiles] = useState([
    //     {index: 1, fileName: "maus.js"},
    //     {index: 2, fileName: "hund.js"}
    // ])

    useKeypress('Escape', () => {
        setSelectedLine(0)
    })

    // const [currentOpenFile, setCurrentOpenFile] = useState({index: 1, fileName: "maus.js"})

    const downloadURL = () => {
        console.log("downloading " + url)
        const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
    }
    const [showFileBrowser, setShowFileBrowser] = useState(false)

    function FileBrowser() {
        return (
            <FileBrowserWrapper show={showFileBrowser}>
                <RowStyle>
                    <S1>Code Uploads</S1>
                    <ImgButton 
                        imgsrc={xmarkGlyph}
                        height={20}
                        action={()=>{
                            setShowFileBrowser(current=>!current)
                        }}
                    />
                </RowStyle>

                <FileTreeView />

            </FileBrowserWrapper>
        )
    }

    function TopActionBar() {
        return (
            <FileActionBarWrapper>

            <div
                style={{
                    marginLeft: "10px",
                    display: "inline-flex"
                }}
            >
                <div
                    style={{
                        marginTop: "10px"
                    }}
                >
                    <ImgButton 
                        imgsrc={filesGlyph} 
                        height={22}
                        action={()=>{
                            setShowFileBrowser(current => !current)
                        }}
                    />
                </div>
                    
                <FileName 
                style={{
                    marginTop: "12px",
                    marginLeft: "16px"
                }}
                >
                    {fileName}
                </FileName>
            
                {/* {openFiles.map((file) => {
                    return fileFolder(file)
                })} */}
            </div>

            <DownloadButtonWrapper>
                <Link target={url} download>
                    <ImgButton
                    imgsrc={downloadSolid}
                    height={20}
                    action={()=>{
                        handleDownload(url, 'archive.zip')
                    }}
                    
                    />
                 </Link>
            </DownloadButtonWrapper>
            </FileActionBarWrapper>
        )
    }
    
    return (
        <CodeRenderWrapper>

            {FileBrowser()}

            {TopActionBar()}

            <LinesWrapper>
                {codeLines.map(
                    (line, index) => {
                        return (
                            <div>
                            <CodeLineWrapper 
                                onClick={() => {
                                    const lineNumber = index + 1
                                    if (selectedLine !== lineNumber) {
                                        setSelectedLine(lineNumber)
                                        onSelectLine()
                                        console.log("selected: " + lineNumber)
                                    } else {
                                        setSelectedLine(0)
                                        console.log("deselected: " + lineNumber)
                                    }
                                    }} 
                                key={index+"line"}
                                isSelected={selectedLine === (index + 1)}
                                >

                                    <div style={{position: "absolute", width: "100%", marginLeft: "-36px"}}>
                                        <Index hasComments={commentLines.includes(index + 1)}>{index + 1}</Index>
                                        {commentLines.includes(index + 1) ?
                                        <div style={{
                                            position: "absolute",
                                            right: "10px",
                                            marginTop: "-16px"
                                        }}>
                                            <ImgButton imgsrc={commentsGlyph} height={15} />
                                        </div>
                                        :
                                        <div/>
                                        }
                                    </div>

                                <CodePre>
                                    <Code>{line}</Code>
                                </CodePre>

                                
                            </CodeLineWrapper>

                            {selectedLine === (index + 1)
                            ?
                            <CommentsWrapper>
                                <CommentTopBarWrapper>
                                    <div>
                                        <RectButton5 buttonText={"New"} onClick={()=>{
                                            setIsAddingComment(true)
                                        }}/>
                                    </div>

                                    <div
                                        style={{
                                            alignSelf: "center",
                                            marginRight: "100px"
                                        }}
                                    >
                                        <B5T>Press 'Escape' to hide</B5T>
                                    </div>

                                    <ImgButton 
                                        imgsrc={xmarkGlyph}
                                        height={17}
                                        action={()=>{
                                            setSelectedLine(0)
                                        }}
                                    />
                                </CommentTopBarWrapper>

                                <CommentRenderer 
                                    addNewCommentToDB={addNewComment}
                                    addNewReplyToDB={addNewReply}
                                    commentsData={commentsData}
                                    selectedLine={selectedLine}
                                    commentLines={commentLines}
                                    setCommentLines={setCommentLines}
                                    submissionID={submissionID}
                                    submissionData={submissionData}
                                    isAddingComment={isAddingComment}
                                    setIsAddingComment={setIsAddingComment}
                                    revisionNo={revisionNo}
                                />
                            </CommentsWrapper>
                            :
                            <div/>}

                            </div>
                            )
                    }
                )}

            </LinesWrapper>
    
        </CodeRenderWrapper>
    )
}

const DownloadButtonWrapper = styled.div`
    right:10px;
    margin-top:10px;
    position: absolute;
    width: 25px;
    height:25px;
    // border: solid 1px black;
`
const CodeRenderWrapper = styled.div`

    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    
    position: relative;
    margin-top: 10px;
    width: 100%;

    border: 1px solid ${Colors.gray};
    border-radius: 10px;
    background-color: white;

    overflow: hidden;
    /* box-shadow: 0px 0px 5px ${Colors.shadow}; */
`

const FileActionBarWrapper = styled.div`
    position: relative;
    margin: 0;
    height: 45px;
    width: 100%;

    background-color: ${Colors.grayish};
    
    border-radius: 10px 10px 0px 0px;

    display: flex;
    flex-direction: row;
`

const LinesWrapper = styled.div`
    position: relative;
    /* overflow: scroll; */
    overflow-x: scroll;

    background-color: ${Colors.lightgray};
`

const CodeLineWrapper = styled.div`
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    /* display: inline; */
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 40px;
    height: 20px;
    display: flex;
    justify-content: left;
    align-items: left;
    align-content: left;
    flex-direction: row;
    /* border: 1px dashed gray; */
    cursor: pointer;

    background-color: ${props => props.isSelected ? Colors.grayish : "transparent"};

    :hover {
        opacity: 50%;
    }
`

const CodePre = styled.pre`
    display: inline-block;
    margin: 0;
    font-size: 15px;
    /* font-family: "Courier New" Courier monospace; */
`

const Code = styled.code`
    font-family: 'Source Code Pro', monospace;
`

const IndicesWrapper = styled.div`
    position: absolute;
`

const IndexLineWrapper = styled.div`
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 0px;
    height: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    /* border: ${props => props.isSelected ? "1px" : "0px"} solid black; */
    background-color: ${props => props.isSelected ? Colors.lightgray : "transparent"};
`

const Index = styled.code`
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    margin-left: 10px;
    color: ${props => props.hasComments ? Colors.orange : Colors.gray};
`

const CommentIndicator = styled.div`
    position: absolute;
    right: 0px;
    margin-top: 5px;
    /* top: 5px; */
    /* top: 50%; */
    /* transform: translateY(-50%); */

    display: inline-block;
    /* align-items: right; */
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background-color: ${Colors.red};
    /* margin-bottom: 1px;
    margin-left: 1px; */
`

const FileFolderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-content: space-between;
    margin: 4px 10px;

    padding-right: 25px;
    padding-left: 25px;
    padding-top: 14px;

    border-radius: 10px 10px 0px 0px;

    height: 26px;

    text-align: center;

    background-color: ${props=>props.isActive ? Colors.grayish : "clear"};
`

const FileName = styled.code`
    font-family: 'Source Code Pro', monospace;
    font-weight: 500;
`

const FileBrowserWrapper = styled.div`
    position: absolute;
    height: 100%;
    width: 250px;
    background-color: rgba(216,216,216, 0.3);
    backdrop-filter: blur(10px);
    z-index: 10;

    transition: all 0.2s ease-in-out;

    transform: translateX(${props=>props.show ? "0px" : "-250px"});
`

const CommentsWrapper = styled.div`
    background-color: ${Colors.white};
    /* height: 100px; */
    padding-left: 30px;
    padding-top: 8px;
    padding-bottom: 8px;
`

const CommentTopBarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0px 5px;
`
