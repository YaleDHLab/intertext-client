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
      <select className='sort-results' value={this.props.sortField} onChange={this.handleChange}>
        <option disabled>Sort By</option>
        <option value='similarity'>Similarity</option>
        <option value='length'>Length</option>
        <option value='author'>Author</option>
        <option value='title'>Title</option>
        <option value='year'>Date</option>
      </select>
    );
  }
}

const mapStateToProps = state => ({
  sortField: state.search.sortField,
});

const mapDispatchToProps = dispatch => ({
  setSortAndSearch: field => dispatch(setSortAndSearch(field)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SortResults);
