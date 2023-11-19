import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton, Input, Toolbar } from '@mui/material';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
export interface MobileSearchProps {
  open: boolean;
  onClose: () => void;
}

/**
 * TODO PredictiveSearchForm and PredictiveSearchResults
 */
export function MobileSearch({ open, onClose }: MobileSearchProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (!open) {
    return null;
  }

  return (
    <Toolbar
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        navigate('/search?q=' + encodeURIComponent(search));
        onClose();
      }}
      sx={{ display: { xs: open ? 'flex' : 'none', md: 'none' } }}
    >
      <IconButton
        color="inherit"
        edge="start"
        sx={{ mr: 1 }}
        onClick={() => onClose()}
      >
        <ArrowBackIcon />
      </IconButton>
      <Input
        type="search"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        placeholder="Search"
      />
    </Toolbar>
  );
}
