
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';



export const StyledLabel = styled(InputLabel)(({ theme }) => ({
    color: '#feefb7',
    fontWeight: 'bold',
    borderRadius: '4px',
    padding: '2px 10px',
    backgroundColor: 'rgb(30, 31, 28)',

    '&.Mui-focused': {
        color: '#feefb7',
        fontWeight: 'bold',
    },
    '&.Mui-selected': {
        color: '#feefb7',
        fontWeight: 'bold',
    }
}));

export const StyledSelect = styled(Select)({
    '&.MuiSvgIcon-root': {
        fill: '#feefb7',
    },
    '&.MuiOutlinedInput-root.Mui-focused': {
        border: '2px solid #feefb7 !important',
        boxShadow: '0 0 0 0.1rem rgba(254, 239, 183, 0.25)',
    },
    '&:active': {
        border: '2px solid #feefb7',
        boxShadow: '0 0 0 0.1rem rgba(254, 239, 183, 0.25)'
    },
    '& .MuiNativeSelect-iconOutlined': {
        fill: '#feefb7',
    },
    '&.MuiNativeSelect-select': {
        fontSize: 16,
        fill: '#feefb7',
        color: '#feefb7',
        borderColor: '#feefb7',

        '&:focus': {
            borderColor: '#feefb7',
            boxShadow: '0 0 0 0.1rem rgba(254, 239, 183, 0.25)'
        },

        '&:hover': {
            borderColor: '#dccd95',
            boxShadow: '0 0 0 0.1rem rgba(220, 205, 149, 0.25)',
        },
    },
    '&.MuiOutlinedInput-root': {
        fontSize: 16,
        fill: '#feefb7',
        color: '#feefb7',
        borderColor: '#feefb7',
        border: '2px solid #feefb7',

        '&:focus': {
            borderColor: '#feefb7',
            boxShadow: '0 0 0 0.1rem rgba(254, 239, 183, 0.25)'
        },

        '&:hover': {
            borderColor: '#dccd95',
            boxShadow: '0 0 0 0.1rem rgba(220, 205, 149, 0.25)',
        },
    }
});

