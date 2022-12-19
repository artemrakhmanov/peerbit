import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { B4T, T1 } from "../designsystem/TypographyStyles";
import { Formik, Form, Field } from "formik";

import Switch from "react-ios-switch"
import { Colors } from "../designsystem/ColorStyles";

import searchIcon from "../assets/glyphicons/search.png";

//keypress hook: https://www.caktusgroup.com/blog/2020/07/01/usekeypress-hook-react/
export function useKeypress(key, action) {
    useEffect(() => {
      function onKeyup(e) {
        if (e.key === key) action()
      }
      window.addEventListener('keyup', onKeyup);
      return () => window.removeEventListener('keyup', onKeyup);
    }, []);
}

export default function SearchField() {

    const [tapped, setTapped] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const searchInputRef = useRef()

    function openSearchBar() {
        console.log("tapped search bar")
        setTapped(true)
        setTimeout(() => {
            setTapped(false)
            setIsOpen(true)
            searchInputRef.current.focus()
        },
        200
        )
    }

    function closeSearchBar() {
        console.log("escape, closing search bar")
        setTapped(true)
        setTimeout(()=>{
            setTapped(false)
            setIsOpen(false)
        }, 200)
    }

    useKeypress('Escape', () => {
        closeSearchBar()
        searchInputRef.current.blur()
    })

    return (
        <div>

        <TapAwayComponent isOpen={isOpen} onClick={closeSearchBar} />

        <SearchBarCentralWrapper 
            tapped={tapped} 
            open={isOpen}
            onClick={openSearchBar}
        >

            <SearchBarIcon isOpen={isOpen} src={searchIcon} />

            <Formik 
                initialValues={{searchValue: ""}}
                onSubmit={values=>{
                    if (values.searchValue.length > 0) {
                        console.log("submitted searh value")
                        console.log(values)
                    } else {
                        console.log("empty search submit")
                    }
                }}
                >
                    { props =>(
                        <Form noValidate>
                            
                            
                            <SearchInput 
                                innerRef={searchInputRef}
                                type="text" 
                                name="searchValue"
                                placeholder="Search" 
                                searchisopen={isOpen}
                                value={isOpen ? props.values.searchValue : ""}
                                autocomplete="off"
                            />
                            
                        </Form>
                    )}
            </Formik>

        </SearchBarCentralWrapper>

        <SearchBarResultsWrapper isOpen={isOpen} tapped={tapped}>
                    
        </SearchBarResultsWrapper>

        </div>
    )
}

const SearchBarCentralWrapper = styled.div`

    z-index: 1;
    
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${props => props.tapped ? "0.95" : "1"});

    /* width: 260px; */
    width: ${props => props.open ? "350px" : "260px"};
    height: 45px;

    background-color: rgba(209, 209, 209, 0.5);
    border-radius: 7px;
    border: 1px solid rgba(209, 209, 209, 0.5);
    backdrop-filter: blur(5px);

    display: flex;
    flex-direction: row;
    justify-content: ${props => props.isOpen ? "left" : "center"};

    box-shadow: 0 0 0px rgb(219, 219, 219);

    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;

    opacity: ${props => props.tapped ? "0.8" : "1"};

    transition: all .3s ease-in-out;

    :hover {
        box-shadow: 0 0 10px rgb(219, 219, 219);
    }    
`

const SearchBarIcon = styled.img`
    object-fit: contain;
    position: relative;
    height: 15px;
    width: 15px;
    top: 50%;
    transform: translate(0, -50%);
    margin-right: 2px;

    transition: all .3s ease-in-out;
`

const SearchInputWrapper = styled.div`

`

const SearchInput = styled(Field)`
    height: 45px;
    width: ${props => props.searchisopen ? "300px" : "58px"};
    background-color: transparent;
    font-size: 18px;
    font-weight: 400;

    outline: none;
    border: none;

    transition: all .3s ease-in-out;

    :focus {
        outline: none;
    }
`

const SearchBarResultsWrapper = styled.div`

    z-index: -1;

    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0) scale(${props => props.tapped ? "0.95" : "1"});

    width: ${props => props.isOpen ? "350px" : "260px"};
    height: ${props => props.isOpen ? "500px" : "45px"};

    background-color: rgba(242, 242, 242, 0.8);
    border-radius: 7px;
    backdrop-filter: blur(3px);

    /* display: flex;
    flex-direction: row;
    justify-content: ${props => props.isOpen ? "left" : "center"}; */

    box-shadow: 0 5px 10px rgb(219, 219, 219);

    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;

    opacity: ${props => props.isOpen ? "1" : "0"};

    transition: all .3s ease-in-out;
`

const TapAwayComponent = styled.div`
    z-index: -2;
    position: fixed;
    height: 100%;
    width: 100%;

    display: ${props => props.isOpen ? "block" : "none"};


`