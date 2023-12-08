import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';


export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
    fontSize: 16,
    color: `${theme.palette.primary.main}`,
    display: 'flex',
    width: '100%',
    height: '60px',
    fontWeight: 'bold',
    borderRadius: '5px',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${theme.palette.primary.main}`,
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    backgroundColor: 'transparent',
    '&:hover': {
        color: `${theme.palette.secondary.main}`,
        fontWeight: 'bold',
        borderColor: `${theme.palette.primary.main}`,
        backgroundColor: `${theme.palette.primary.main}`,
    },
    '& Mui-disabled': {
        borderColor: `${theme.palette.primary.main}`
    },
    '& .MuiLoadingButton-root': {
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: 'transparent'
    },
    '&.MuiLoadingButton-loading': {
        border: `2px solid ${theme.palette.primary.main}`,
    },
    '& .MuiLoadingButton-loadingIndicator': {
        color: `${theme.palette.primary.main}`,
        fontWeight: 'bold',
    }
}))
