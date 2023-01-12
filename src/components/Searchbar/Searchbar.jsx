import React, { Component } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SearchForm, SearchbarHeader, SearchFormButton, SearchFormInput } from './Searchbar.styled';
import { RiSearch2Line } from 'react-icons/ri';
import { IconContext } from "react-icons";

export class Searchbar extends Component {
    state = {
        searchValue: '',
    };

    handleInputChange = e => {
        this.setState({ searchValue: e.currentTarget.value.toLowerCase() });
    };

    handleSubmit = e => {
        e.preventDefault();

        if (this.state.searchValue.trim() === '') {
            toast.error("Enter search value !");
            return;
        }
        
        this.props.onSubmit(this.state.searchValue);
        this.setState({ searchValue: '' });
    }
    render() {
        return (
            <SearchbarHeader>
                <SearchForm onSubmit={this.handleSubmit}>
                    <IconContext.Provider value={{ size: '2em' }}>
                        <SearchFormButton type="submit">
                            <RiSearch2Line />
                        </SearchFormButton>
                    </IconContext.Provider>

                    <SearchFormInput
                        type="text"
                        name="searchValue"
                        value={this.state.searchValue}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                        autoFocus
                        placeholder="Search images and photos"
                    />
                </SearchForm>
            </SearchbarHeader>
        );
    };
};