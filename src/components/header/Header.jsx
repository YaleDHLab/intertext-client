import React from 'react';
import { Link } from 'react-router-dom';
import brand from '../../assets/images/intertext.png';
import { connect } from 'react-redux';

const Header = (props) => {
  const isActive = route => {
    return props.route === route;
  }

  return (
    <header>
      <div className="header-text row align-center space-between">
        <Link className="brand" to="/">
          <img src={brand} alt="Intertext brand logo" />
        </Link>
        <nav className='row align-center'>
          {routes.map(r => (
            <Link key={r.route} to={r.route} className={isActive(r.route) ? 'active' : ''}>
              {r.label}
            </Link>
          ))}
        </nav>
        <div />
      </div>
    </header>
  )
}

const routes = [
  {
    route: '/',
    label: 'Cards',
  },
  {
    route: '/sankey',
    label: 'Sankey',
  }
]

const mapStateToProps = state => ({
  route: state.router.location.pathname,
})

export default connect(mapStateToProps)(Header);