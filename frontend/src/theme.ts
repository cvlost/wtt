import { createTheme } from '@mui/material';

const darkblue = '#2c3e50';
const darkblueHover = '#1a252f';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: 'small',
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: darkblue,
            '&:hover': {
              backgroundColor: darkblueHover,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
