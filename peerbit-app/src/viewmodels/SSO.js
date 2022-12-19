import { redirectCodeSubmission } from "../reducers/redirectReducer";
import store from "../reducers/store";
import { getUserToken, logIn } from "./Auth";


export async function handleSSOWhenLoggedIn(fromJournalURL, ssoRequestState, window) {

    if (!fromJournalURL || !ssoRequestState) {
        throw new Error("invalid sso path: include a callback url and a state")
    }

    getUserToken()
        .then((token) => {
            console.log("calling window open")
            window.location.href = (fromJournalURL + "/api/sg/sso/callback?token=" + token + "&state=" + ssoRequestState)
        })
        .catch(e=> {
            return e
        })
}

export async function handleSSOLogin(
    email,
    password,
    fromJournalURL, 
    ssoRequestState
    )  {
    // set a redirect path to the sso redirector
    store.dispatch(redirectCodeSubmission("/sso?from=" + fromJournalURL + "&state=" + ssoRequestState))

    return new Promise((resolve, reject)=> {
        //attempt login
        try {
            logIn(email, password)
            .catch(error=> {
                reject(new Error("hgey"))
            })
            console.log("logged in")
            resolve(true) 
        } catch (error) {
            console.log("error in login", error)
            reject()
        }
    })
}