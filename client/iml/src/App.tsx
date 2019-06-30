import React from 'react';
import NavHeader from './components/Header/HeaderNav/HeaderNav';
import HeaderDrawer from './components/Header/HeaderDrawer/HeaderDrawer';



const Navbar = () => {
    return(
        <div>
            <NavHeader />
            <HeaderDrawer />
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
