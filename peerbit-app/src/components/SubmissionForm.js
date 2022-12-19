import React from "react";
import { useState, useRef, useEffect } from "react";
import Switch from 'react-ios-switch';
import styled from "styled-components";
import { Colors } from "../designsystem/ColorStyles";
import {
    RectButton1, 
    RectButton2, 
    RectButton3, 
    RectButton4,
    RectButton5,
    TextButton1,
    TextButton2,
    Link,
    ImgButton
} from "../designsystem/Buttons";
import { B1, B3T, T1, S1, B2T } from "../designsystem/TypographyStyles";
import { Formik, Form, Field } from "formik";
import { InputField1, InputField2, TextAreaStyle } from "../designsystem/Fields";
import { createSubmission, getProgrammingFileExtensions, validateSubmissionCredentials } from "../viewmodels/Submission";
import useWindowDimensions from "../utilities/WindowDimensionsHook";
import { useHistory } from "react-router";
import redDeleteGlyph from '../assets/glyphicons/redDeleteGlyph.png';
import greenTickGlyph from '../assets/glyphicons/greenTickGlyph.png';
import plusGlyph from '../assets/glyphicons/plusGlyph.png';
import blackDeleteGlyph from '../assets/glyphicons/blackDeleteGlyph.png';
import xmarkGlyph from '../assets/glyphicons/xmarkGlyph.png';

import LoadingScreen from "./LoadingScreen";
import { FormContainerViewWrapper, FormMenuComponentStyled, FormPageGrid } from "../designsystem/GlobalStyles";
import FileTreeView from "./FileTreeView";

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

