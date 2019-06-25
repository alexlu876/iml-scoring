import React from 'react';
import NavHeader from './components/Header/HeaderNav/HeaderNav';



const Navbar = () => {
    return(
        <div>
            <NavHeader />
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
