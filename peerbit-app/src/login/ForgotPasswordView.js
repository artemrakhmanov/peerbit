import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import { useState } from "react";

import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton1, TextButton2 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { resetPassword } from "../viewmodels/Auth";
import { B5T, T1, B3 } from "../designsystem/TypographyStyles";
import { InputField1 } from "../designsystem/Fields";
import { useHistory } from "react-router";
import { CurrentLoginScreen } from "./LoginView";

export default function ForgotPasswordView() {

    const history = useHistory()

    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState("")

    const [isEmailValid, setIsEmailValid] = useState(true)

    const [emailFormError, setEmailFormError] = useState(false)

    function backToLogin() {
        console.log("back?");
        history.push(CurrentLoginScreen.LOGIN)
    }
    
    return(
        <ContainerWrapper>
        
            <UpperBlockWrapper>
                <T1>{emailSent ? "If account exists, then a link has been provided to reset password to " + email : "Forgot Password?"}</T1>
            </UpperBlockWrapper>

            <UpperMiddleBlockWrapper style={{visibility: emailSent ? "visible" : "hidden"}}>
                <TextButton1 
                buttonText={"Wrong email?" } 
                onClick={()=>{
                    setEmailSent(false)
                }}
                />
            </UpperMiddleBlockWrapper>

            <CentralBlockWrapper>
                <Formik 
                    initialValues={{email: ""}}
                    onSubmit={values=>{
                        if (values.email.length > 0) {
                            console.log("submitted")
                            console.log(values)
                            setEmail(values.email)
                            setEmailSent(true)
                            resetPassword(values.email)
                        } else {
                            setEmailFormError(true)
                        }
                    }}
                    >
                        { props =>(
                            <Form noValidate>
                                
                                <CentralBlockItem>
                                    <InputField1 type="email" 
                                                name="email" 
                                                value={props.values.name} 
                                                placeholder="Enter your email" 
                                                style={{
                                                    visibility: emailSent ? "hidden" : "visible",
                                                    borderColor: emailFormError ? Colors.red : Colors.gray
                                                }}
                                                isValid={isEmailValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <RectButton1 
                                    buttonText={emailSent ? "Back to login" : "Send Reset Link"} 
                                    onClick={emailSent ?  backToLogin : props.handleSubmit} />
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

const UpperBlockWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%, -20%);

    text-align: center;
`

const UpperMiddleBlockWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -30%);

    text-align: center;
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