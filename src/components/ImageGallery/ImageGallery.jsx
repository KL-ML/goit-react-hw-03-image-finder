import React, { Component } from "react";
import { ImageGalleryItem } from "./ImageGalleryItem";
import imagesApi from '../../api/image-searcher-api';
import { Modal } from '../Modal';
import { ImageGalleryList } from "./ImageGallery.styled";
import { Loader } from "components/Loader";
import { Button } from "components/Button";

export class ImageGallery extends Component {
    state = {
        error: null,
        status: 'idle',
        showModal: false,
        showLoadMoreBtn: false,
        value: '',
        images: [],
        page: 1,
        totalHits: 0,
    };
    // totalPages = 0;
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
                // error: null,
                // showModal: false,
                // dataForModal: null,
                // showLoadMoreBtn: false,
                value: searchValue,
                images: [],
                page: 1,
                totalHits: 0,
            })
        }

        //всегда нужно делать проверку, иначе упадет приложение
        const { page, value } = this.state;
        const changePage = prevState.page !== page;
        const changeValue = prevState.value !== value;
        // const prevSearchValue = prevProps.searchValue;
        // const nextSearchValue = this.props.searchValue;
        // const prevPage = prevState.page;
        // const nextPage = this.state.page;
        // if (prevSearchValue !== nextSearchValue || prevPage !== nextPage) {
        if( changePage || changeValue) {
            this.setState({ status: 'pending' });
            imagesApi.fetchImages(value, page)
                .then(({hits, totalHits}) => {
                    if (!hits.length) {
                        this.setState({ status: 'empty' })
                        return;
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
                        status: 'resolved',
                        showLoadMoreBtn: true,
                        totalHits,
                    }));
                    // console.log('images: ', this.state.images);
                    
                })
                .catch(error => this.setState({ error, status: 'rejected', totalHits: 0 }));
                // .finally(() => this.setState({ loading: false }));
        }
    }

    toggleModal = () => {
        this.setState(({ showModal }) => ({
            showModal: !showModal
        }));
    };

    toggleLoadMoreBtn = () => {
        this.setState(({ showLoadMoreBtn }) => ({
            showLoadMoreBtn: !showLoadMoreBtn
        }));
    }

    onLoadMoreBtnClick = () => {
        this.setState(prevState => ({ page: prevState.page + 1 }));
    }

    onImgClick = (e) => {
        this.currentLargeImg = e.target.attributes[2].nodeValue;
        this.currentAlt = e.target.attributes[1].nodeValue;
        this.toggleModal();
    }
    

    render() {
        const { images, error, status, showModal, showLoadMoreBtn } = this.state;
        
        //Статус "в простое"
        if (status === 'idle') {
            return <p>Enter something for search!</p>;
        }
        //Статус "Ожидаем"
        if (status === 'pending') {
            return <Loader />;
        }
        //Статус "Пусто"
        if (status === 'empty') {
            return <p>There are no images on your search</p>
        }
        //Статус "Отклонено"
        if (status === 'rejected') {
            return <p>{error.message}</p>
        }
        //Статус "Виконано"
        if (status === 'resolved') {
            return (<>
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
                </ImageGalleryList>
                {showLoadMoreBtn && <Button onClick={this.onLoadMoreBtnClick}>LoadMore</Button>}
                
                {showModal && <Modal onClose={this.toggleModal} >
                    <img src={this.currentLargeImg} alt={this.currentAlt} />
                </Modal>}
            </>
            );
        }
    }
}