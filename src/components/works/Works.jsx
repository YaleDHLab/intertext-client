import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { Link } from 'react-router-dom';

const Works = props => {
  const sorted = orderBy(props.metadata, 'author');
  return (
    <div id='page-works'>
      <h1>Works</h1>
      <div>
        {sorted.map((m, idx) => (
          <div className='work-row' key={idx}>
            <div className='work-author'>{m.author}, </div>
            {m.matches ? (
              <Link to={`/cards?earlier=${m.id}`}>{m.title}</Link>
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

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Works);
