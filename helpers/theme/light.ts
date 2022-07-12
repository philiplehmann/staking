import { createTheme } from '@mui/material/styles'

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small'
      }
    }
  }
})

export default lightTheme
