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

let clientURL = "https://peerbit-6557f.web.app"
let clientAPI = "https://ar303.host.cs.st-andrews.ac.uk/webapi"

export default function SSOInPage() {

    const history = useHistory()

    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result;
    }

    function redirectToSelectedJournal(url) {
        const homeJournalURL = url ? url : clientAPI
        // create and store state value in a cookie
        const state = makeid(5)

        const cookieContents = {
            from: homeJournalURL,
            state: state
        }
        let d = new Date();
        let minutes = 20
        d.setTime(d.getTime() + (minutes*60*1000));
        const cookies = new Cookies();
        const oldSSOCookie = cookies.get("sso")
        if (oldSSOCookie) {
            console.log("HAD OLD SSO COOKIE")
            console.log(oldSSOCookie)
            cookies.remove("sso")
        }
        cookies.set("sso", cookieContents, {path: "/", expires: d})
        // redirect
        const redirectURL = 
            homeJournalURL + "/api/sg/sso/login?from=" 
            + clientURL 
            + "&state=" + state

        window.location.href = redirectURL
    }

    function parseURL(url) {
        const noHttp = url.slice(8)
        const noAfterDot = noHttp.split(".")[0]

        const result = noAfterDot
        return result
    }

    return (
        <DummyContainerWrapper>
            <DummyCentralBlockWrapper>
                {/* <RectButton2 
                    buttonText={"Login via " + parseURL("https://cs3099user27.host.cs.st-andrews.ac.uk")} 
                    onClick={()=> {
                        const url = "https://cs3099user27.host.cs.st-andrews.ac.uk"
                        redirectToSelectedJournal(url)
                }} />
                <div style={{height: "10px"}}/> */}
                <RectButton1 
                    buttonText={"Login via test"} 
                    onClick={()=> {
                        redirectToSelectedJournal()
                }} />
                <div style={{height: "20px"}}/>
                <TextButton1 
                    buttonText={"Back to login"} 
                    onClick={()=> {
                        history.push("/login")
                    }}
                />
            </DummyCentralBlockWrapper>
        </DummyContainerWrapper>
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