import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTypeaheadField } from '../../actions/typeahead';

class TypeaheadSelect extends React.Component {
  render() {
    return (
      <div className="typeahead-select-container">
        <select
          className="custom-select"
          onChange={this.props.setTypeaheadField}
          value={this.props.field}
        >
          <option disabled>Search By</option>
          <option value="author">Author</option>
          <option value="title">Title</option>
        </select>
      </div>
    );
  }
}

TypeaheadSelect.propTypes = {
  field: PropTypes.string.isRequired,
  setTypeaheadField: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  field: state.typeahead.field,
});

const mapDispatchToProps = (dispatch) => ({
  setTypeaheadField: (event) =>
    dispatch(setTypeaheadField(event.target.value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TypeaheadSelect);