export default function SubmissionForm(props) {

    /*
    formik handles name, short descr and full descr
    makePublicInstantly state controls the switch
    codeFile state holds the submitted file
    */

    const history = useHistory()

    const [showProgress, setShowProgress] = useState(false)
    const [submissionSuccessful, setSubmissionSuccessful] = useState(false)
    
    //validation UI
    const [isNameValid, setIsNameValid] = useState(true)
    const [isShortDescriptionValid, setIsShortDescriptionValid] = useState(true)
    const [isFileValid, setIsFileValid] = useState(true)

    //submission data
    const [makePublicInstantly, setMakePublicInstantly] = useState(false)
    const [codeFile, setCodeFile] = useState(null)
    const codeFileExtensionsAccept = getProgrammingFileExtensions()


    //states & UI
    const isTransfer = props.isTransfer
    const [showDescriptionField, setShowDescriptionField] = useState(false)
    const codeFileRef = useRef()
    const { height, width } = useWindowDimensions();

    function returnToPublishPage() {
        history.push("/publish")
    }

    function onSubmit(values) {

        console.log("SUBMIT", values)

        console.log("heyehe")

        setIsNameValid(true)
        setIsShortDescriptionValid(true)
        setIsFileValid(true)
        
        const missingSubmissionFields = 
            validateSubmissionCredentials(
                values.submissionName, 
                values.shortDescription, 
                codeFile
            )

        console.log(missingSubmissionFields)

        if (missingSubmissionFields.length > 0) {
            missingSubmissionFields.forEach((field) => {
                switch(field) {
                    case 0:
                        alert("Please add a name to your submission.")
                        setIsNameValid(false)
                        break;
                    case 1: 
                        alert("Please add a brief description to your submission.")
                        setIsShortDescriptionValid(false)
                        break;
                    case 2:
                        alert("Please add a code file to your submission")
                        setIsFileValid(false)
                        break;

                }
            })
        } else {
            //turn on some spinner
            setShowProgress(true)
            createSubmission(
                values.submissionName,
                values.shortDescription,
                codeFile,
                attachmentFiles,
                values.fullDescription,
                makePublicInstantly
            )
            .then((status)=> {
                //say completed successfully
                setTimeout(()=> {
                    setSubmissionSuccessful(true)
                }, 1000)
                setTimeout(()=>{
                    returnToPublishPage()
                    setShowProgress(false)
                }, 1500)
            })
            .catch((error)=> {
                console.log(error)
                alert(error)
                //turn off spinner
                setShowProgress(false)
            })
        }

    }

    function removeCodeFile() {
        setCodeFile(null)
    }

    const [showDetails, setShowDetails] = useState(true)
    const [showDescription, setShowDescription] = useState(false)
    const [showAttachments, setShowAttachments] = useState(false)
    // const [showReview, setShowReview] = useState(false)

    function onDetailsMenuTap() {
        if (showDetails) {return} else {
            setShowDetails(current => !current)
            
            if (showDescription) { setShowDescription(current => !current) }
            if (showAttachments) { setShowAttachments(current => !current) }
            // if (showReview) { setShowReview(current => !current) }
        }
    }

    function onDescriptionMenuTap() {
        if (showDescription) {return} else {
            setShowDescription(current => !current)

            if (showDetails) { setShowDetails(current => !current) }
            if (showAttachments) { setShowAttachments(current => !current) }
            // if (showReview) { setShowReview(current => !current) }
        }
    }

    function onAttachmentsMenuTap() {
        if (showAttachments) {return} else {
            setShowAttachments(current => !current)

            if (showDetails) { setShowDetails(current => !current) }
            if (showDescription) { setShowDescription(current => !current) }
            // if (showReview) { setShowReview(current => !current) }
        }
    }

    const [attachmentFiles, setAttachmentFiles] = useState([])
    const attachmentRef = useRef()

    function addAttachment(attachment) {
        let fileName = attachment.name
        let file = attachment
        let index = attachmentFiles.length + 1
        setAttachmentFiles([...attachmentFiles, {fileName: fileName, file: file, index: index}])
    }

    function removeAttachment(index) {
        console.log(attachmentFiles)
        setAttachmentFiles(current => current.filter((item)=> {
            return item.index !== index
        }))
    }

    const [numberOfColumns, setNumberOfColumns] = useState(1)

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

    useEffect(() => {
        updateNumberOfColumns()
    })

    return (
        <div>
        {!showProgress
        ?
        <FormContainerViewWrapper>
            <T1 style={{marginLeft: "16px", marginBottom: "16px"}}>Submit your code</T1>

            <Formik
                    initialValues={{
                        submissionName: "",
                        makePublicInstantly: false,
                        shortDescription: "",
                        fullDescription: ""
                    }}
                    onSubmit={values=>{
                        console.log("submitted")
                        console.log(values)
                        onSubmit(values)
                    }}
                    validator={() => ({})}
            >
                {(props) => (
                    <Form noValidate>
                        <FormPageGrid showTwoColumns={numberOfColumns === 2 ? true : false}>
                
                            <CodeFormSectionWrapper>

                                {
                                    codeFile ? 
                                    <div>
                                        <RowStyle>
                                            <S1>Code Uploads</S1>
                                            <ImgButton 
                                                imgsrc={redDeleteGlyph}
                                                action={()=>{
                                                    removeCodeFile()
                                                }}
                                            />
                                        </RowStyle>

                                        <B1>{codeFile.name}</B1>

                                        {/* <FileTreeView /> */}
                                    </div>
                                    :
                                    <FileInputWrapper
                                        onClick={()=>{
                                            codeFileRef.current.click()
                                        }}
                                    >

                                        <input id="upload" 
                                            ref={codeFileRef} 
                                            type="file" 
                                            accept={codeFileExtensionsAccept}
                                            onChange={(event)=> { 
                                                setCodeFile(event.target.files[0])
                                            }}
                                            onClick={(event)=> { 
                                                event.target.value = null
                                            }}
                                            style={{display: "none"}}
                                        />

                                        <S1 style={{marginBottom: "10px"}}>Tap to upload your code</S1>

                                        <B2T>Attach a code file</B2T>

                                    </FileInputWrapper>
                                }


                            </CodeFormSectionWrapper>

                            <SubmissionDetailsSectionWrapper>

                                {/* <S1>Code Uploads</S1> */}

                                <DetailsWrapper>
                                    <FormMenuComponentStyled onClick={()=> {
                                        onDetailsMenuTap()
                                    }}
                                    >
                                        
                                        <RowStyle style={{padding: "16px 0px", marginTop: "0"}}>
                                            <S1>Details</S1>
                                            <div>
                                                {props.values.submissionName.length > 0 
                                                & props.values.shortDescription.length > 0
                                                ?
                                                <ImgButton 
                                                    imgsrc={greenTickGlyph}
                                                    // style={{marginRight: "10px"}}
                                                    />
                                                :
                                                <div/>}
                                            </div>
                                        </RowStyle>

                                        {showDetails 
                                        ?
                                        <div style={{margin: "0px 16px", marginTop: "-16px"}} >
                                            <InputField1 
                                                type="text" 
                                                name="submissionName" 
                                                value={props.values.submissionName} 
                                                placeholder="Submission name*" 
                                                isValid={isNameValid}
                                                style={{width: "100%", marginBottom: "10px"}}
                                            />
                                            
                                            <InputField2
                                                type="text" 
                                                as={TextAreaStyle}
                                                rows="4"
                                                name="shortDescription" 
                                                value={props.values.shortDescription} 
                                                placeholder="Short description*" 
                                                isValid={isShortDescriptionValid}
                                                onChange={(e) => {
                                                    props.setFieldValue("shortDescription", e.target.value)
                                                }}
                                                style={{width: "100%", height: "100px", marginBottom: "10px"}}
                                            />

                                        </div>
                                        
                                        :
                                        <div/>}

                                    </FormMenuComponentStyled>

                                    <FormMenuComponentStyled onClick={()=> {
                                        onDescriptionMenuTap()
                                    }}>
                                        <RowStyle style={{padding: "16px 0px"}}>
                                            <S1>Full Description</S1>
                                            
                                            
                                            <div>
                                                {props.values.fullDescription.length > 0
                                                ?
                                                <RowStyle style={{width: "65px", margin: "0"}}>
                                                    
                                                    <ImgButton 
                                                    imgsrc={greenTickGlyph}
                                                    style={{marginRight: "10px"}}
                                                    />
                                                    
                                                    <ImgButton 
                                                    imgsrc={redDeleteGlyph}
                                                    action={()=>{
                                                        props.setFieldValue("fullDescription", "")
                                                    }}
                                                    />
                                                </RowStyle>
                                                :
                                                <div/>
                                                }
                                            </div>
                                        </RowStyle>

                                        {showDescription
                                        ?
                                        <div style={{margin: "0px 16px", marginTop: "-16px"}}>
                                            <InputField2
                                                type="text" 
                                                as={TextAreaStyle}
                                                rows="4"
                                                name="fullDescription" 
                                                value={props.values.fullDescription} 
                                                placeholder="Full description" 
                                                isValid={true}
                                                onChange={(e) => {
                                                    props.setFieldValue("fullDescription", e.target.value)
                                                }}
                                                style={{
                                                    width: "100%",
                                                    marginBottom: "16px"
                                                }}
                                            />
                                        </div>
                                        :
                                        <div/>}
                                    </FormMenuComponentStyled>

                                    <FormMenuComponentStyled onClick={()=> {
                                        onAttachmentsMenuTap()
                                    }}
                                        style={{overflowX: "auto"}}
                                    >
                                        <RowStyle style={{padding: "0px 0px"}}>
                                            <S1>Attachments</S1>
                                            <div>
                                                {attachmentFiles.length > 0
                                                ?
                                                <RowStyle style={{width: "65px", margin: "0px 0px"}}>
                                                    
                                                    <ImgButton 
                                                    imgsrc={greenTickGlyph}
                                                    style={{marginRight: "10px"}}
                                                    />
                                                    
                                                    <ImgButton 
                                                    imgsrc={redDeleteGlyph}
                                                    action={()=>{
                                                        setAttachmentFiles(current => [])
                                                    }}
                                                    />
                                                </RowStyle>
                                                :
                                                <div/>
                                                }
                                            </div>
                                        </RowStyle>

                                        {showAttachments
                                        ?
                                        <AttachmentsWrapper>
                                            <input id="upload" 
                                                ref={attachmentRef} 
                                                type="file" 
                                                // accept={codeFileExtensionsAccept}
                                                onChange={(event)=> { 
                                                    addAttachment(event.target.files[0])
                                                }}
                                                onClick={(event)=> { 
                                                    event.target.value = null
                                                }}
                                                style={{display: "none"}}
                                            />

                                            <AttachmentFrame hover={true} onClick={()=> {
                                                attachmentRef.current.click()
                                            }}>
                                                <ImgButton 
                                                    imgsrc={plusGlyph}
                                                    isCentered={true}
                                                    isVertCentered={true}
                                                />
                                            </AttachmentFrame>

                                            {attachmentFiles.map((attachment) => {
                                                return (
                                                    <AttachmentFrame hover={false}>
                                                        <B3T
                                                            style={{
                                                                position: "absolute",
                                                                left: "50%",
                                                                top: "50%",
                                                                transform: "translate(-50%, -50%)"
                                                            }}
                                                        >
                                                            {attachment.fileName}
                                                        </B3T>

                                                        <div style={{position: "absolute", right: "10px", top: "10px"}}>
                                                            <ImgButton imgsrc={blackDeleteGlyph} action={()=>{
                                                                removeAttachment(attachment.index)
                                                            }}/>
                                                        </div>
                                                    </AttachmentFrame>
                                                )
                                            })}

                                            {/* {attachmentFiles.length > 0
                                            ?
                                            <div>
                                                {attachmentFiles.map((attachment) => {
                                                return (
                                                    <AttachmentFrame hover={false}>
                                                        <B3T
                                                            style={{
                                                                position: "absolute",
                                                                left: "50%",
                                                                top: "50%",
                                                                transform: "translate(-50%, -50%)"
                                                            }}
                                                        >
                                                            {attachment.fileName}
                                                        </B3T>

                                                        <div style={{position: "absolute", right: "10px", top: "10px"}}>
                                                            <ImgButton imgsrc={blackDeleteGlyph} action={()=>{
                                                                removeAttachment(attachment.index)
                                                            }}/>
                                                        </div>
                                                    </AttachmentFrame>
                                                )
                                                })}
                                            </div>
                                            :
                                            <div/>
                                            } */}
                                        </AttachmentsWrapper>
                                        :
                                        <div/>
                                        }
                                        
                                    </FormMenuComponentStyled>

                                    <FormMenuComponentStyled>
                                        <RowStyle style={{margin: "0"}}>
                                            <S1 style={{padding: "16px"}}>Peer Review</S1>
                                            <div>
                                                <Switch
                                                    checked={makePublicInstantly}
                                                    // className="switch"
                                                    onChange={() => {
                                                        //set value
                                                        props.setFieldValue('makePublicInstantly', !makePublicInstantly)
                                                        setMakePublicInstantly(!makePublicInstantly)
                                                    }}
                                                    style={{
                                                        marginBottom: "10px",
                                                        marginRight: "16px"
                                                    }}
                                                />
                                            </div>
                                        </RowStyle>
                                    </FormMenuComponentStyled>
                                </DetailsWrapper>

                                <ButtonRowWrapper>
                                    <RectButton1
                                        buttonText="Publish"
                                        onClick={()=>{
                                            props.handleSubmit()
                                        }}
                                    />

                                    {/* <RectButton2
                                        buttonText="Save Draft"
                                    /> */}

                                </ButtonRowWrapper>

                            </SubmissionDetailsSectionWrapper>

                        </FormPageGrid>
                    </Form>
                )}

            </Formik>

        </FormContainerViewWrapper>
        :
        <LoadingScreen
            showSuccess={submissionSuccessful}
        />
        }
        </div>
    )


    // return (
    //     <ContainerWrapper>
    //         <CentralBlockWrapper>
    //             {!showProgress
    //             ?
    //             <Formik
    //                 initialValues={{
    //                     submissionName: "",
    //                     makePublicInstantly: true,
    //                     shortDescription: "",
    //                     fullDescription: ""
    //                 }}
    //                 onSubmit={values=>{
    //                     console.log("submitted")
    //                     console.log(values)
    //                     onSubmit(values)
    //                 }}
    //                 validator={() => ({})}
    //             >
    //                 {(props) => (
    //                     <Form noValidate>
    //                         <FormWrapper>
    //                             <ItemWrapper>
    //                                 <T1>Submit your code</T1>
    //                             </ItemWrapper>

    //                             <ItemWrapper>
    //                                 <InputField1 
    //                                     type="text" 
    //                                     name="submissionName" 
    //                                     value={props.values.submissionName} 
    //                                     placeholder="Submission name*" 
    //                                     isValid={isNameValid}
    //                                     style={{marginTop: "30px"}}
    //                                 />
    //                             </ItemWrapper>

    //                             <ItemWrapper>
    //                                 <InputField2
    //                                     type="text" 
    //                                     as={TextAreaStyle}
    //                                     rows="4"
    //                                     name="shortDescription" 
    //                                     value={props.values.shortDescription} 
    //                                     placeholder="Short description*" 
    //                                     isValid={isShortDescriptionValid}
    //                                     onChange={(e) => {
    //                                         props.setFieldValue("shortDescription", e.target.value)
    //                                     }}
    //                                     // style={{}}
    //                                 />
    //                             </ItemWrapper>
    //                             <div>
    //                                 <input id="upload" 
    //                                     ref={codeFileRef} 
    //                                     type="file" 
    //                                     accept={codeFileExtensionsAccept}
    //                                     onChange={(event)=> { 
    //                                         setCodeFile(event.target.files[0])
    //                                     }}
    //                                     onClick={(event)=> { 
    //                                         event.target.value = null
    //                                     }}
    //                                     style={{display: "none"}}
    //                                 />

    //                                 {codeFile == null
    //                                 ?
    //                                 <ItemWrapper
    //                                     style={{
    //                                         marginTop: "30px",
    //                                         width: "220px",
    //                                         borderRadius: "10px",
    //                                         boxShadow: isFileValid ? "0px 0px 0px red" : "0px 0px 5px red"
    //                                     }}
    //                                 >

    //                                     <RectButton2 
    //                                         buttonText={"Upload File"} 
    //                                         onClick={() => {
    //                                             codeFileRef.current.click()
    //                                         }}
    //                                     />
    //                                 </ItemWrapper>
    //                                 :
    //                                 <ItemWrapper
    //                                     style={{
    //                                         marginTop: "30px"
    //                                     }}
    //                                 >
    //                                     <B1>{codeFile.name}</B1>

    //                                     <TextButton2 
    //                                         buttonText={"Change file"}
    //                                         onClick={() => {
    //                                             codeFileRef.current.click()
    //                                         }}
    //                                     />
    //                                 </ItemWrapper>

    //                             }
    //                             </div>

    //                             <ItemWrapper
    //                                 style={{marginTop: "30px"}}
    //                             >
    //                                 {showDescriptionField ? 
    //                                     <ItemWrapper>
    //                                         <InputField2
    //                                             type="text" 
    //                                             as={TextAreaStyle}
    //                                             rows="4"
    //                                             name="fullDescription" 
    //                                             value={props.values.fullDescription} 
    //                                             placeholder="Full description" 
    //                                             isValid={true}
    //                                             onChange={(e) => {
    //                                                 props.setFieldValue("fullDescription", e.target.value)
    //                                             }}
    //                                             style={{
    //                                                 width: "500px"
    //                                             }}
    //                                         />
    //                                     </ItemWrapper>
    //                                     :
    //                                     <RectButton3 
    //                                         buttonText={"Add Full Description"} 
    //                                         onClick={()=>{setShowDescriptionField(true)}}
    //                                     />
    //                                 }
    //                             </ItemWrapper>

    //                             <ItemWrapper
    //                                 style={{
    //                                     marginTop: "30px"
    //                                 }}
    //                             >
    //                                 <B3T
    //                                     style={{
    //                                         display: "inline-block",
    //                                         transform: "translateY(-10px)",
    //                                         marginRight: "20px"
    //                                     }}
    //                                 >
    //                                     Make Public Instantly
    //                                 </B3T>

    //                                 <Switch
    //                                     checked={makePublicInstantly}
    //                                     // className="switch"
    //                                     onChange={() => {
    //                                         //set value
    //                                         // setFieldValue('makePublicInstantly', !makePublicInstantly)
    //                                         setMakePublicInstantly(!makePublicInstantly)
    //                                     }}
    //                                     style={{
    //                                         display: "inline-block"
    //                                     }}
    //                                 />

    //                             </ItemWrapper>

    //                             {height <= 800
    //                             ?
    //                             <div>
    //                                 <ItemWrapper
    //                                     style={{marginTop: "50px"}}
    //                                 >
    //                                     <RectButton1 
    //                                         buttonText={"Submit"} 
    //                                         onClick={() => {
    //                                             props.handleSubmit()
    //                                         }}
    //                                     />
    //                                 </ItemWrapper>

    //                                 <ItemWrapper
    //                                     style={{marginTop: "15px", paddingBottom: "30px"}}
    //                                 >
    //                                     <TextButton1 
    //                                         buttonText={"Return back to Publish page"} 
    //                                         onClick={returnToPublishPage}
    //                                     />
    //                                 </ItemWrapper>
    //                             </div>
    //                             :
    //                             <div></div>}

    //                         </FormWrapper>

    //                         {height > 800 
    //                         ?
    //                         <LowerButtonsBlockWrapper>

    //                             <ItemWrapper>
    //                                 <RectButton1 
    //                                     buttonText={"Submit"} 
    //                                     onClick={() => {
    //                                         props.handleSubmit()
    //                                     }}
    //                                 />
    //                             </ItemWrapper>

    //                             <ItemWrapper>
    //                                 <TextButton1 
    //                                     buttonText={"Return back to Publish page"} 
    //                                     onClick={() => {
    //                                         returnToPublishPage()
    //                                     }}
    //                                 />
    //                             </ItemWrapper>

    //                         </LowerButtonsBlockWrapper>
    //                         :
    //                         <div></div>}   
    //                     </Form>
    //                 )}
    //             </Formik>
    //             :
    //             <LoadingScreen
    //                 showSuccess={submissionSuccessful}
    //             />
    //             }
    //         </CentralBlockWrapper>
    //     </ContainerWrapper>
    // )
}


