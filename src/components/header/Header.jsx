import React from 'react';
import { Link } from 'react-router-dom';
import brand from '../../assets/images/intertext.png';

const Header = (props) => (
  <header>
    <div className="header-text row align-center">
      <Link className="brand" to="/">
        <img src={brand} alt="Intertext brand logo" />
      </Link>
    </div>
  </header>
);

export default Header;
