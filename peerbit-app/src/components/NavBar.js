import React from "react";
import { Route, Switch } from "react-router";
import { NavLink, BrowserRouter } from "react-router-dom";
import styled from 'styled-components';
import { S2 } from "../designsystem/TypographyStyles";

import logo1 from "../assets/branding/logo1.png"
import account1 from "../assets/branding/account1.jpg"
import { Colors } from "../designsystem/ColorStyles";

import { useState, useEffect } from "react";
import { TextButton1, TextButton2 } from "../designsystem/Buttons";
import { useHistory } from "react-router";
import { logOut } from "../viewmodels/Auth";
import { getUserData } from "../viewmodels/UserDBQueries";
import store from "../reducers/store";
import nouserImage from "../assets/branding/nouser.png"

import { WidthAdjustmentDiv } from "../designsystem/GlobalStyles";

function NavBar() {

    const history = useHistory()

    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

    const nonactiveStyle = {
        opacity: "50%"
    }

    const activeStyle = {
        opacity: "100%"
    }

    const textButtonStyle = {
        lineHeight: "50px"
    }

    function toggleMenuVisibility() {
        if (isAccountMenuOpen) {
            console.log("closing menu ")
            setIsAccountMenuOpen(false)
        } else {
            console.log("opening menu ")
            setIsAccountMenuOpen(true)
        }
    }

    function goToAccountPage() {
        toggleMenuVisibility()
        history.push("/account")
    }

    function goToSettingsPage() {
        toggleMenuVisibility()
        history.push("/account/settings")
    }

    function onLogOut() {
        toggleMenuVisibility()
        logOut()
    }

    useKeypress('Escape', () => {
        setIsAccountMenuOpen(false)
    })

    const [profileURL, setProfileURL] = useState(nouserImage)
    const [madeRequest, setMadeRequest] = useState(false)

    useEffect(() => {
        if (!madeRequest) {
            const uid = store.getState().login.value.uid
            console.log("UIDDIDIDID")
            console.log(uid)
            if (uid.length > 0) {
                getUserData()
                .then(data=> {
                    console.log("NAVBARRRRRR", data)
                    const url = data.profileURL
                    console.log("NAVBA", url.length > 0)
                    if (url.length > 0) {
                        console.log("setting real url")
                        console.log("navbarURL", url)
                        setProfileURL(url)
                    } else {
                        console.log("setting no user image")
                        setProfileURL(nouserImage)
                    }
                })
            } else {
                setTimeout(()=> {
                    getUserData()
                    .then(data=> {
                        console.log("NAVBARRRRRR", data)
                        // setProfileURL(data.profileURL)
                        const url = data.profileURL
                        console.log("NAVBA", url.length > 0)
                        if (url.length > 0) {
                           console.log("setting real url")
                           console.log("navbarURL", url)
                           setProfileURL(url)
                        } else {
                           console.log("setting no user image")
                           setProfileURL(nouserImage)
                        }
                    })
                }, 1000)
            }
            setMadeRequest(true)
        }
    }, [])

    return (
        <NavbarWrapper>

            <NavWrapper>
    
                <AccountMenuWrapper show={isAccountMenuOpen}>

                    <AccountMenuButtonWrapper 
                        style={{
                                position: "fixed",
                                right: "12px",
                                top: "7px"
                            }}
                    >
                        <TextButton2 
                            buttonText={"Account page"} 
                            onClick={goToAccountPage}
                        />
                    </AccountMenuButtonWrapper>

                    <Divider 
                        style={{
                            position: "fixed",
                            right: "25px",
                            top: "32px"
                        }}
                    />

                    <AccountMenuButtonWrapper 
                        style={{
                                position: "fixed",
                                right: "12px",
                                top: "38px"
                            }}
                    >
                        <TextButton2 
                            buttonText={"Settings"} 
                            onClick={goToSettingsPage}
                        />
                    </AccountMenuButtonWrapper>

                    <Divider 
                        style={{
                            position: "fixed",
                            right: "25px",
                            top: "64px"
                        }}
                    />

                    <AccountMenuButtonWrapper 
                        style={{
                                position: "fixed",
                                right: "12px",
                                top: "70px"
                            }}
                    >
                        <TextButton2 
                            buttonText={"Log out"} 
                            onClick={onLogOut}
                        />
                    </AccountMenuButtonWrapper>
                </AccountMenuWrapper>

                {true
                ?
                <AccountThumbnail src={profileURL} func={toggleMenuVisibility} />
                :
                <div />
                }

                <LogoWrapper src={logo1} />
                
                <NavLink exact to="/discover" style={nonactiveStyle} activeStyle={activeStyle}>
                    <NavPageButton>
                        <S2 style={textButtonStyle}>Discover</S2>
                    </NavPageButton>
                </NavLink>

                <NavLink exact to="/publish" style={nonactiveStyle} activeStyle={activeStyle}>
                    <NavPageButton>
                        <S2 style={textButtonStyle}>Publish</S2>
                    </NavPageButton>
                </NavLink>

                <NavLink exact to="/review" style={nonactiveStyle} activeStyle={activeStyle}>
                    <NavPageButton>
                        <S2 style={textButtonStyle}>Review</S2>
                    </NavPageButton>
                </NavLink>

            </NavWrapper>

            {/* <TapAwayComponent isOpen={isAccountMenuOpen} onClick={toggleMenuVisibility} /> */}

        </NavbarWrapper>
    )
}

