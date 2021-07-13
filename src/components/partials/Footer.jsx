import React from 'react';
import mark from '../../assets/images/yale-mark.svg';

class Footer extends React.Component {
  render() {
    return (
      <footer className='row space-between align-center'>
        <img
            className="yale-mark"
            src={mark}
            alt="Yale University Watermark"
          />
        <div className="experiment">An experiment of the Yale DHLab</div>
      </footer>
    );
  }
}

export default Footer;
