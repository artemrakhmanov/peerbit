import React from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import { useState, useEffect } from "react";

import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton1, TextButton2 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { B5T, T1, B3 } from "../designsystem/TypographyStyles";
import { InputField1 } from "../designsystem/Fields";
import { useHistory, useLocation } from "react-router";

import Cookies from 'universal-cookie';
import LoadingScreen from "../components/LoadingScreen";
import { createUser, logInWithToken } from "../viewmodels/Auth";
import { addNewUser } from "../viewmodels/UserDBQueries";

const apiURL = "https://ar303.host.cs.st-andrews.ac.uk/webapi"
const otherURL = "https://7da2-138-251-172-37.ngrok.io"

export default function CallbackView() {

    const history = useHistory()
    const location = useLocation()

    const ssoState = new URLSearchParams(location.search).get("state")
    const token = new URLSearchParams(location.search).get("token")

    function parseURL(url) {

        const noHttp = url.slice(8)
        const noAfterDot = noHttp.split(".")[0]

        const result = noAfterDot
        return result
    }

    const [madeRequest, setMadeRequest] = useState(false)

    const [showError, setShowError] = useState(false)
    const [showNewUserForm, setShowNewUserForm] = useState(false)
    const [email, setEmail] = useState("")
    const [externalID, setExternalID] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const [isUsernameValid, setIsUsernameValid] = useState(true)

    function handleCallback() {

        if (!ssoState || !token) {
            setShowError(true)
            return
        }

        // check cookie against state
        const cookie = new Cookies().get("sso")
        if (!cookie) {
            // no cookie
            console.log("no cookie")
            setShowError(true)
            return
        }

        const fromURL = cookie.from
        const cookieState = cookie.state

        if (ssoState !== cookieState) {
            console.log("states do not match")
            setShowError(true)
            return
        }

        console.log("states match")

        // check token against verify
        // const fakeToken = "djslkdsjlds"
        const verifyURL = apiURL + "/api/sg/sso/verify" + "?token=" + token
        // const verifyURL = fromURL + "/api/sg/sso/verify" + "?token=" + token
        try {
            fetch(
                verifyURL,
                {
                    method: "POST"
                }
            )
            .then(response=> {
                response.json()
                .then(data=> {
                    console.log(data)
                    if (data.status === "error") {
                        setShowError(true)
                        return
                    } else {
                        // show form to create user
                        setEmail(data.email)
                        setExternalID(data.id)
                        const [first, last] = data.name.split(" ")
                        setFirstName(first)
                        setLastName(last)

                        const username = "user" + ssoState
                        
                        const createUserURL = apiURL + "/api/sg/sso/createuser" + "?email=" + email + "&uid=" + externalID

                        fetch(createUserURL,{method: "GET"})
                        .then((userResponse)=> {
                            userResponse.json()
                            .then((user)=> {
                                if (user.status === "oknew") {
                                    console.log("new user")
                                    // add new info, ask for token, login

                                    addNewUser(null, firstName, lastName, username, "", "", externalID)
                                    
                                    logInWithToken(user.token)
                                    .then((user)=> {
                                        console.log(user)
                                        console.log("yay authenticated")
                                    })
                                    .catch((error)=> {
                                        setShowError(true)
                                        return
                                    })

                                } else if (user.status === "okexists") {
                                    console.log("user exists")
                                    // log in
                                    logInWithToken(user.token)
                                    
                                } else {
                                    console.log("error in create user endpoint")
                                }
                            })
                        })
                        .catch((error)=> {
                            setShowError(true)
                            return
                        })
                    }
                })
            })
            .catch(error=> {
                setShowError(true)
                console.log("error")
            })
        } catch (e) {
            setShowError(true)
            return
        }
        // show form to add missing details
    }

    useEffect(() => {
        if (!madeRequest) {
            handleCallback()
            setMadeRequest(true)
        }
    })

    return (
        <div>
            {
            // showError
            false
            ?
            <DummyContainerWrapper>
                <DummyCentralBlockWrapper>
                    <div>
                        <T1>Error trying to log in from external journal</T1>
                        <div style={{height: "20px"}}/>
                        <TextButton1 
                            buttonText={"Back to login"} 
                            onClick={()=> {
                                history.push("/login")
                            }}
                        />
                    </div>
                </DummyCentralBlockWrapper>
            </DummyContainerWrapper>
            :
            <LoadingScreen /> 
            // (
            //     // showNewUserForm
            //     true
            //     ?
            //     <DummyContainerWrapper>
            //     <DummyCentralBlockWrapper>
            //         <div>
            //             <T1>Come up with a username:</T1>
            //             <div style={{height: "50px"}}/>

            //             <Formik
            //                 initialValues={{
            //                     username: ""
            //                 }}
            //                 onSubmit={values=>{
            //                     setIsUsernameValid(true)
            //                     if (values.username.length > 0) {
            //                         //call create user and sign in
            //                     } else {
            //                         setIsUsernameValid(false)
            //                     }
            //                 }}
            //             >
            //                 {props=> (
            //                     <Form noValidate>

            //                         <InputField1 
            //                             type="text" 
            //                             name="username" 
            //                             value={props.values.username} 
            //                             placeholder="Username*"
            //                             isValid={isUsernameValid}
            //                         />

            //                         <div style={{height: "10px"}}/>

            //                         <RectButton1 
            //                             buttonText={"Log in"}
            //                             onClick={props.handleSubmit}
            //                         />
            //                     </Form>
            //                 )}
            //             </Formik>

            //             <div style={{height: "50px"}} />

            //             <TextButton1 
            //                 buttonText={"Back to login"} 
            //                 onClick={()=> {
            //                     history.push("/login")
            //                 }}
            //             />
            //         </div>
            //     </DummyCentralBlockWrapper>
            // </DummyContainerWrapper>
            //     :
            //     <LoadingScreen /> 
            //     )
            }
        </div>
        
    )
}

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