function AccountThumbnail(props) {

    const [tapped, setTapped] = useState(false)

    function tap() {
        console.log("tapped")
        setTapped(true)
        setTimeout(() => {
            setTapped(false)
            props.func()
        }, 200)
    }

    return(
        <AccountThumbnailImg 
            src={props.src} 
            onClick={tap} 
            tapped={tapped}
        />
    )
}

//keypress hook: https://www.caktusgroup.com/blog/2020/07/01/usekeypress-hook-react/
export function useKeypress(key, action) {
    useEffect(() => {
      function onKeyup(e) {
        if (e.key === key) action()
      }
      window.addEventListener('keyup', onKeyup);
      return () => window.removeEventListener('keyup', onKeyup);
    }, []);
}

const NavbarWrapper = styled.div`
    position: absolute;
    top: 0;
    width: 100px;
    max-width: 100%;
    max-height:100%;
`

const NavWrapper = styled(WidthAdjustmentDiv)`
    position: fixed;
    height: 50px;
    display: block;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
`

const NavPageButton = styled.div`
    display: inline-block;
    position: relative;
    height: 50px;
    width: 100px;
    text-align: center;
    opacity: 100%;

    transition: all .3s ease-in-out;

    :hover {
        opacity: 75%;
    }
`

const LogoWrapper = styled.img`
    display: inline-block;
    position: relative;
    object-fit: contain;
    width: 90px;
    top: 18%;
    margin: 0px 18px;
`

const AccountThumbnailImg = styled.img`
    position: absolute;
    z-index: 6;
    object-fit: contain;
    right: 10px;
    top: 5px;
    width: 40px;
    height: 40px;
    background-color: gray;
    border-radius: 50%;

    scale: ${props => props.tapped ? "95%" : "100%"};

    opacity: ${props => props.tapped ? "20%" : "100%"};

    box-shadow: 0px 2px 5px ${Colors.shadow};

    transition: all .3s ease-in-out;

    cursor: pointer;

    :hover {
        box-shadow: 0px 2px 10px ${Colors.gray};
    }
`

const AccountMenuWrapper = styled.div`
    position: fixed;
    display: block;
    /* z-index: 2; */

    visibility: ${props => props.show ? "visible" : "hidden"};

    right: 10px;
    top: 55px;
    width: 100px;
    height: 100px;
    background-color: rgba(242, 242, 242, 0.5);
    backdrop-filter: blur(3px);
    border-radius: 10px;
    box-shadow: 0px 5px ${props => props.show ? "10px" : "0px"} ${Colors.gray};

    opacity: ${props => props.show ? "100%" : "0%"};

    filter: blur(${props => props.show ? "0px" : "5px"});
    transform: 
        translateY(${props => props.show ? "0" : "-50px"}) 
        rotateX(${props => props.show ? "0" : "-30deg"});

    transition: all .3s ease-in-out;

`

const Divider = styled.div`
    width: 50px;
    height: 1px;
    background-color: ${Colors.gray};
`

const AccountMenuButtonWrapper = styled.div`
    align-items: flex-start;
    /* z-index: 2; */
    width: 100px;
    height: 31 px;
    /* border: 1px solid red; */
`

const TapAwayComponent = styled.div`
    z-index: -1;
    position: fixed;
    height: 100%;
    width: 100%;

    display: ${props => props.isOpen ? "block" : "none"};


`

export default NavBar;