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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nameToFetch) {
      setStatus('pending');
      getDataFromAPI(nameToFetch).then(data => {
        setArrayOfImages(data.hits);
        if (data.hits.length > 0) {
          setStatus('resolved');
        } else {
          setStatus('rejected');
        }
      }).catch(error => {
        console.error("Error fetching data:", error);
        setStatus('rejected');
      });
    }
  }, [nameToFetch]);

  useEffect(() => {
    if (currentPage > 1 && status === 'resolved') {
      setLoading(true);

      loadMoreDataFromAPI(currentPage).then(data => {
        setArrayOfImages(prevArray => [...prevArray, ...data.hits]);
        setLoading(false);
      });
    }
  }, [currentPage, status]);

  const loadMoreData = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const onImageClick = e => {
    const imgToFind = arrayOfImages.find(img => img.webformatURL === e.currentTarget.src);
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
    return <div>Error loading data</div>;
  }

  if (status === 'resolved') {
    return (
      <>
        <ImageGalleryList>
          {arrayOfImages.length > 0 &&
            arrayOfImages.map(img => (
              <ImageGalleryItem
                onClick={onImageClick}
                tags={img.tags}
                webformatURL={img.webformatURL}
                key={img.id}
              />
            ))}
        </ImageGalleryList>
        {loading && <LoaderSpinner />}
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
