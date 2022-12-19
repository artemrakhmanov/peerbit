import PulseLoader from "react-spinners/PulseLoader"
import styled from "styled-components"
import { Colors } from "../designsystem/ColorStyles"
import { T1 } from "../designsystem/TypographyStyles"


export default function LoadingScreen(props) {

    const showSuccess = props.showSuccess ? props.showSuccess : false

    return (
        <DummyContainerWrapper>
            <DummyCentralBlockWrapper>
                {!showSuccess
                ?
                <PulseLoader />
                :
                <T1 style={{color: Colors.green}}>Success</T1>
                }
            </DummyCentralBlockWrapper>
        </DummyContainerWrapper>
    )
}

const DummyContainerWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    transition: all .3s ease-in-out;
`

const DummyCentralBlockWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    /* width: 100%; */
    /* height: 100vh; */
`

