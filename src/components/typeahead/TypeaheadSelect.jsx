import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTypeaheadFieldAndFetch } from '../../actions/typeahead';

class TypeaheadSelect extends React.Component {
  render() {
    return (
      <div className="typeahead-select-container">
        <select
          className="custom-select"
          onChange={this.props.setTypeaheadFieldAndFetch}
          value={this.props.field}
        >
          <option disabled>Search By</option>
          <option value="Author">Author</option>
          <option value="Title">Title</option>
        </select>
      </div>
    );
  }
}

TypeaheadSelect.propTypes = {
  field: PropTypes.string.isRequired,
  setTypeaheadFieldAndFetch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  field: state.typeahead.field
});

const mapDispatchToProps = (dispatch) => ({
  setTypeaheadFieldAndFetch: (event) =>
    dispatch(setTypeaheadFieldAndFetch(event.target.value))
});

export default connect(mapStateToProps, mapDispatchToProps)(TypeaheadSelect);
