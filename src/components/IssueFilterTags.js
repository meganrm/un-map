import React from 'react';
import { Tag } from 'antd';
import { find, without } from 'lodash';
import PropTypes from 'prop-types';

import { ACTION_TYPES } from '../constants';

const { CheckableTag } = Tag;

/* eslint-disable */
require('style-loader!css-loader!antd/es/tag/style/index.css');
/* eslint-enable */

class IssueFilterTags extends React.Component {

  handleChange(tag, checked) {
    const {
      onFilterChanged,
      selectedFilters,
    } = this.props;
    const nextSelectedTags = checked ?
      [...selectedFilters, tag.number] :
      selectedFilters.filter(t => t !== tag.number);
    onFilterChanged(nextSelectedTags);
  }

  render() {
    const {
      selectedFilters,
    } = this.props;
    const { colorMap } = this.props;

    return (
      <div>
        <h6 style={{ display: 'inline', marginRight: 8 }}>Filter by action type:</h6>
        {ACTION_TYPES.map((tag) => {
          const mapping = find(colorMap, { filterBy: tag });
          const color = mapping ? mapping.icon.toLowerCase() : 'circle-stroked-15-grey';
          return (
            <CheckableTag
              key={tag.number}
              checked = {
                selectedFilters.indexOf(tag.number) > -1
              }
              onChange={checked => this.handleChange(tag, checked)}
              className={color}
            >
              {tag.title}
            </CheckableTag>
        );
      })}

      </div>
    );
  }
}

IssueFilterTags.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  issues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IssueFilterTags;
