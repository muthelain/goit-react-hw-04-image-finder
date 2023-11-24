import React, { useState } from 'react';
import { AppContainer } from './App.styled';
import { SearchBar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';

export function App() {
  const [nameToFetch, setNameToFetch] = useState(null);

  const onSubmit = name => {
    setNameToFetch(name);
  };

  return (
    <AppContainer>
      <SearchBar onSubmit={onSubmit} />
      <ImageGallery nameToFetch={nameToFetch}></ImageGallery>
    </AppContainer>
  );
}

