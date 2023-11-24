import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ImageGalleryList } from './ImageGallery.styled';
import { getDataFromAPI, loadMoreDataFromAPI } from 'utils/API';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { LoaderSpinner } from 'components/Loader/Loader';
import { LoadMoreBtn } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';


export function ImageGallery({ nameToFetch }) {
  const [arrayOfImages, setArrayOfImages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [tagsForModal, setTagsForModal] = useState('');

  useEffect(() => {
    if (nameToFetch) {
      setStatus('pending');
      getDataFromAPI(nameToFetch).then(data => {
        setArrayOfImages(data.hits);
        if (data.hits.length > 0) {
          setStatus('resolved');
          return;
        }
        setStatus('rejected');
      });
    }
  }, [nameToFetch]);

  const loadMoreData = () => {
    loadMoreDataFromAPI().then(data => {
      setArrayOfImages(prevArray => {
        return [...prevArray, ...data.hits];
      });
    });
  };
  const onImageClick = e => {
    const imgToFind = arrayOfImages.find(
      img => img.webformatURL === e.currentTarget.src
    );
    setLargeImg(imgToFind.largeImageURL);
    setTagsForModal(imgToFind.tags);
    setIsModalVisible(true);
  };
  const modalClose = e => {
    setIsModalVisible(false);
  };

  if (status === 'pending') {
    return <LoaderSpinner />;
  }
  if (status === 'rejected') {
    return;
  }

  if (status === 'resolved') {
    return (
      <>
        <ImageGalleryList>
          {arrayOfImages.length > 0 &&
            arrayOfImages.map(img => {
              return (
                <ImageGalleryItem
                  onClick={onImageClick}
                  tags={img.tags}
                  webformatURL={img.webformatURL}
                  key={img.id}
                />
              );
            })}
        </ImageGalleryList>
        <LoadMoreBtn loadMoreData={loadMoreData} />
        {isModalVisible && (
          <Modal
            modalClose={modalClose}
            largeImg={largeImg}
            tags={tagsForModal}
          />
        )}
      </>
    );
  }
}

ImageGallery.propTypes = {
  nameToFetch: PropTypes.string,
};