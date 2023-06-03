import React, { useRef, useState } from 'react';
import { Button, Grid, InputAdornment, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  accept?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
}

const FileInput: React.FC<Props> = ({
  onChange,
  name,
  label,
  accept = '*',
  disabled = false,
  error = false,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filename, setFilename] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name);
    } else {
      setFilename('');
    }

    onChange(e);
  };

  const activateInput = () => {
    if (disabled) return;
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type="file"
        name={name}
        onChange={onFileChange}
        ref={inputRef}
        accept={accept}
      />
      <Grid container direction="row" spacing={2} alignItems="center" mb={2}>
        <Grid item xs>
          <TextField
            label={label}
            value={filename}
            fullWidth
            required={required}
            onClick={activateInput}
            error={error}
            InputProps={{
              startAdornment: (
                <InputAdornment position={'start'}>
                  <ImageIcon />
                </InputAdornment>
              ),
            }}
            sx={{ pointerEvents: 'none' }}
          />
        </Grid>
        <Grid item>
          <Button disabled={disabled} type="button" variant="contained" onClick={activateInput} size="small">
            Upload
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
