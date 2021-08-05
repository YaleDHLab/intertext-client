import React from 'react';
import mark from '../../assets/images/yale-mark.svg';

class Footer extends React.Component {
  render() {
    return (
      <footer className='row space-between align-center'>
        <a className='row align-center' href='https://dhlab.yale.edu'>
          <img className='yale-mark' src={mark} alt='Yale University Watermark' />
        </a>
        <div className='experiment'>An experiment of the Yale DHLab</div>
      </footer>
    );
  }
}

export default Footer;
