import styled from "styled-components"
import { Colors } from "./ColorStyles"

export const WidthAdjustmentDiv = styled.div`
    width: 100%;
    max-width: 1200px;
    left: 50%;
    transform: translateX(-50%);
`

export const FormContainerViewWrapper = styled(WidthAdjustmentDiv)`
    width: 100%;
    position: absolute;
    overflow-y: scroll;
    margin-top: 70px;
`

export const FormPageGrid = styled.div`
    margin-top: 16px;
    padding: 0px 16px;
    display: grid;
    grid-gap: 16px 16px;
    grid-template-columns: ${props=> props.showTwoColumns ? "50% 50%" : "auto"};
    grid-auto-columns: 40% 40%;
    align-items: start;
    /* width: 100%; */
`

export const FormSectionMargin = styled.div`
    margin: 10px 16px;
`

export const FormMenuComponentStyled = styled.div`
    background-color: ${Colors.lightgray};
    border-radius: 16px;
    margin-bottom: 10px;
    transition: all 0.2s linear;
`