import React from 'react';
import { Link } from 'react-router-dom';
import brand from '../../assets/images/intertext.png';
import { connect } from 'react-redux';

const routes = [
  {
    route: '/',
    label: 'Cards',
  },
  {
    route: '/sankey',
    label: 'Sankey',
  },
];

const Header = (props) => {
  return (
    <header>
      <div className="header-text row align-center space-between">
        <Link className="brand" to="/">
          <img src={brand} alt="Intertext brand logo" />
        </Link>
        <nav className="row align-center">
          {routes.map((r) => (
            <Link
              key={r.route}
              to={r.route}
              className={props.route === r.route ? 'active' : ''}
            >
              {r.label}
            </Link>
          ))}
        </nav>
        {/* Equal width as the brand text to center the links */}
        <div style={{ width: '132px' }} />
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  route: state.router.location.pathname,
});

export default connect(mapStateToProps)(Header);
