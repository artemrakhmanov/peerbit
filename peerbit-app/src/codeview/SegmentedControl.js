import React from "react"
import { B4 } from "../designsystem/TypographyStyles"
import styled from "styled-components"
import { Colors } from "../designsystem/ColorStyles"


export default function SegmentedControl(props) {

    const selection = props.selection
    const setSelection = props.setSelection

    return (
        <SegmentedPickerWrapper>

            <div
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    overflow: "visible"
                }}
            >
                <SelectionHighlighter
                    width={selection === 0 ? "0px" : "50%"}
                    style={{
                        opacity: "0%",
                    }}
                />
            
                <SelectionHighlighter
                    width={"45%"}
                />
            </div>
            
            <SegmentWrapper 
                onClick={() => setSelection(0)} 
                isSelected={selection === 0 ? true : false}
            >
                <B4 style={{color: selection === 0 ? "white" : "gray"}}>Description</B4>
            </SegmentWrapper>
            
            <SegmentWrapper 
                onClick={() => setSelection(1)}
                isSelected={selection === 1 ? true : false}
            >
                <B4 style={{color: selection === 1 ? "white" : "gray"}}>Comments</B4>
            </SegmentWrapper>

        </SegmentedPickerWrapper>
    )
}

// SEGMENTED MENU
const SegmentedPickerWrapper = styled.div`
    display: block;
    position: relative;
    width: 80%;
    min-width: 100px;
    max-width: 300px;
    height: 25px;
    /* border: 1px solid gray; */
    background-color: ${Colors.lightgray};
    border-radius: 5px;
    box-shadow: 0px 0px 5px ${Colors.shadow};
    transition: all .3s ease-in-out;
`

const SegmentWrapper = styled.div`
    display: inline-flex;
    position: relative;
    width: 50%;
    justify-content: center;
    line-height: 25px;
    user-select: none;
    cursor: pointer;

    transition: all .3s ease-in-out;

    :hover {
        opacity: ${props => props.isSelected ? "100%" : "50%"};
    }
`

const SelectionHighlighter = styled.div`
    display: inline-flex;
    position: relative;
    background-color: gray;
    width: ${props => props.width};
    height: 23px;
    border-radius: 3px;
    margin: 1px;
    transition: all .3s ease-in-out;
`
