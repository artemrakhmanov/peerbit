import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { Colors } from "../designsystem/ColorStyles";
import crossGlyphicon from "../assets/glyphicons/xmark-solid.svg"
import codeGlyphicon from "../assets/glyphicons/code-solid.svg"
import folderGlyphicon from "../assets/glyphicons/folder-solid.svg"
import { B4T, B4, S2, S4 } from "../designsystem/TypographyStyles";
import { TextButton2 } from "../designsystem/Buttons";

import NewCommentField from "./NewCommentField";
import { useSelector } from "react-redux";
// import { set } from "@reduxjs/toolkit/node_modules/immer/dist/internal";

export default function SourceDetails(props) {

    const submissionData = props.submissionData
    const submissionID = props.submissionID
    const name = submissionData.name

    function toggleView () {
        // if(hidden) {
        // }
        // else {
        //     {SourceDetailSidebar.style={display:"hidden"}}

        // }

    }


    return (
        <div >
            <SourceDetailSidebar>
                <div style={{textAlign: "left"}, {padding:"20px"}}>
                    <S2 style={{"color": "black"}, {"filter":"blur(0px)"}}>{name}</S2> 
                    <CrossGlyph 
                        src = {crossGlyphicon}
                        onClick={() => {props.setHidden(true)}}
                    />
                    <br/>
                        <Glyph src = {codeGlyphicon} />
                        <div style={{"padding-left":"40px"}}>
                            <S4>
                                Version
                            </S4>
                        </div>
                    <br />

                    <Glyph src = {folderGlyphicon} />
                        <div style={{"padding-left":"40px"}}>
                            <S4>
                                Source
                            </S4>
                        </div>
                </div>
            </SourceDetailSidebar>
        </div>
    )
}


const SourceDetailSidebar = styled.div`
    position: absolute;
    height: 84vh;
    width: 100%;
    overflow: scroll;
`
const CrossGlyph = styled.img`
    object-fit: contain;
    width: 20px;
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
`
const Glyph = styled.img`
    object-fit: absolute;
    width: 20px;
    position: absolute;
    margin-right:20px;

`
