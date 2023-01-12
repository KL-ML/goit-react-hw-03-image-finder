import React from "react";
import {LoadMoreBtn} from './Button.styled'

export const Button = ({ children, onClick }) => {
    return (
        <LoadMoreBtn type="button" onClick={onClick}>{children}</LoadMoreBtn>
    );
}