import React from 'react';
import { connect } from 'react-redux';
import { setUnit } from '../actions/scatterplot';

const Home = (props) => {
  const { setUnit } = { ...props };
  return (
    <div className="home">
      <div className="home-top">
        <h1>Discovering Text Reuse</h1>
        <div>
          Intetext helps researchers visualize text reuse in large historical
          collections. To explore allusions and borrowings within this corpus,
          click one of the images below, or type a search into the search box
          above.
        </div>
      </div>
      <div className="home-blocks">
        <a
          href="/scatterplot?unit=author"
          className="home-block"
          onClick={setUnit.bind('author')}
        >
          <div className="home-image popular-authors" />
          <div>Popular Authors</div>
        </a>
        <a
          href="/scatterplot?unit=book"
          className="home-block"
          onClick={setUnit.bind('book')}
        >
          <div className="home-image popular-books" />
          <div>Popular Texts</div>
        </a>
        <a
          href="/scatterplot?unit=passage"
          className="home-block"
          onClick={setUnit.bind('passage')}
        >
          <div className="home-image popular-passages" />
          <div>Popular Passages</div>
        </a>
      </div>
      <div className="clear-both" />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  setUnit: (unit) => dispatch(setUnit(unit))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
