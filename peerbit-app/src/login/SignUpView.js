import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";

import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton1 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { B5T, T1, B3, B4 } from "../designsystem/TypographyStyles";
import { InputField1 } from "../designsystem/Fields";

import { CurrentLoginScreen } from "./LoginView";
import { useHistory } from "react-router";

import { useRef } from "react";
import { useState } from "react";
import { createUser, validateNewUserCredentials } from "../viewmodels/Auth";

export function AvatarCircleButton(props) {

    const [tapped, setTapped] = useState(false)
    
    function onTap() {
        setTapped(true)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on avatar circle button")
        }, 200)
    }

    return (
        <AvatarButtonWrapper 
            tapped={tapped}
            onClick={onTap}
            large={props.large}
        >
            {
                props.image ?
                <AvatarPreview large={props.large} src={
                    typeof(props.image) === "string" 
                    ? 
                    props.image 
                    : 
                    URL.createObjectURL(props.image)} 
                    />
                :
                <AvatarButtonText>Add Avatar</AvatarButtonText>
            }
        </AvatarButtonWrapper>
    )
}

export default function SignUpView() {

    const avatarRef = useRef()
    const history = useHistory()

    const [avatarFile, setAvatarFile] = useState(null)

    const [isFirstNameValid, setIsFirstNameValid] = useState(true)
    const [isLastNameValid, setIsLastNameValid] = useState(true)
    const [isUsernameValid, setIsUsernameValid] = useState(true)
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)

    function returnToLogin() {
        history.push(CurrentLoginScreen.LOGIN)
    }

    function avatarClick() {
        avatarRef.current.click()
    }

    async function onSumbmit(values) {
        //reset invalid highlights   
        setIsFirstNameValid(true)    
        setIsLastNameValid(true)
        setIsUsernameValid(true)    
        setIsEmailValid(true)
        setIsPasswordValid(true)       

        const invalidFields = await validateNewUserCredentials(values)
        console.log(invalidFields)
        if (invalidFields.length > 0) {
            //invalid, highlight invalid fields
            invalidFields.forEach((invalidField) => {
                console.log("setting invalid for: " + invalidField)
                switch (invalidField) {
                    case 0:    //email
                        setIsEmailValid(false)
                        alert("Invalid Email!")
                        break;
                    case 1:     //password
                        setIsPasswordValid(false)
                        alert("Invalid Password!")
                        break;
                    case 2:     //username
                        setIsUsernameValid(false)
                        alert("Please enter a username!")
                        break;
                    case 3:     //firstname
                        setIsFirstNameValid(false)
                        alert("Please enter a first name!")
                        break;
                    case 4:
                        setIsLastNameValid(false)
                        alert("Please enter a last name!")
                        break;
                    default:
                        break;
                }
            })
        } else {
            //valid, call create user
            console.log("add fields valid, calling to create user...")
            createUser(
                values.firstName,
                values.lastName,
                values.username,
                values.workplace,
                values.position,
                values.email,
                values.password,
                avatarFile
            )
        }
    }

    return(
        <ContainerWrapper>
            <CentralBlockWrapper>

                <CentralBlockItem style={{marginBottom: "30px"}}>
                    <T1>Join peerbit!</T1>
                </CentralBlockItem>

                <Formik 
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        username: "",
                        workplace: "",
                        position: "",
                        email: "", 
                        password: ""
                    }}
                    onSubmit={values=>{
                        console.log("submitted")
                        console.log(values)
                        console.log("calling validate function")
                        onSumbmit(values)
                    }}
                    >
                        { props =>(
                            <Form noValidate>

                                <CentralBlockItem style={{marginBottom: "30px"}}>

                                    <AvatarCircleButton onClick={avatarClick} image={avatarFile} />

                                    <input id="upload" 
                                    ref={avatarRef} 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(event)=> { 
                                        setAvatarFile(event.target.files[0])
                                    }}
                                    onClick={(event)=> { 
                                        event.target.value = null
                                    }}
                                    style={{display: "none"}}
                                />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <InputField1 type="text" 
                                                name="firstName" 
                                                value={props.values.firstName} 
                                                placeholder="First name*" 
                                                isValid={isFirstNameValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <InputField1 type="text" 
                                                name="lastName" 
                                                value={props.values.lastName} 
                                                placeholder="Last name*" 
                                                isValid={isLastNameValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <InputField1 type="text" 
                                                name="username" 
                                                value={props.values.username} 
                                                placeholder="Username*"
                                                isValid={isUsernameValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem style={{marginTop: "20px"}}>
                                    <InputField1 type="text" 
                                                name="workplace" 
                                                value={props.values.workplace} 
                                                placeholder="Workplace"
                                                isValid={true}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <InputField1 type="text" 
                                                name="position" 
                                                value={props.values.position} 
                                                placeholder="Position" 
                                                isValid={true}
                                    />
                                </CentralBlockItem>
                                
                                <CentralBlockItem style={{marginTop: "20px"}}>
                                    <InputField1 type="email" 
                                                name="email" 
                                                value={props.values.email} 
                                                placeholder="Enter your email*"
                                                isValid={isEmailValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <InputField1 type="password" 
                                                name="password" 
                                                value={props.values.password} 
                                                placeholder="Come up with a password*"
                                                isValid={isPasswordValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem style={{marginTop: "30px"}}>
                                    <RectButton1 buttonText={"Sign Up"} onClick={props.handleSubmit} />
                                </CentralBlockItem>

                                <CentralBlockItem style={{marginTop: "30px"}} >
                                    <TextButton1 buttonText="Back to login" onClick={returnToLogin} />
                                </CentralBlockItem>

                            </Form>
                        )}
                </Formik>

            </CentralBlockWrapper>
        </ContainerWrapper>
    )
}

const ContainerWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
`

const CentralBlockWrapper = styled.div`

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    text-align: center;

`

const CentralBlockItem = styled.div`
    margin: 5px auto;
`

const AvatarButtonWrapper = styled.div`
    margin: auto;

    opacity: ${props => props.tapped ? "0.8" : "1"};
    transform: scale(${props => props.tapped ? "0.95" : "1"});

    border-radius: 50%;
    height: ${props => props.large ? "300px" : "150px"};
    width: ${props => props.large ? "300px" : "150px"};
    background-color: ${Colors.lightgray};

    box-shadow: 0px 0px 5px ${Colors.shadow};

    transition: all .3s ease-in-out;

    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;

    cursor: pointer;

    :hover {
        box-shadow: 0px 0px 15px ${Colors.shadow};
    }

`

const AvatarButtonText = styled(B4)`
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const AvatarPreview = styled.img`
    position: relative;
    height: ${props => props.large ? "300px" : "150px"};
    width: ${props => props.large ? "300px" : "150px"};
    border-radius: 50%;
    object-fit: contain;
`

