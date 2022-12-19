import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { css } from "styled-components";
import { Colors } from "./ColorStyles";
import { T1, T3, S3, B3, B3T, B4, B5T } from "../designsystem/TypographyStyles";
import { useState } from "react";

import blackDeleteGlyph from '../assets/glyphicons/blackDeleteGlyph.png';
import commentsGlyph from '../assets/glyphicons/commentsGlyph.png';
import editorsNeededGlyph from '../assets/glyphicons/editorsNeededGlyph.png';
import expandGlyph from '../assets/glyphicons/expandGlyph.png';
import filesGlyph from '../assets/glyphicons/filesGlyph.png';
import folderGlyph from '../assets/glyphicons/folderGlyph.png';
import peerReviewedGlyph from '../assets/glyphicons/peerReviewedGlyph.png';
import plusGlyph from '../assets/glyphicons/plusGlyph.png';
import redDeleteGlyph from '../assets/glyphicons/redDeleteGlyph.png';
import underReviewGlyph from '../assets/glyphicons/underReviewGlyph.png';
import versionControlGlyph from '../assets/glyphicons/versionControlGlyph.png';
import xmarkGlyph from '../assets/glyphicons/xmarkGlyph.png';
import greenTickGlyph from '../assets/glyphicons/greenTickGlyph.png';

const GlobalButtonStyle = styled.div`
    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;
`

// RECT BUTTON 1



export function RectButton1(props) {

    const buttonText = "RectButton1"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on rectbutton1")
        }, 200)
    }

    return (
        <RectButton1Wrapper tapped={tapped} onClick={() => {click()}} >
            <RectButton1Text>
                {props.buttonText ? props.buttonText : buttonText}
            </RectButton1Text>
        </RectButton1Wrapper>
    )
}

const RectButton1Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 220px;
    height: 45px;
    background-color: ${Colors.black};
    opacity: ${props => props.tapped ? "0.8" : "1"};
    transform: scale(${props => props.tapped ? "0.95" : "1"});
    border-radius: 8px;
    text-align: center;
    display: flex;
    justify-content: center;
    box-shadow: 0px 0px 0px ${Colors.shadow};
    
    transition: all 0.3s ease-in-out;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;

    :hover {
        box-shadow: 0px 0px 15px ${Colors.shadow};
    }
`

const RectButton1Text = styled(T3)`
    margin: auto;
    color: ${Colors.white};
`


// RECT BUTTON 2



export function RectButton2(props) {

    const buttonText = "RectButton1"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on rectbutton2")
        }, 200)
    }

    return (
        <RectButton2Wrapper tapped={tapped} onClick={() => {click()}}>
            <RectButton2Text>
                {props.buttonText ? props.buttonText : buttonText}
            </RectButton2Text>
        </RectButton2Wrapper>
    )
}

const RectButton2Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 220px;
    height: 45px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.white};
    opacity: ${props => props.tapped ? "0.8" : "1"};
    transform: scale(${props => props.tapped ? "0.95" : "1"});
    border: 1px solid ${Colors.black};
    border-radius: 8px;
    text-align: center;
    display: flex;
    justify-content: center;
    box-shadow: 0px 0px 0px ${Colors.shadow};
    
    transition: all 0.3s ease-in-out;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;

    :hover {
        box-shadow: 0px 0px 10px ${Colors.shadow};
    }
`

const RectButton2Text = styled(T3)`
    margin: auto;
    color: ${Colors.black};
`


// RECT BUTTON 3



export function RectButton3(props) {

    const buttonText = "RectButton3"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on rectbutton3")
        }, 200)
    }

    return (
        <RectButton3Wrapper tapped={tapped} onClick={() => {click()}}>
            <RectButton3Text>
                {props.buttonText ? props.buttonText : buttonText}
            </RectButton3Text>
        </RectButton3Wrapper>
    )
}



const RectButton3Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 220px;
    height: 45px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.lightgray};
    opacity: ${props => props.tapped ? "0.8" : "1"};
    transform: scale(${props => props.tapped ? "0.95" : "1"});
    border: 1px solid rgba(212, 212, 212, 0.5);
    border-radius: 8px;
    text-align: center;
    display: flex;
    justify-content: center;
    box-shadow: 0px 0px 0px ${Colors.shadow};
    
    transition: all 0.3s ease-in-out;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;

    :hover {
        box-shadow: 0px 0px 10px ${Colors.shadow};
    }

