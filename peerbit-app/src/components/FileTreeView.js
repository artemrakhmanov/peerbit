import styled from "styled-components"
import React, { useEffect, useState } from "react"
import { S3 } from "../designsystem/TypographyStyles"
import { FileButton, ImgButton } from "../designsystem/Buttons"

import folderGlyph from '../assets/glyphicons/folderGlyph.png';

const dummyFileTree = {
    children: [
    {
    name: "src",
    isFolder: true,
    children: [
        {
            name: "hello.js",
            isFolder: false,
            lines: [],
            comments: []
        },
        {
            name: "utility",
            isFolder: true,
            children: [
                {
                    name: "hello2.js",
                    isFolder: false,
                    lines: [],
                    comments: []
                }
            ]
        },
        {
            name: "test.js",
            isFolder: false,
            lines: [],
            comments: []
        }
    ]
    }
    ]
}




export default function FileTreeView(props) {

    const fileTree = props.fileTree ? props.fileTree : dummyFileTree

    useEffect(() => {
      console.log(fileTree)
    }, [])
    

    function mapChildren(root) {
        return (
            <div>
                {
                    Array.prototype.slice.call(root.children).map((child) => {
                        return (
                        <div style={{marginBottom: "5px"}}>
                            {child.isFolder ?
                                <div>
                                    <Row style={{marginBottom: "5px"}}>
                                        <ImgButton imgsrc={folderGlyph} height={16}/>
                                        <S3 style={{marginLeft: "5px"}}>{child.name}</S3>
                                    </Row>

                                    <FolderBlock style={{paddingLeft: "10px"}}>
                                        {mapChildren(child)}
                                    </FolderBlock>
                                </div>
                                :
                                <FileButton
                                fileName={child.name}
                                action={()=>{}}
                                style={{marginBottom: "5px"}}/>
                            }
                        </div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <FileTreeWrapper>
            {mapChildren(fileTree)}
        </FileTreeWrapper>
    )
}

const FileTreeWrapper = styled.div`
    position: relative;
    width: 100%;
    margin: 16px;
    overflow: scroll;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`

const FolderBlock = styled.div`
    border-left: 2px solid black;
`