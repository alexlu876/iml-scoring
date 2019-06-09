import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Navbar = () => {
    return(
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                            React & Material-UI Sample Application
                    </Typography>
                    <Typography variant="subtitle">
                            <a href='http://nyan.cat'> jjjj andrew wuz here </a>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}
function App() {
  return (
      <div>
      <Navbar />
      </div>
  );
}

export default App;
