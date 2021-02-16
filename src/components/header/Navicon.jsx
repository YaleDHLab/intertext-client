import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { open, close } from '../../actions/navicon';
import { Link } from 'react-router-dom';
import navicon from '../../assets/images/icons/navicon.svg';

class Navicon extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleClick.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick.bind(this), false);
  }

  handleClick(e) {
    if (e.target.id !== 'navicon' && e.target.tagName !== 'A') {
      this.props.close();
    }
  }

  render() {
    return (
      <nav onClick={this.props.open}>
        <img
          src={navicon}
          id="navicon"
          type="image/svg+xml"
          alt="hamburger icon"
        />
        <div className={'header-links-container ' + this.props.display}>
          <div className="header-links">
            <Link className="header-link" to={'/about'}>
              About
            </Link>
            <Link className="header-link" to={'/user'}>
              User&nbsp;Guide
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

Navicon.propTypes = {
  close: PropTypes.func.isRequired,
  display: PropTypes.string.isRequired,
  open: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  display: state.navicon
});

const mapDispatchToProps = (dispatch) => ({
  open: () => dispatch(open()),
  close: () => dispatch(close())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navicon);
