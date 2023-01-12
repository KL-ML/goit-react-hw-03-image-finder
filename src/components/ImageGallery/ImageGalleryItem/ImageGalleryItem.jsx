// import React, { PureComponent } from "react";
import React from 'react';
// import PropTypes from 'prop-types';
import { GalleryItemImage } from './ImageGalleryItem.styled';

// export class ImageGalleryItem extends PureComponent {
export const ImageGalleryItem = ({ largeImageURL, webformatURL, tags, id }) => {
    
    return (
        <>
            <GalleryItemImage
                src={webformatURL}
                alt={tags}
                href={largeImageURL}
                loading="lazy"
                id={id}
            />
        </>
    );
};
