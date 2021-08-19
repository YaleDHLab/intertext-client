import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { Link } from 'react-router-dom';
import * as typeaheadActions from '../../actions/typeahead';
import * as searchActions from '../../actions/search';
import { history } from '../../store';

const Works = props => {
  const sorted = orderBy(props.metadata, 'author');

  const onClick = (title, e) => {
    e.preventDefault();
    props.clearAdvancedFilterType('earlier');
    props.clearAdvancedFilterType('later');
    props.setTypeaheadField('title');
    props.setTypeaheadQuery(title);
    props.fetchSearchResults();
    history.push('/cards');
  };

  return (
    <div id='page-works'>
      <h1>Works</h1>
      <div>
        {sorted.map((m, idx) => (
          <div className='work-row' key={idx}>
            <div className='work-author'>{m.author}, </div>
            {m.matches ? (
              <Link to={'/cards'} onClick={e => onClick(m.title, e)}>
                {m.title}
              </Link>
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
  setSearchLoading: bool => dispatch(searchActions.setSearchLoading(bool)),
  setTypeaheadQuery: val => dispatch(typeaheadActions.setTypeaheadQuery(val)),
  setTypeaheadField: val => dispatch(typeaheadActions.setTypeaheadField(val)),
  clearAdvancedFilterType: val => dispatch(searchActions.clearAdvancedFilterType(val)),
  fetchSearchResults: () => dispatch(searchActions.fetchSearchResults()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Works);
