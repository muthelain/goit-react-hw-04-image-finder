import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';

import {
  SearchBarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './Searchbar.styled';

export function  SearchBar ({onSubmit}){
  const [inputValue, setInputValue] = useState ('');

  const onInputChange = e => {
    setInputValue (e.currentTarget.value);
  };

  const onFormSubmit = e => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      return;
    }
    onSubmit(inputValue);
    setInputValue ('') ;
  };

    return (
      <SearchBarHeader>
        <SearchForm onSubmit={onFormSubmit}>
          <SearchFormButton type="submit">
            <SearchFormButtonLabel>
              <BsSearch size={26} />
            </SearchFormButtonLabel>
          </SearchFormButton>

          <SearchFormInput
            onChange={onInputChange}
            type="text"
            autocomplete="off"
            autoFocus
            value={inputValue}
            placeholder="Search images and photos"
          />
        </SearchForm>
      </SearchBarHeader>
    );
  }



SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};