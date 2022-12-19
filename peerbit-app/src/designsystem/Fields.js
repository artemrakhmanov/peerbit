import { Field } from "formik";
import styled from "styled-components";
import { Colors } from "./ColorStyles";

export const InputField1 = styled(Field)`
    width: 220px;
    height: 45px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.white};
    border: 1px solid ${props => props.isValid ? Colors.gray : Colors.red};
    border-radius: 5px;
    font-size: 16px;
    font-weight: 400;
`

export const InputField2 = styled(Field)`
    width: 220px;
    height: 400px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: ${Colors.white};
    border: 1px solid ${props => props.isValid ? Colors.gray : Colors.red};
    border-radius: 5px;
    font-size: 16px;
    font-weight: 400;

    > * {
        margin-left: 10px;
    }
`

export const TextAreaStyle = styled.textarea`
    resize: none;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 400;
`
