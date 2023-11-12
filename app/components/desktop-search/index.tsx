import {Search as SearchIcon} from '@mui/icons-material';
import {Box, Input} from '@mui/material';
import {useNavigate} from '@remix-run/react';
import {useState} from 'react';

export function DesktopSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        navigate('/search?q=' + encodeURIComponent(search));
      }}
      sx={{display: {xs: 'none', md: 'flex'}}}
    >
      <Input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        endAdornment={<SearchIcon sx={{opacity: 0.5, pointerEvents: 'none'}} />}
        sx={{mr: 3}}
      />
    </Box>
  );
}