// const ContainerWrapper = styled.div`
//     position: absolute;
//     width: 100%;
//     height: 100vh;
//     transition: all .3s ease-in-out;
// `

// const CentralBlockItem = styled.div`
//     margin: 5px auto;
// `


// const CentralBlockWrapper = styled.div`
//     position: absolute;
//     transform: translate(-50%, -50%);
//     left: 50%;
//     top: 50%;
//     text-align: center;
//     width: 100%;
//     height: 100vh;
// `


// const FormWrapper = styled.div`
//     position: relative;
//     top: 60px;
//     display: block;
//     left: 50%;
//     transform: translateX(-50%);
// `


// const LowerButtonsBlockWrapper = styled.div`
//     position: absolute;
//     height: 100px;
//     bottom: 50px;
//     display: block;
//     left: 50%;
//     transform: translateX(-50%);
// `

// const ItemWrapper = styled.div`
//     position: relative;
//     margin: 10px auto;
// `



const CodeFormSectionWrapper = styled.div`
    position: relative;
    display: block;
    height: 800px;
    width: 100%;
    background-color: ${Colors.lightgray};
    border-radius: 14px;
    overflow: auto;
`

const FileInputWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    cursor: pointer;

    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;

    :hover {
        opacity: 0.7
    }
`

export const RowStyle = styled.div`
    position: relative;
    display: flex;
    /* width: 100%; */
    justify-content: space-between;
    flex-direction: row;
    align-items: flex-end;
    margin: 16px 16px;
`



const SubmissionDetailsSectionWrapper = styled.div`
    position: relative;
    height: 800px;
`

const DetailsWrapper = styled.div`
    position: absolute;
    top: 0px;
    width: 100%;
    overflow-x: auto;
`

const ButtonRowWrapper = styled.div`
    position: absolute;
    bottom: 30px;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
`

const AttachmentsWrapper = styled.div`
    display: inline-flex;
    /* flex-direction: row; */
    margin-left: 16px;
    padding-bottom: 16px;
    
    /* width: 100%; */

    overflow-x: scroll;
`

const AttachmentFrame = styled.div`
    position: relative;

    background-color: ${Colors.white};
    border: 1px solid ${Colors.gray};
    border-radius: 8px;
    height: 150px;
    width: 200px;

    margin-right: 8px;

    overflow: hidden;

    :hover {
        opacity: ${props=>props.hover ? 0.7 : 1};
    }
`