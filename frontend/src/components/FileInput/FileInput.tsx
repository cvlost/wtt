import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import FileUploadIcon from '@mui/icons-material/FileUpload';

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
  const [selectedFile, setSelectedFile] = useState<Blob | MediaSource | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState('');

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name);
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
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
      <Grid container>
        <Grid
          item
          container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {preview && <Avatar src={preview} sx={{ height: '70px', width: '70px', boxShadow: 2, mb: 2 }} />}
        </Grid>
        <Grid item container alignItems="center" flexWrap="nowrap" xs={12}>
          <ImageIcon sx={{ mr: 1 }} />
          <TextField
            label={label}
            value={filename}
            fullWidth
            required={required}
            onClick={activateInput}
            error={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={activateInput}>
                    <FileUploadIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
