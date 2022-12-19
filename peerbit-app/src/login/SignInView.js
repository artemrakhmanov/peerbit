import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";

import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton1, TextButton2 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { B5T, T1, B3 } from "../designsystem/TypographyStyles";
import { InputField1 } from "../designsystem/Fields";

import { CurrentLoginScreen } from "./LoginView";
import { useHistory } from "react-router";

import { useState } from "react";
import { logIn, validateSignInCredentials } from "../viewmodels/Auth";
export default function SignInView(props) {

    const history = useHistory()

    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)

    function openSSOPage() {
        history.push(CurrentLoginScreen.SSOIN)
    }

    function openForgotPasswordPage() {
        history.push(CurrentLoginScreen.FORGOT)
    }

    function openSignupPage() {
        history.push(CurrentLoginScreen.SIGNUP)
    }

    function onSignInSubmit(values) {
        //reset invalid field highlights
        setIsEmailValid(true)
        setIsPasswordValid(true)
        
        const invalidFields = validateSignInCredentials(values.email, values.password)
        if (invalidFields.length > 0) {
            //invalid, highlight invalid fields
            invalidFields.forEach((invalidField) => {
                switch(invalidField) {
                    case 0:
                        setIsEmailValid(false)
                        alert("Invalid Email!")
                        break;
                    case 1:
                        setIsPasswordValid(false)
                        alert("Invalid Password!")
                        break;
                }
            })
        } else {
            //valid, log in via firebase auth
            logIn(values.email, values.password)
            .catch(e => {
                alert("Incorrect Email or Password!")
                setIsEmailValid(false)
                setIsPasswordValid(false)
            })
        }
    }

    return(
        <SignInViewWrapper>

                    <SignInCentralBlockWrapper>

                        <Formik 
                            initialValues={{email: "", password: ""}}
                            onSubmit={values=>{
                                console.log("submitted")
                                console.log(values)
                                onSignInSubmit(values)
                            }}
                        >
                            { props =>(
                                <Form noValidate>
                                    
                                    <SignInCentralBlockItem>
                                        <InputField1 type="email" 
                                                    name="email" 
                                                    value={props.values.name} 
                                                    placeholder="Enter your email"
                                                    isValid={isEmailValid}
                                        />
                                    </SignInCentralBlockItem>

                                    <SignInCentralBlockItem>
                                        <InputField1 type="password" 
                                                    name="password" 
                                                    value={props.values.name} 
                                                    placeholder="Enter your password" 
                                                    isValid={isPasswordValid}
                                        />
                                    </SignInCentralBlockItem>

                                    <SignInCentralBlockItem>
                                        <RectButton1 buttonText={"Sign In"} onClick={props.handleSubmit} />
                                    </SignInCentralBlockItem>

                                </Form>
                            )}
                        </Formik>

                        <SignInCentralBlockItem>
                            <B5T>or log in with</B5T>
                        </SignInCentralBlockItem>

                        <SignInCentralBlockItem>
                            <RectButton3 
                                buttonText={"SSO"} 
                                onClick={openSSOPage} 
                            />
                        </SignInCentralBlockItem>

                        {/* <SignInCentralButtonRowWrapper>
                            <SignInCentralButtonRowItem>
                                <RectButton4 buttonText={"GGLE"} />
                            </SignInCentralButtonRowItem>

                            <SignInCentralButtonRowItem>
                                <RectButton4 buttonText={"GIT"} />
                            </SignInCentralButtonRowItem>

                            <SignInCentralButtonRowItem>
                                <RectButton4 buttonText={"MSOFT"} />
                            </SignInCentralButtonRowItem>
                        </SignInCentralButtonRowWrapper> */}

                    </SignInCentralBlockWrapper>

                    <SignInBottomBlockWrapper>

                        <SingInBottomBlockItem>

                            <RectButton2 
                                buttonText={"Sign Up"} 
                                onClick={openSignupPage} 
                            />

                        </SingInBottomBlockItem>

                        <SingInBottomBlockItem>

                            <TextButton1 
                                buttonText={"Forgot Password?"} 
                                onClick={openForgotPasswordPage}
                            />

                        </SingInBottomBlockItem>

                    </SignInBottomBlockWrapper>

                </SignInViewWrapper>
    )
}

const SignInViewWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
`

const SignInCentralBlockWrapper = styled.div`

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    text-align: center;

`

const SignInCentralBlockItem = styled.div`
    margin: 5px auto;
`

const SignInCentralButtonRowWrapper = styled.div`
    display: block;
`

const SignInCentralButtonRowItem = styled.div`
    display: inline-block;
    margin: 0px 2.5px;
`

// const InputField = styled(Field)`
//     width: 220px;
//     height: 45px;
//     box-sizing: border-box;
//     -moz-box-sizing: border-box;
//     -webkit-box-sizing: border-box;
//     background-color: ${Colors.white};
//     border: 1px solid ${Colors.gray};
//     border-radius: 5px;
//     font-size: 16px;
//     font-weight: 400;
// `




const SignInBottomBlockWrapper = styled.div`
    position: absolute;
    bottom: 80px;
    height: 100px;
    left: 50%;
    transform: translate(-50%, 0);

    display: block;
    justify-content: center;
    align-items: center;

`

const SingInBottomBlockItem = styled.div`
    margin: 30px auto;
`