`

const RectButton3Text = styled(S3)`
    margin: auto;
    color: ${Colors.black};
`


// RECT BUTTON 4


export function RectButton4(props) {

    const buttonText = "RectButton4"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on rectbutton4")
        }, 200)
    }

    return (
        <RectButton4Wrapper tapped={tapped} onClick={() => {click()}} style={props.style}>
            <RectButton4Text>
                {props.buttonText ? props.buttonText : buttonText}
            </RectButton4Text>
        </RectButton4Wrapper>
    )
}

const RectButton4Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 70px;
    height: 45px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.lightgray};
    border: 1px solid rgba(212, 212, 212, 0.5);
    border-radius: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
    box-shadow: 0px 0px 0px ${Colors.shadow};

    opacity: ${props => props.tapped ? "0.8" : "1"};
    transform: scale(${props => props.tapped ? "0.95" : "1"});
    
    transition: all 0.3s ease-in-out;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;

    :hover {
        box-shadow: 0px 0px 10px ${Colors.shadow};
    }
`

const RectButton4Text = styled(B4)`
    margin: auto;
    color: ${Colors.black};
`


// RECT BUTTON 4 G


//function here


const RectButton4gWrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 70px;
    height: 45px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.lightgray};
    border: 1px solid rgba(212, 212, 212, 0.5);
    border-radius: 5px;
    text-align: center;
    display: flex;
    justify-content: center;

    box-shadow: 0px 0px 0px ${Colors.shadow};
    transition: box-shadow 0.3s ease-in-out;

    :hover {
        box-shadow: 0px 0px 10px ${Colors.shadow};
    }
`

const RectButton4gText = styled(B4)`
    margin: auto;
    color: ${Colors.black};
`

// RECT BUTTON 5


export function RectButton5(props) {

    const buttonText = "RectButton5"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on rectbutton5")
        }, 200)
    }

    return (
        <RectButton5Wrapper tapped={tapped} onClick={() => {click()}} style={props.style}>
            <RectButton5Text>
                {props.buttonText ? props.buttonText : buttonText}
            </RectButton5Text>
        </RectButton5Wrapper>
    )

}

const RectButton5Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 70px;
    height: 25px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.lightgray};
    border: 1px solid rgba(212, 212, 212, 0.5);
    border-radius: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
    box-shadow: 0px 0px 0px ${Colors.shadow};
    
    opacity: ${props => props.tapped ? "0.8" : "1"};
    transform: scale(${props => props.tapped ? "0.95" : "1"});
    
    transition: all 0.3s ease-in-out;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;

    :hover {
        box-shadow: 0px 0px 10px ${Colors.shadow};
    }
`

const RectButton5Text = styled(B4)`
    margin: auto;
    color: ${Colors.black};
`


// TEXT BUTTON 1


export function TextButton1(props) {

    const buttonText = "TextButton1"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on textButton1")
        }, 200)
    }

    return (
        <TextButton1Wrapper tapped={tapped} onClick={() => {click()}}>
            <TextButton1Text>
                {props.buttonText ? props.buttonText : buttonText}
            </TextButton1Text>
        </TextButton1Wrapper>
    )

}

const TextButton1Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 125px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;

    opacity: ${props => props.tapped ? "0.3" : "1"};

    transition: all .3s ease-in-out;
`

const TextButton1Text = styled(B3T)`
    margin: auto;
    color: ${Colors.black};

    transition: color 0.3s ease-in-out;

    ${TextButton1Wrapper}:hover & {
        color: ${Colors.gray};
    }

`


// TEXT BUTTON 2

export function TextButton2(props) {
    
    const buttonText = "TextButton2"
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on textButton2")
        }, 200)
    }

    return (
        <TextButton2Wrapper tapped={tapped} onClick={() => {click()}} style={props.style}>
            <TextButton2Text>
                {props.buttonText ? props.buttonText : buttonText}
            </TextButton2Text>
        </TextButton2Wrapper>
    )

}

const TextButton2Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 125px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;

    opacity: ${props => props.tapped ? "0.3" : "1"};

    transition: all .3s ease-in-out;
`

const TextButton2Text = styled(B4)`
    margin: auto;
    color: ${Colors.black};

    transition: color 0.3s ease-in-out;

    ${TextButton2Wrapper}:hover & {
        color: ${Colors.gray};
    }

`


// TEXT GLYPH BUTTON 1

//function here


