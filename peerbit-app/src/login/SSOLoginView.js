import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import { useState, useEffect } from "react";

import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton1, TextButton2 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { B5T, T1, B3 } from "../designsystem/TypographyStyles";
import { InputField1 } from "../designsystem/Fields";
import { useLocation } from "react-router";
import { handleSSOLogin } from "../viewmodels/SSO";

export default function SSOLoginView() {

    const search = useLocation().search;

    const [homeJournalName, setHomeJournalName] = useState("")
    const [ssoState, setSsoState] = useState("<state>")
    const [homeJournalURL, setHomeJournalURL] = useState("homeurl.com")

    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)

    function getUrlParameters() {
        const fromURL = new URLSearchParams(search).get('from')
        setHomeJournalURL(fromURL)
        setSsoState(new URLSearchParams(search).get('state'))
    }

    useEffect(()=> {
        const fromURL = new URLSearchParams(search).get('from')
        if (typeof fromURL === 'undefined') {return}
        setHomeJournalName(fromURL)
    })

    // function parseURL(url) {
    //     if (typeof url === 'undefined') {
    //         return;
    //     }
    //     // const noHttp = url.slice(8)


    //     const result = noAfterDot
    //     return result
    // }

    return(
        <ContainerWrapper>

            <UpperBlockWrapper>
                <T1>Sign in to {homeJournalName}<br />with peerbit</T1>
            </UpperBlockWrapper>
            
            <CentralBlockWrapper>
                <Formik 
                    initialValues={{email: "", password: ""}}
                    onSubmit={values=>{
                        console.log("onsubmit")
                        setIsPasswordValid(true)
                        setIsEmailValid(true)
                        if (values.email.length === 0 || values.password.length === 0) {
                            if (values.email.length == 0) {
                                setIsEmailValid(false)
                            }
                            if (values.password.length == 0) {
                                setIsPasswordValid(false)
                            }
                            return
                        } else {
                            //submit
                            handleSSOLogin(values.email, values.password, homeJournalURL, ssoState)
                                .then((response)=> {
                                    console.log("response from handle sso login")
                                })
                                .catch(error=> {
                                    console.log("error from handlesso login", error)
                                    setIsEmailValid(false)
                                    setIsPasswordValid(false)
                                })
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
                                                isValid={isEmailValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <InputField1 type="password" 
                                                name="password" 
                                                value={props.values.name} 
                                                placeholder="Enter your password" 
                                                isValid={isPasswordValid}
                                    />
                                </CentralBlockItem>

                                <CentralBlockItem>
                                    <RectButton1 buttonText={"Sign In"} onClick={props.handleSubmit} />
                                </CentralBlockItem>

                                <CentralBlockItem style={{marginTop: "30px"}} >
                                    <TextButton1 buttonText="Forgot password?" onClick={() => {
                                        getUrlParameters()
                                        console.log(homeJournalURL)
                                        console.log(ssoState)
                                    }}/>
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