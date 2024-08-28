import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import CloseIcon from '@mui/icons-material/Close';

import { useState, useEffect, memo } from 'react';

function Search({ label, handleSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const [showIconSearch, setShowIconSearch] = useState(false);

  const handleChangeInput = (e) => {
    const searchValue = e.target.value;
    setShowIconSearch(true);
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setShowIconSearch(false);
  };

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);

  return (
    <FormControl sx={{ mb: 3, width: '25%' }} variant='standard'>
      <OutlinedInput
        placeholder={label}
        sx={{ fontSize: '1.6rem' }}
        endAdornment={
          <InputAdornment position='end'>
            {showIconSearch ? (
              <IconButton edge='end' onClick={() => handleClearSearch()}>
                <CloseIcon />
              </IconButton>
            ) : null}
          </InputAdornment>
        }
        value={searchValue}
        onChange={(e) => handleChangeInput(e)}
      />
    </FormControl>
  );
}

export default memo(Search);