const TextGlyphButton1Wrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 125px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;
`

const TextGlyphButton1Text = styled(B4)`
    margin: auto;
    color: ${Colors.black};

    transition: color 0.3s ease-in-out;

    ${TextGlyphButton1Wrapper}:hover & {
        color: ${Colors.gray};
    }

`


// LINK 



export function Link(props) {

    const linkText = props.linkText
    const [tapped, setTapped] = useState(false)

    function click() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            props.onClick ? props.onClick() : console.log("no callback on link")
        }, 200)
    }

    return (
        <LinkWrapper tapped={tapped} onClick={() => {click()}} style={props.style}>
            <LinkText>
                {props.buttonText ? props.linkText : linkText}
            </LinkText>
        </LinkWrapper>
    )

}

const LinkWrapper = styled(GlobalButtonStyle)`
    margin: auto;
    width: 125px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;

    opacity: ${props => props.tapped ? "0.3" : "1"};

    transition: all .3s ease-in-out;

    cursor: pointer;

`

const LinkText = styled(B3)`
    margin: auto;
    color: ${Colors.linkblue};

    ${LinkWrapper}:hover & {
        text-decoration: underline;
    }

`

// IMAGE BUTTONS

export function ImgButton(props) {

    const imgsrc = props.imgsrc
    const height = props.height ? props.height : 25
    const action = props.action ? props.action : function () {return}

    const isCentered = props.isCentered ? props.isCentered : false

    const isVertCentered = props.isVertCentered ? props.isVertCentered : false

    const [tapped, setTapped] = useState(false)

    function onTap() {
        setTapped(current => !current)
        setTimeout(() => {
            setTapped(current => !current)
            action()
        }, 200);
    }

    return (
        <ImgButtonStyle src={imgsrc} height={height} tapped={tapped} isCentered={isCentered} isVertCentered={isVertCentered} onClick={() => {
            onTap()
        }}/>
    )
}

const ImgButtonStyle = styled.img`
    opacity: ${props => props.tapped ? 0.5 : 1};
    cursor: pointer;
    object-fit: contain;
    height: ${props => props.height}px;

    position: ${props => props.isCentered ? "absolute" : "relative"};
    position: ${props => props.isVertCentered ? "absolute" : "relative"};
    left: ${props => props.isCentered ? "50%" : "0"};
    top: ${props => props.isCentered ? "50%" : "0"};
    top: ${props => props.isVertCentered ? "50%" : "0"};
    transform: translate(${props => props.isCentered ? "-50%" : "0"}, ${props => props.isCentered ? "-50%" : "0"});
    /* transform: translateY(${props => props.isVertCentered ? "-50%" : "0"}); */
    transform: translate(${props => props.isCentered ? "-50%" : "0"}, ${props => props.isCentered ? "-50%" : "0"});
`

export function FileButton(props) {
    const [tapped, setTapped] = useState(false)
    const action = props.action ? props.action : {}
    const name = props.fileName ? props.fileName : "give_file_name"

    return (
        <FileButtonStyle 
        tapped={tapped}
        onClick={()=>{
            setTapped(current=>!current)
            setTimeout(() => {
                setTapped(current=>!current)
                action()
            }, 200);
        }}>
            {name}
        </FileButtonStyle>
    )
}

const FileButtonStyle = styled(S3)`
    opacity: ${props => props.tapped ? 0.5 : 1};
    cursor: pointer;
    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;
`

export function ReviewStageBadge(props) {

    const stage = typeof props.stage != 'undefined' ? props.stage : 3

    const [label, setLabel] = useState("")
    const [img, setImg] = useState(undefined)

    useEffect(() => {
        console.log("REVIWW STAGE BADGE", stage)
        setLabel(getLabel(stage))
        setImg(getImgSrc(stage))
    })
    

    function getImgSrc(stage) {
        if (stage === 2) {
            return editorsNeededGlyph
        } else if (stage === 1) {
            return underReviewGlyph
        } else if (stage === 0) {
            return greenTickGlyph
        }
    }

    function getLabel(stage) {
        if (stage === 2) {
            return "Looking for editors"
        } else if (stage === 1) {
            return "Under peer review"
        } else if (stage === 0) {
            return "Peer Reviewed"
        }
    }

    return (
        <StageWrapper>
            <ImgButton imgsrc={img} height={15} />
            <B5T style={{padding: "0px 5px"}}>{label}</B5T>
        </StageWrapper>
    )
}

const StageWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-items: right;
    align-items: center;
`