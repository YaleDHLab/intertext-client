import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../../actions/favorite';
import { visualize } from '../../actions/waffle';
import ReadIcon from './icons/ReadIcon';
import FavoriteIcon from './icons/FavoriteIcon';
import VisualizeIcon from './icons/VisualizeIcon';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.getText = this.getText.bind(this);
    this.favorite = this.favorite.bind(this);
    this.visualize = this.visualize.bind(this);
    this.getFavoriteClass = this.getFavoriteClass.bind(this);
  }

  getText(field, prefix) {
    const text = this.props.result[this.props.type + '_' + field];
    prefix = prefix || '';
    return { __html: prefix + text };
  }

  favorite() {
    this.props.toggleFavorite({
      type: this.props.type,
      result: this.props.result,
    });
  }

  visualize() {
    this.props.visualize(
      Object.assign({}, this.props.result, {
        type: this.props.type,
      })
    );
  }

  getFavoriteClass() {
    const _id = this.props.result._id;
    const favs = this.props.favorites[this.props.type];
    return favs.indexOf(_id) > -1 ? 'favorite active' : 'favorite';
  }

  render() {
    const author = this.getText('author');
    return (
      <div className={`result col space-between flex-1`}>
        <div className='result-top row space-between align-center'>
          {this.props.type === 'source' || this.props.headerRight
            ? <HeaderLeft getText={this.getText} />
            : <HeaderRight getText={this.getText} />
          }
        </div>
        <div className='result-body flex-1'>
          {author && author.__html != 'Unknown'
          ? <div className='result-author' dangerouslySetInnerHTML={author} />
          : null}
          <div className='result-match'>
            <span className='prematch' dangerouslySetInnerHTML={this.getText('prematch')} />
            <span className='match' dangerouslySetInnerHTML={this.getText('match', ' ')} />
            <span className='postmatch' dangerouslySetInnerHTML={this.getText('postmatch', ' ')} />
          </div>
        </div>
        <div className='result-footer-container'>
          <div className='result-footer row'>
            {this.props.result[this.props.type + '_url'] ? (
              <>
                <a
                  className='read'
                  target='_blank'
                  href={this.props.result[this.props.type + '_url']}
                  rel='noreferrer'
                >
                  <ReadIcon />
                  Read
                </a>
              </>
            ) : null}
            <div onClick={this.favorite} className={this.getFavoriteClass()}>
              <FavoriteIcon />
              Favorite
            </div>
            <Link to={'waffle'} onClick={this.visualize} className='visualize'>
              <VisualizeIcon />
              Visualize
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const HeaderLeft = props => {
  return (
    <>
      <div className='result-title' dangerouslySetInnerHTML={props.getText('title')} />
      {props.getText('year') ? (
        <div className='result-year-container header-left'>
          <div className='result-year' dangerouslySetInnerHTML={props.getText('year')} />
        </div>
      ) : null}
    </>
  )
}

const HeaderRight = props => {
  return (
    <>
      <div className='result-year-container header-right'>
        <div className='result-year' dangerouslySetInnerHTML={props.getText('year')} />
      </div>
      <div className='result-title' dangerouslySetInnerHTML={props.getText('title')} />
    </>
  )
}

export const CardProps = PropTypes.shape({
  _id: PropTypes.number,
  similarity: PropTypes.number.isRequired,
  source_author: PropTypes.string.isRequired,
  source_file_id: PropTypes.number.isRequired,
  source_filename: PropTypes.string.isRequired,
  source_match: PropTypes.string.isRequired,
  source_postmatch: PropTypes.string.isRequired,
  source_prematch: PropTypes.string.isRequired,
  source_segment_ids: PropTypes.arrayOf(PropTypes.number.isRequired),
  source_title: PropTypes.string.isRequired,
  source_url: PropTypes.string,
  source_year: PropTypes.string.isRequired,
  target_author: PropTypes.string.isRequired,
  target_file_id: PropTypes.number.isRequired,
  target_file_path: PropTypes.string.isRequired,
  target_filename: PropTypes.string.isRequired,
  target_match: PropTypes.string.isRequired,
  target_postmatch: PropTypes.string.isRequired,
  target_prematch: PropTypes.string.isRequired,
  target_segment_ids: PropTypes.arrayOf(PropTypes.number.isRequired),
  target_title: PropTypes.string.isRequired,
  target_url: PropTypes.string,
  target_year: PropTypes.string.isRequired,
});

Card.propTypes = {
  compare: PropTypes.shape({
    file_id: PropTypes.number,
    segment_ids: PropTypes.string,
    type: PropTypes.string,
  }),
  favorites: PropTypes.shape({
    source: PropTypes.arrayOf(PropTypes.number),
    target: PropTypes.arrayOf(PropTypes.number),
  }),
  result: CardProps,
  toggleFavorite: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  visualize: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  favorites: state.favorites,
  compare: state.compare,
});

const mapDispatchToProps = dispatch => ({
  toggleFavorite: obj => dispatch(toggleFavorite(obj)),
  visualize: obj => dispatch(visualize(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
