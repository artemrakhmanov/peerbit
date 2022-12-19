import { useEffect, useState } from "react";
import { useHistory } from "react-router"
import { handleSSOWhenLoggedIn } from "../viewmodels/SSO";
import { useLocation } from "react-router";
import { B2 } from "../designsystem/TypographyStyles";


export default function SSOCallbackRedirector() {

    const history = useHistory();
    const location = useLocation()
    const fromJournalURL = new URLSearchParams(location.search).get('from')
    const ssoState = new URLSearchParams(location.search).get('state')

    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [madeRequest, setMadeRequest] = useState(false)

    useEffect(() => {
        if (!madeRequest) {
            setMadeRequest(true)
            completeSSOLogin()
        }
    })
        
    function completeSSOLogin() {
        handleSSOWhenLoggedIn(fromJournalURL, ssoState, window)
            .then(() => {
              console.log("successfully ssoed")
            })
            .catch((e) => {
              console.log(e)
              setErrorMessage(e)
              setShowError(true)
            //   history.push("/discover")
            })
    }
    
    return (
        <B2 style={{
            textAlign: "center",
            lineHeight: "100vh",
            whiteSpace: "nowrap",
            overflow: "hidden"
        }}>
            {showError
            ?
            "SSO Login error: " + errorMessage
            :
            "Logging in via peerbit to: " + fromJournalURL
            }
        </B2>
    )
}