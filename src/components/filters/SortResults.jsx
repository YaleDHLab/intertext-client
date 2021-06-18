import React from 'react';
import { connect } from 'react-redux';
import { setSortAndSearch } from '../../actions/search';

class SortResults extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.setSortAndSearch(e.target.value);
  }

  render() {
    return (
      <select
        className="sort-results"
        value={this.props.sortField}
        onChange={this.handleChange}
      >
        <option value="author">Author</option>
        <option value="year">Publication Year</option>
        <option value="similarity">Similarity</option>
      </select>
    );
  }
}

const mapStateToProps = (state) => ({
  sortField: state.search.field
});

const mapDispatchToProps = (dispatch) => ({
  setSortAndSearch: (field) => dispatch(setSortAndSearch(field))
});

export default connect(mapStateToProps, mapDispatchToProps)(SortResults);
