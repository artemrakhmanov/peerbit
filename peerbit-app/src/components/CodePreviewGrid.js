import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";

export default function CodePreviewGrid(props) {

    const [numberOfColumns, setNumberOfColumns] = useState(1)

    const updateNumberOfColumns = () => {
        let width = window.innerWidth;
        if (width > 1000) {
            setNumberOfColumns(2)
        }
        else {
            setNumberOfColumns(1)
        }
    }

    window.addEventListener("resize", function(){
        updateNumberOfColumns()
    })

    useEffect(() => {
        updateNumberOfColumns()
    })

    return (
        <GridWrapper 
            showTwoColumns={numberOfColumns === 2 ? true : false}
        >
            {props.children}
        </GridWrapper>
    )
}

const GridWrapper = styled.div`
    position: relative;
    /* display: grid; */
    /* grid-gap: 15px 25px; */
    /* grid-template-columns: ${props=> props.showTwoColumns ? "auto auto" : "auto"}; */
    /* grid-template-columns: auto; */
    /* grid-auto-columns: 500px 200px; */
    justify-content: center;
`