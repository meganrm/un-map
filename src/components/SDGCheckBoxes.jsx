import React from 'react';
import { Button } from 'antd';
import { includes } from 'lodash';
import PropTypes from 'prop-types';

import classNames from 'classnames';

const options = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17'];

class SDGButtons extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange({ target }) {
    const { setSDGFilters, sdgFilters } = this.props;
    let newSelected;
    if (includes(sdgFilters, target.value)) {
      newSelected = sdgFilters.filter(ele => ele !== target.value);
    } else {
      newSelected = [...sdgFilters, target.value];
    }
    setSDGFilters(newSelected);
  }

  render() {
    const { sdgFilters } = this.props;
    return (

      <div className="button-wrapper" onClick={this.onChange}>
        {options.map(ele => (<Button key={ele} className={classNames([`E_SDG_Icons-${ele}`, { active: includes(sdgFilters, ele) }])} value={ele} />))}
      </div>
    );
  }
}

SDGButtons.propTypes = {
  sdgFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSDGFilters: PropTypes.func.isRequired,
};

export default SDGButtons;
