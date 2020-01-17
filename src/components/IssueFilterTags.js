import React from 'react';
import { Tag } from 'antd';
import { find, without } from 'lodash';
import PropTypes from 'prop-types';

const { CheckableTag } = Tag;

/* eslint-disable */
require('style-loader!css-loader!antd/es/tag/style/index.css');
/* eslint-enable */

const eventTypes = [{
  number: '01',
  title: 'raising public awareness',
},
{
  number: '02',
  title:
  'conducting scientific research',
},
{ number: '03', title: 'taking action at work' },
{ number: '04', title: 'taking action at home' },
{ number: '05', title: 'giving financial resources' },
{ number: '06', title: 'other' }];

class IssueFilterTags extends React.Component {

  handleChange(tag, checked) {
    const {
      onFilterChanged,
      selectedFilters,
    } = this.props;
    console.log(tag, checked);
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
        <h6 style={{ display: 'inline', marginRight: 8 }}>Filter by issue:</h6>
        {eventTypes.map((tag) => {
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
