import React from "react";
import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import styled from "styled-components";
import { InputField1 } from "../designsystem/Fields";
import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton2 } from "../designsystem/Buttons";
import { AvatarCircleButton } from "../login/SignUpView";
import { updateUser } from "../viewmodels/UserDBQueries";
import { upload } from "../viewmodels/UploadAvatar";
import { getUserData } from "../viewmodels/UserDBQueries";
import LoadingScreen from "../components/LoadingScreen";
import { data } from "../codeview/dummydata";
import { B5T, S1 } from "../designsystem/TypographyStyles";
import { FormMenuComponentStyled, FormPageGrid, WidthAdjustmentDiv, FormSectionMargin, FormContainerViewWrapper } from "../designsystem/GlobalStyles";
import { Colors } from "../designsystem/ColorStyles";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";

export default function SettingsPageView(props) {

    const avatarRef = useRef()
    const history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;

    const [avatarFile, setAvatarFile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [position, setPosition] = useState('');
    const [username, setUsername] = useState('')

    const [newAvatarFile, setNewAvatarFile] = useState(false)
    const [madeRequest, setMadeRequest] = useState(false)

    const [userData, setUserData] = useState(null)

    function avatarClick() {
        avatarRef.current.click()
    }

    function handleReturn() {
        history.push("/account");
    }

    useEffect(()=>{
        if(!madeRequest) {

            const data = getUserData()

            console.log(data)

            getUserData()
            .then((data)=> {
                firstNameVal = data.firstName
                lastNameVal = data.lastName
                workplaceVal = data.workplace
                positionVal = data.position
                usernameVal = data.username
                setAvatarFile(data.pictureURL)
                setUserData(data)
            })
            setMadeRequest(true)
        }
    })

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

    var firstNameVal = firstName
    var lastNameVal = lastName
    var workplaceVal = workplace
    var positionVal = position
    var usernameVal = username

    function updateValues() {
        if (firstName == '') {
            firstNameVal = userData.firstName
        }
        if (lastName == '') {
            lastNameVal = userData.lastName
        }
        if (workplace == '') {
            workplaceVal = userData.workplace
        }
        if (position == '') {
            positionVal = userData.position
        }
        if (username == '') {
            username = userData.username
        }
    }

    function onHandleSubmit(values) {
        console.log("submitted");
        if (newAvatarFile) {
            upload(avatarFile)
                .then(url=> {
                    updateUser(url, values.firstName, values.lastName, values.workplace, values.position)
                    .then((val)=> {
                        handleReturn()
                    })
                })
                .catch(e=> {
                    console.log(e)
                })
        } else if (values.email != '') {
            if (values.email == values.confirmEmail) {
                updateEmail(user, values.email).then(() => {
                    console.log("Email updated!")
                    handleReturn()
                }).catch(e=> {
                    console.log(e)
                })
            } else {
                alert("Emails do not match!")
            }
        } else if (values.password != '') {
            if (values.password == values.confirmPassword) {
                updatePassword(user, values.password).then(() => {
                    console.log("Password updated!")
                    handleReturn()
                }).catch(e=> {
                    console.log(e)
                })
            } else {
                alert("Passwords do not match!")
            }
        } else {
            updateUser(userData.pictureURL, values.firstName, values.lastName, values.workplace, values.position)
            .then(val=> {
                handleReturn()
            })
        }      
    }

    const [detailsIsOpen, setDetailsIsOpen] = useState(true)
    const [emailIsOpen, setEmailIsOpen] = useState(false)
    const [passwordIsOpen, setPasswordIsOpen] = useState(false)

    function onDetailsMenuTap() {
        if (detailsIsOpen) {
            return
        } else {
            setDetailsIsOpen(current => !current)
            if (emailIsOpen) {
                setEmailIsOpen(current => !current)
            }
            if (passwordIsOpen) {
                setPasswordIsOpen(current => !current)
            }
        }
    }

    function onEmailMenuTap() {
        if (emailIsOpen) {
            return
        } else {
            setEmailIsOpen(current => !current)
            if (detailsIsOpen) {
                setDetailsIsOpen(current => !current)
            }
            if (passwordIsOpen) {
                setPasswordIsOpen(current => !current)
            }
        }
    }

    function onPasswordMenuTap() {
        console.log("password tap")
        if (passwordIsOpen) {
            return
        } else {
            setPasswordIsOpen(current => !current)
            if (detailsIsOpen) {
                setDetailsIsOpen(current => !current)
            }
            if (emailIsOpen) {
                setEmailIsOpen(current => !current)
            }
        }
    }

    return (
        <div>
            {userData
            ?
            <div>
                <FormContainerViewWrapper>
                    <S1 style={{marginLeft: "16px"}}>Personal Account Settings</S1>

                    <FormPageGrid showTwoColumns={numberOfColumns === 2 ? true : false}>
                        <ProfilePictureWrapper>
                            <AvatarCircleButton large={true} onClick={avatarClick} image={avatarFile}/>
                                <input id="upload" 
                                ref={avatarRef} 
                                type="file" 
                                accept="image/*"
                                onChange={(event)=> { 
                                    setAvatarFile(event.target.files[0])
                                    setNewAvatarFile(true)
                                }}
                                onClick={(event)=> { 
                                    event.target.value = null
                                }}
                                style={{display: "none"}}
                            />
                        </ProfilePictureWrapper>

                        <div style={{marginTop: numberOfColumns !== 2 ? "20px" : "0px"}}>
                            <Formik 
                                 initialValues={{
                                     firstName: userData.firstName, 
                                     lastName: userData.lastName, 
                                     workplace: userData.workplace, 
                                     position: userData.position, 
                                     username: userData.username,
                                     email: "", 
                                     confirmEmail: "",
                                     password: "",
                                     confirmPassword: ""
                                 }}
                                 onSubmit={values=>{
                                     onHandleSubmit(values)
                                 }}
                             >
                                 { settingsProps =>(
                                     <Form noValidate>
                                        <FormMenuComponentStyled onClick={() => {
                                            onDetailsMenuTap()
                                        }}>
                                            <S1 style={{padding: "16px"}}>Edit Details</S1>

                                            {detailsIsOpen ?
                                            <div>
                                            <FormSectionMargin>
                                                <B5T>First Name</B5T>

                                                <InputField1 type="text" 
                                                 name="firstName" 
                                                 value={settingsProps.values.firstName}
                                                 // onChange={(e) => setFirstName(e.target.value)}
                                                 isValid={true}
                                                 placeholder={userData.firstName} />

                                            </FormSectionMargin>

                                            <FormSectionMargin>
                                                <B5T>Last Name</B5T>

                                                <InputField1 type="text" 
                                                    name="lastName" 
                                                    value={settingsProps.values.lastName}
                                                    // onChange={(e) => setLastName(e.target.value)} 
                                                    isValid={true}
                                                    placeholder={userData.lastName} />

                                            </FormSectionMargin>

                                            <FormSectionMargin>

                                                <B5T>Position</B5T>

                                                <InputField1 type="text" 
                                                    name="position" 
                                                    value={settingsProps.values.position}
                                                    // onChange={(e) => setPosition(e.target.value)}
                                                    isValid={true}
                                                    placeholder={"Position"} />

                                            </FormSectionMargin>

                                            <FormSectionMargin>

                                                <B5T>Workplace</B5T>

                                                <InputField1 type="text" 
                                                    name="workplace" 
                                                    value={settingsProps.values.workplace}
                                                    // onChange={(e) => setWorkplace(e.target.value)}
                                                    isValid={true}
                                                    placeholder={"Workplace"} />
                                                
                                            </FormSectionMargin>

                                            <FormSectionMargin>
                                                <B5T>username</B5T>

                                                <InputField1 type="text" 
                                                    name="username" 
                                                    value={settingsProps.values.username}
                                                    // onChange={(e) => setWorkplace(e.target.value)}
                                                    isValid={true}
                                                    placeholder={"Username"} />

                                            </FormSectionMargin>

                                            <FormSectionMargin style={{paddingBottom: "16px"}}>
                                                
                                                <RectButton4 buttonText="Save" onClick={settingsProps.handleSubmit}/>

                                                <div style={{height: "10px"}}/>

                                                <TextButton2 buttonText="Cancel" onClick={handleReturn}/>

                                            </FormSectionMargin>
                                            </div>    
                                            :
                                            <div/>
                                        }

                                        </FormMenuComponentStyled>

                                        <FormMenuComponentStyled onClick={() => {
                                            onEmailMenuTap()
                                        }}>
                                            <S1 style={{padding: "16px"}}>Change Email</S1>

                                            {emailIsOpen ?
                                            <div>
                                               <FormSectionMargin>
                                                   <B5T>New Email</B5T>

                                                    <InputField1 type="email" 
                                                        name="email" 
                                                        value={settingsProps.values.email}
                                                        isValid={true}
                                                        placeholder="New Email"/>

                                                    <div style={{height: "10px"}}/>

                                                    <InputField1 type="email" 
                                                        name="confirmEmail" 
                                                        value={settingsProps.values.confirmEmail}
                                                        isValid={true}
                                                        placeholder="Confirm Email"/>

                                               </FormSectionMargin>

                                               <FormSectionMargin style={{paddingBottom: "16px"}}>
                                                
                                                    <RectButton4 buttonText="Save" onClick={settingsProps.handleSubmit}/>

                                                    <div style={{height: "10px"}}/>

                                                    <TextButton2 buttonText="Cancel" onClick={handleReturn}/>

                                                </FormSectionMargin>
                                            </div>
                                            :
                                            <div/>}

                                        </FormMenuComponentStyled>

                                        <FormMenuComponentStyled onClick={() => {
                                            onPasswordMenuTap()
                                        }}>
                                            <S1 style={{padding: "16px"}}>Change Password</S1>

                                            {passwordIsOpen
                                            ?
                                            <div>
                                                <FormSectionMargin>
                                                    <B5T>New Password</B5T>

                                                    <InputField1 type="password" 
                                                        name="password" 
                                                        value={settingsProps.values.password}
                                                        isValid={true}
                                                        placeholder="New Password" />
                                                    
                                                    <div style={{height: "10px"}}/>

                                                    <InputField1 type="password" 
                                                        name="confirmPassword" 
                                                        value={settingsProps.values.confirmPassword}
                                                        isValid={true}
                                                        placeholder="Confirm Password" />

                                                </FormSectionMargin>

                                                <FormSectionMargin style={{paddingBottom: "16px"}}>
                                                
                                                    <RectButton4 buttonText="Save" onClick={settingsProps.handleSubmit}/>

                                                    <div style={{height: "10px"}}/>

                                                    <TextButton2 buttonText="Cancel" onClick={handleReturn}/>

                                                </FormSectionMargin>

                                            </div>
                                            :
                                            <div/>}
                                        </FormMenuComponentStyled>
                                    </Form>
                                 )}
                            </Formik>
                            
                        </div>

                    </FormPageGrid>
                    
                </FormContainerViewWrapper>
            </div>
            :
            <LoadingScreen />
            }
        </div>
    )
}


const SettingsViewWrapper = styled(WidthAdjustmentDiv)`
    width: 100%;
    position: absolute;
    overflow-y: scroll;
    margin-top: 70px;
`

const ProfilePictureWrapper = styled.div`
    /* margin: 15px; */
    width: 50px;
    
`
