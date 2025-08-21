import { useState } from "react";
import {
  Stack,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Chip,
  Select,
  FormControl,
  Autocomplete,
  TextField,
  useMediaQuery
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";


//subsequent selected tags on browser.. only the first X can be clicked to remove or on the dropdown.
//when last tag is deselected, if dropdown is open, close it.

const MultiSelect = ({ options, optionCount, stateOptions, setOptions, isMobile, targetSize = { width: 'auto', height: 'auto' } }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Check viewport width
  const isSmallViewport = useMediaQuery('(max-width:1399px)');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleMenuItemClose = () => {
    if(stateOptions.length === 0){

    }
  }
  return (
    <FormControl
      sx={{
        flex: 1,
        left: isMobile ? '4%' : 'auto',
        pt: isMobile ? 2 : (isSmallViewport ? 1 : 0),
        m: !isMobile ? 1 : 0,
        width: targetSize.width > 0 ? `${targetSize.width}px` : 'auto',
        height: targetSize.height > 0 ? `${targetSize.height}px` : 'auto',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'white' }, // Outline color
          '&:hover fieldset': { borderColor: 'lightgray' }, // Hover effect
          '&.Mui-focused fieldset': { borderColor: 'white' }, // Focused border color
        },
        '& .MuiInputLabel-root': { 
            color: 'white', 
            top: isMobile ? '50%' : isSmallViewport ? '55%' : '50%',
            left: '50%', 
            transform: isMobile ? 'translate(-50%, -35%)' : 'translate(-50%, -50%)', 
            textAlign: 'center',
        },
        '& .MuiInputLabel-shrink': {
          transform: isMobile ? 'translate(18px, -15px) scale(0.55)' : 'translate(14px, -10%) scale(0.75)',
          top: 'auto',
          left: 'auto',
          textAlign: 'left'
        },
        '& .MuiSelect-select': {
          color: 'white', // Selected text color
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'center'
        },
      }}
    >
      <InputLabel style={{ color: 'white', fontSize: isMobile ?  '1em' : 'auto' }}>TAGS</InputLabel>
      <Select
        multiple
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        value={stateOptions}
        onChange={(e) => {
          setOptions(e.target.value);
          handleClose(); // Close dropdown after selection/deselection
        }}
        input={
          isMobile ?
        <OutlinedInput label="TAGS"
          sx={{
            mt: isMobile ? '-4% !important' : 'auto',
            // height: "33%", // Reduce height
            "& .MuiSelect-select": {
              padding: "4px 8px", // Adjust padding
              minHeight: "20% !important",
            },
            "& fieldset": {
              height: "40px", // Ensure border stays aligned
            },
            // Remove incorrect 100% width/height from mobile input sx
            // width: '100%',
            // height: '100%',
          }} />
         : <OutlinedInput 
              label="TAGS" 
              sx={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box'
              }}
            />
        }
        renderValue={(selected) => (
          <Stack gap={1} direction="row" flexWrap="nowrap" sx={{ overflow: 'hidden' }}>
            {/* If mobile & multiple items are selected, show only an ellipsis button */}
            {isMobile && selected.length > 1 ? (
              <Chip
                label="..."
                sx={{ color: 'white', bgcolor: '#333', fontSize: isMobile ?  '0.55em' : '0.75em' }}
              />
            ) : (
              selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  sx={{ color: 'white', bgcolor: '#333', fontSize: isMobile ? '0.5em' : 'auto' }}
                  onDelete={() => {
                    setOptions(stateOptions.filter((item) => item !== value));
                    handleClose(); // Close dropdown after deleting chip
                  }}
                  deleteIcon={
                    <CancelIcon onMouseDown={(event) => event.stopPropagation()} />
                  }
                />
              ))
            )}
          </Stack>
        )}
      >
        {options.map((name) => (
            <MenuItem
            key={name}
            value={name}
            sx={{ justifyContent: 'space-between', fontSize: isMobile ? '0.8em' : 'auto'
             }}
          >
            {optionCount.find(tag => tag.startsWith(name)) || name}
            {stateOptions.includes(name) ? <CheckIcon color="info" /> : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
