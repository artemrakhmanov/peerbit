import React from "react";
import styled from "styled-components";

import logo1 from "../assets/branding/logo1.png"
import { RectButton1, RectButton2, RectButton3, RectButton4, TextButton2 } from "../designsystem/Buttons";
import { Colors } from "../designsystem/ColorStyles";
import { B5T, T1 } from "../designsystem/TypographyStyles";
import SignInView from "./SignInView";
import { useState } from "react";

import { Switch, Route, Redirect, useLocation } from "react-router";
import SSOLoginView from "./SSOLoginView";
import ForgotPasswordView from "./ForgotPasswordView";
import SignUpView from "./SignUpView";

import { useSelector } from "react-redux";
import { redirectPublish, redirectDiscover, redirectReview, redirectAccount, redirectCodeSubmission } from "../reducers/redirectReducer";

import store from '../reducers/store';
import SSOInPage from "./SSOInPage";
import CallbackView from "./CallbackView";

export const CurrentLoginScreen = {
    LOGIN: "/login",
    SIGNUP: "/join",
    FORGOT: "/forgotpassword",
    SSO: "/sso",
    SSOIN: "/ssoin",
    CALLBACK: "/callback"
}

export function LoginView() {

    const loggedIn = useSelector(state => state.login.value)

    const [currentLoginScreen, setCurrentLoginScreen] = useState(CurrentLoginScreen.LOGIN)

    const location = useLocation()
    // const url = new URLSearchParams(location.search)

    return (
        <ContainerWrapper>

        <Route exact path="/" render={() => {
          store.dispatch(redirectDiscover())
          return <Redirect to={CurrentLoginScreen.LOGIN}/>
        }} />

        <Route exact path="/discover" render={() => {
          store.dispatch(redirectDiscover())
          return <Redirect to={CurrentLoginScreen.LOGIN}/>
        }} />

        <Route exact path="/publish" render={() => {
          store.dispatch(redirectPublish())
          return <Redirect to={CurrentLoginScreen.LOGIN}/>
        }} />

        <Route exact path="/review" render={() => {
          store.dispatch(redirectReview())
          return <Redirect to={CurrentLoginScreen.LOGIN}/>
        }} />

        <Route exact path="/account" render={() => {
          store.dispatch(redirectAccount())
          return <Redirect to={CurrentLoginScreen.LOGIN}/>
        }} />

        {/* add route for code submission urls */}

            <LogoWrapper src={logo1} />

            {/* switch would handle states of the login screen from here */}
            <ViewsWrapper>

                <Switch>

                    <Route path={CurrentLoginScreen.LOGIN} component={SignInView}/>
                    <Route path={CurrentLoginScreen.SIGNUP} component={SignUpView} />
                    <Route path={CurrentLoginScreen.FORGOT} component={ForgotPasswordView} />
                    <Route path={CurrentLoginScreen.SSO} component={SSOLoginView} />
                    <Route path={CurrentLoginScreen.SSOIN} component={SSOInPage} />
                    <Route path={CurrentLoginScreen.CALLBACK} component={CallbackView} />

                    {/* Catches invalid paths and redirects to /login */}
                    <Route render={() => {
                      const inputPath = location.pathname + location.search
                      console.log(inputPath + " to be redirected to")
                      store.dispatch(redirectCodeSubmission(inputPath))
                      return <Redirect to={{pathname: CurrentLoginScreen.LOGIN}} />}
                    } 
                    />
                </Switch>

            </ViewsWrapper>

        </ContainerWrapper>
    )
}

const ContainerWrapper = styled.div`
    width: 100%;
    height: 100vh;
`

const LogoWrapper = styled.img`
    position: absolute;
    width: 75px;
    margin: 10px auto;
    left: 50%;
    transform: translate(-50%, 0);
    justify-content: center;
    text-align: center;
`

const ViewsWrapper = styled.div`
    
`
