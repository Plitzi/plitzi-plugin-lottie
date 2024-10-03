// Packages
import React from 'react';
import classNames from 'classnames';
import { RootElement, usePlitziServiceContext } from '@plitzi/plitzi-sdk';

// Styles
import './Assets/index.scss';

const emptyObject = {};

/**
 * @param {{
 *   className?: string;
 *   internalProps?: Record<string, unknown>;
 *   content?: string;
 * }} props
 * @returns {React.ReactElement}
 */
const Demo = props => {
  const { ref, className = '', internalProps = emptyObject, content = 'Demo Component' } = props;
  const {
    settings: { previewMode }
  } = usePlitziServiceContext();

  if (!previewMode) {
    return (
      <RootElement
        ref={ref}
        internalProps={internalProps}
        className={classNames('plitzi-component__demo text-red-500', className)}
      >
        Hi, this is a Plitzi demo component Preview Mode False
      </RootElement>
    );
  }

  return (
    <RootElement ref={ref} internalProps={internalProps} className={classNames('plitzi-component__demo', className)}>
      {content}
    </RootElement>
  );
};

export default Demo;
