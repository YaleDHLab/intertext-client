import React from 'react';
import Typeahead from '../typeahead/Typeahead';
import { Link } from 'react-router-dom';
import brand from '../../assets/images/intertext.png';

const Header = (props) => (
  <header>
    <div className="header-text">
      <Link className="brand" to="/insights">
        <img src={brand} alt="Intertext brand logo" />
      </Link>
      <Typeahead />
    </div>
  </header>
);

export default Header;
