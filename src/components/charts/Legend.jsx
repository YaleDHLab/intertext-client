import React from 'react';
import { colors } from './lib/color-lib';

const Legend = props => {
  const min = props.domain && props.domain[0] ? props.domain[0] : 50;
  const max = props.domain && props.domain[1] ? props.domain[1] : 100;
  const percents = 'percents' in props ? props.percents : true;
  return (
    <div className='chart-legend'>
      <span>{parse(min, percents)}</span>
      <div className='swatches'>
        {colors.map(c => (
          <div key={c} className='swatch' style={{ background: c }} />
        ))}
      </div>
      <span>{parse(max, percents)}</span>
    </div>
  );
};

const parse = (val, percents) => {
  return percents ? parseInt(val) + '%' : parseInt(val);
};

export default Legend;
