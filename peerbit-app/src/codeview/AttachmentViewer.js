import downloadGlyph from "../assets/glyphicons/download-solid.svg"
import styled from "styled-components";
import handleDownload from "../components/FileDownload"
import { S2, B4 } from "../designsystem/TypographyStyles";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useHistory } from "react-router";


const storage = getStorage();

const AttachmentViewer = function (props) {
    const history = useHistory();
    const submissionID = props.id;
    
    const getDownload = function(url, attachment) {
        handleDownload(url, attachment)
        // getDownloadURL(ref(storage, 'attachments/' + attachment)).then((url) => {
        //     handleDownload(url, attachment)
        // })
    }

    const attachments = props.attachmentStr;

    const urls = props.attachmentURLS;

    function getURL(attachmentSelected) {
        const index = attachments.indexOf(attachmentSelected)
        return urls[index.toString()]
    }

    if(attachments != undefined) {
        return(
            <Wrapper>
                    {attachments.map((attachment) => {
                    return(
                        <AttachmentEl>
                            <DownloadGlyph onClick={() => {getDownload(getURL(attachment),attachment)}} src = {downloadGlyph} />
                            <B4 style={{"padding-top": "10px"}} >{attachment}</B4>
                        </AttachmentEl>
                    )
            })
        }
                </Wrapper>
            )
        }
        else {
            return (<S2 style={{"float": "center"},{"margin":"10px"}}>This submission has no attachments</S2>)
        }
}

const Wrapper = styled.div`
    display: flex;  
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100%;
    height: 160px;
`
const AttachmentEl = styled.ul`
    flex-shrink: 0;
    border: solid 1px lightgrey;
    width: 200px;
    height: 150px;
    text-align:center;
    vertical-align:bottom;
    display:table-cell;
    margin-left: 2.5%;
    postion:relative;
    border-radius: 10%;
`

const DownloadGlyph = styled.img`
width:80%;
float:center;
margin-top:10%;
height:60%;
`

export default AttachmentViewer