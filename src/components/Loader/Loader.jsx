import React from "react";
import { Grid } from 'react-loader-spinner'
import { LoaderDiv } from './Loader.styled';

export const Loader = () => {
    return (
        <LoaderDiv>
            <Grid
                height="190"
                width="190"
                color="#5c8dd2"
                ariaLabel="grid-loading"
                radius="11"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </LoaderDiv>
    );
};