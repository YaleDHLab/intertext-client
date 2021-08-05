import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { Link } from 'react-router-dom';
import * as typeaheadActions from '../../actions/typeahead'
import * as searchActions from '../../actions/search'

const Works = props => {
  const sorted = orderBy(props.metadata, 'author');

  const onClick = title => {
    props.setTypeaheadField('title');
    props.setTypeaheadQuery(title);
    props.fetchSearchResults();
  }

  return (
    <div id='page-works'>
      <h1>Works</h1>
      <div>
        {sorted.map((m, idx) => (
          <div className='work-row' key={idx}>
            <div className='work-author'>{m.author}, </div>
            {m.matches ? (
              <Link to={'/cards'} onClick={() => onClick(m.title)}>{m.title}</Link>
            ) : (
              <div className='work-title'>{m.title}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  metadata: state.typeahead.metadata || [],
});

const mapDispatchToProps = dispatch => ({
  setTypeaheadQuery: val => dispatch(typeaheadActions.setTypeaheadQuery(val)),
  setTypeaheadField: val => dispatch(typeaheadActions.setTypeaheadField(val)),
  fetchSearchResults: () => dispatch(searchActions.fetchSearchResults()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Works);
