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
    const fetchData = async () => {
      try {
        setStatus('pending');
        setCurrentPage(1);

        const data = await getDataFromAPI(nameToFetch);
        setArrayOfImages(data.hits);

        if (data.hits.length > 0) {
          setStatus('resolved');
        } else {
          setStatus('rejected');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus('rejected');
      }
    };

    fetchData();
  }, [nameToFetch]);

  useEffect(() => {
    const loadMoreData = async () => {
      try {
        setLoading(true);

        const data = await loadMoreDataFromAPI(nameToFetch, currentPage);
        setArrayOfImages(prevImages => [...prevImages, ...data.hits]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading more data:", error);
      }
    };

    if (currentPage > 1 && status === 'resolved') {
      loadMoreData();
    }
  }, [currentPage, nameToFetch, status]);

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleImageClick = (e) => {
    const imgToFind = arrayOfImages.find(img => img.webformatURL === e.currentTarget.src);

    setLargeImg(imgToFind.largeImageURL);
    setTagsForModal(imgToFind.tags);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  if (status === 'pending') {
    return <LoaderSpinner />;
  }

  if (status === 'rejected') {
    return <div>No images found</div>;
  }

  if (status === 'resolved') {
    return (
      <>
        <ImageGalleryList>
          {arrayOfImages.length > 0 &&
            arrayOfImages.map(img => (
              <ImageGalleryItem
                onClick={handleImageClick}
                tags={img.tags}
                webformatURL={img.webformatURL}
                key={img.id}
              />
            ))}
        </ImageGalleryList>
        {loading && <LoaderSpinner />}
        <LoadMoreBtn loadMoreData={handleLoadMore} />
        {isModalVisible && (
          <Modal
            modalClose={handleModalClose}
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
