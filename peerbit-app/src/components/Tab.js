import styled from 'styled-components';
import React, {useState} from "react";
import caretDown from "../assets/glyphicons/caret-down-solid.svg";
import caretRight from "../assets/glyphicons/caret-right-solid.svg";
import { T1, T3, S3, B3, B3T, B4, B2, B4T, S4, B5T, S2 } from "../designsystem/TypographyStyles";



function Tab (props) {

    // const title = props.title

    const [dropped, setDropped] = useState(false);


    return (
        <Tab>
            {/* <CaretGlyph 
            src={dropped ? caretDown : caretRight} 
            onClick={() => {
                setDropped(!dropped)
            }}/> */}
            {/* <S3>{title}</S3> */}
        </Tab>
    ); 
}

const TabWrapper = styled.div`
    border-bottom: solid 1px grey;
    width: 100%
    height:30px;
`


const CaretGlyph = styled.img`
    object-fit: contain;
    width: 20px;
    position: absolute;
    right: 0px;
    top: 0px;

    cursor: pointer;
`


export default Tab;