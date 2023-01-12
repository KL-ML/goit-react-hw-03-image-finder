import React, { Component } from 'react'; 
import { createPortal } from 'react-dom';
import { Overlay, ModalDiv } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        //подчищать ивент-лисенери, тайм-ауті, http-запросі и другое
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        if (e.code === 'Escape') {
            this.props.onClose();
        }
    };

    handleBackdropClick = e => {
        if (e.currentTarget === e.target) {
            this.props.onClose();
        }
    }

    render() {
        //рендер портала
        return createPortal(
            //первім аргументом( до запятой,) передаю разметку
            <Overlay onClick={this.handleBackdropClick}>
                <ModalDiv>{this.props.children}</ModalDiv>
            </Overlay>,
            //вторім аргументом передаю ссілку на портал
            modalRoot
        );
    }
}