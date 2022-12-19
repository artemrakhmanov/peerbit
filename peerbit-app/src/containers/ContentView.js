import React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Redirect } from "react-router";
import NavBar from "../components/NavBar";
import AccountPageView from "../pages/AccountPageView";
import DiscoverPageView from "../pages/DiscoverPageView";
import PublishPageView from "../pages/PublishPageView";
import ReviewPageView from "../pages/ReviewPageView";
import ReviewLearnPageView from "../pages/ReviewLearnPageView";
import DiscoverSubmissionPageView from "../pages/DiscoverSubmissionPageView";
import { CodeView } from "../codeview/CodeView";
import { handleSSOWhenLoggedIn } from "../viewmodels/SSO";
import { CurrentLoginScreen } from "../login/LoginView";
import { useState } from "react";
import { T1, B2T, B2 } from "../designsystem/TypographyStyles";
import SSOCallbackRedirector from "../login/SSOCallbackRedirector";
import { useSelector } from "react-redux";
import store from "../reducers/store";
import { redirectCodeSubmission, reset } from "../reducers/redirectReducer";
import SettingsPageView from "../pages/SettingsPageView";
import LoadingScreen from "../components/LoadingScreen";
import SSOInPage from "../login/SSOInPage";
import SSOLoginView from "../login/SSOLoginView";

function ContentView() {

    const location = useLocation();

    const initialPath = useSelector(state => state.redirect.value)
    const uid = useSelector(state => state.login.value.uid)

    function redirect() {
      if (initialPath.length > 0) {
        console.log(uid)
        const path = initialPath
        console.log(path)
        console.log("REDIRECTING?")
        store.dispatch(reset())
        return <Redirect to={path.length > 0 ? path : "/discover"}/>
      }
    }

    return (
        <div>

        <Route path="/" render={() => redirect()} />

        <Route path={CurrentLoginScreen.LOGIN} render={() => redirect()} />

        <Route path={CurrentLoginScreen.SIGNUP} render={() => redirect()} />

        <Switch>
            <Route path="/discover" component={DiscoverPageView} />
            <Route path="/publish" component={PublishPageView} />
            <Route path="/review" component={ReviewPageView} />
            <Route path="/SubmissionsToReview" component={DiscoverSubmissionPageView} />
            <Route path="/LearnMore" component={ReviewLearnPageView} />

            <Route path={CurrentLoginScreen.SSO} component={SSOLoginView} />
            <Route path={CurrentLoginScreen.SSOIN} component={SSOInPage} />
            <Route path={CurrentLoginScreen.CALLBACK} component={SSOCallbackRedirector} />



            {/* <Route path={CurrentLoginScreen.SSO} component={SSOLoginView}/>
            <Route path={CurrentLoginScreen.CALLBACK} component={SSOCallbackRedirector}/> */}

            <Route path={"/code"} component={CodeView} />
            {/* switch renders first match, nested should go before roots */}
            <Route path="/account/settings" component={SettingsPageView} />

 


            <Route path="/" component={AccountPageView} />

            {/* Catches invalid paths and redirects to /login */}
            {/* <Route render={() => {
                    return <Redirect to={{pathname: "/discover"}} />}
            } 
            /> */}

        </Switch>

            {(!location.pathname.includes("sso")) ? <NavBar /> : null}

        </div>
    )
}

export default ContentView;