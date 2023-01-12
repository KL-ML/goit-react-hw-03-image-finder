import React, { Component } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from "./Searchbar";
import { Box } from "./Box";

export class App extends Component {

  state = {
    searchValue: '',
  }

  handleFormSubmit = searchValue => {
    this.setState({ searchValue });
  }
  
  render() {
  
    return (
      <Box
        display="grid"
        gridTemplateColumns="1fr"
        gridGap="16px"
        pb="24px"
      >
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ToastContainer autoClose={2000} position="top-right" theme="light" />
        <ImageGallery searchValue={this.state.searchValue}/>
      </Box>
    );
  };
};
