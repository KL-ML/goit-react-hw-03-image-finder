import React, { Component } from "react";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ImageGalleryItem } from "./ImageGalleryItem";
import imagesApi from '../../api/image-searcher-api';
import { Modal } from '../Modal';
import { ImageGalleryList } from "./ImageGallery.styled";
import { Loader } from "components/Loader";
import { Button } from "components/Button";

export class ImageGallery extends Component {
    static propTypes = {
    searchValue: PropTypes.string.isRequired,
  };
    state = {
        error: null,
        loading: false,
        showModal: false,
        showLoadMoreBtn: false,
        value: '',
        images: [],
        page: 1,
        totalHits: 0,
    };
    currentLargeImg = '';
    currentAlt = '';

    componentDidMount() {
        const { searchValue } = this.props;
        this.setState({ value: searchValue });
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchValue } = this.props;
        if (prevProps.searchValue !== searchValue) {
            this.setState({
                error: null,
                loading: false,
                showModal: false,
                showLoadMoreBtn: false,
                value: searchValue,
                images: [],
                page: 1,
                totalHits: 0,
            })
        }

        //всегда нужно делать проверку, иначе упадет приложение
        const { page, value } = this.state;
        // const changePage = prevState.page !== page;
        // const changeValue = prevState.value !== value;
        // const prevSearchValue = prevProps.searchValue;
        // const nextSearchValue = this.props.searchValue;
        // const prevPage = prevState.page;
        // const nextPage = this.state.page;
        // if (prevSearchValue !== nextSearchValue || prevPage !== nextPage) {
        if( prevState.page !== page || prevState.value !== value) {
            this.setState({ loading: true });
            imagesApi.fetchImages(value, page)
                .then(({ hits, totalHits }) => {
                    if (!hits.length) {
                        return Promise.reject(
                            toast.error(`No photos for search query: ${value}`)
                            // new Error(`No photos for search query: ${value}`)
                        );
                    }
                    const imagesForLoadMore = hits.map(
                        ({ id, tags, webformatURL, largeImageURL }) => ({
                            id,
                            tags,
                            webformatURL,
                            largeImageURL,
                        })
                    );
                    // console.log('imagesForLoadMore: ', imagesForLoadMore);
                    this.setState(prevState => ({
                        images: [...prevState.images, ...imagesForLoadMore],
                        // status: 'resolved',
                        // showLoadMoreBtn: true,
                        totalHits,
                    }));
                    // console.log('images: ', this.state.images);
                    
                })
                .catch(error => this.setState({ error, totalHits: 0 }))
                .finally(() => this.setState({ loading: false }));
        }
    }

    toggleModal = () => {
        this.setState(({ showModal }) => ({
            showModal: !showModal
        }));
    };

    // openLoadMoreBtn = () => {
    //     this.setState(({ showLoadMoreBtn }) => ({
    //         showLoadMoreBtn: true,
    //     }));
    // }
    // openLoadMoreBtn = () => {
    //     this.setState(({ showLoadMoreBtn }) => ({
    //         showLoadMoreBtn: true,
    //     }));
    // }

    onLoadMoreBtnClick = () => {
        this.setState(prevState => ({ page: prevState.page + 1 }));
    }

    onImgClick = (e) => {
        this.currentLargeImg = e.target.attributes[2].nodeValue;
        this.currentAlt = e.target.attributes[1].nodeValue;
        this.toggleModal();
    }
    
    render() {
        const { images, error, showModal, totalHits, loading } = this.state;
        
        return (<>
            {!error && (
                <ImageGalleryList onClick={this.onImgClick}>
                    {images.map(({ id, tags, webformatURL, largeImageURL }) => (
                        <ImageGalleryItem
                            key={id}
                            id={id}
                            tags={tags}
                            webformatURL={webformatURL}
                            largeImageURL={largeImageURL}
                        />
                    ))}
                </ImageGalleryList>)}
            {loading && (<Loader />)}
            {images.length < totalHits && (
                <Button onClick={this.onLoadMoreBtnClick}>LoadMore</Button>
            )}
                
            {showModal && <Modal onClose={this.toggleModal} >
                <img src={this.currentLargeImg} alt={this.currentAlt} />
            </Modal>}
        </>
        );
    };
};
