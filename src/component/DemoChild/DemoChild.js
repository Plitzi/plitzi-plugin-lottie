// Packages
import React from 'react';
import classNames from 'classnames';
import { RootElement, usePlitziServiceContext } from '@plitzi/plitzi-sdk';

// Styles
import '../Assets/index.scss';

const emptyObject = {};

/**
 * @param {{
 *   className?: string;
 *   internalProps?: Record<string, unknown>;
 *   content?: string;
 * }} props
 * @returns {React.ReactElement}
 */
const DemoChild = props => {
  const { ref, className = '', internalProps = emptyObject, content = 'Demo Child Component' } = props;
  const {
    settings: { previewMode }
  } = usePlitziServiceContext();

  if (!previewMode) {
    return (
      <RootElement
        ref={ref}
        internalProps={internalProps}
        className={classNames('plitzi-component__demo-child text-red-500', className)}
      >
        Hi, this is a Plitzi demo child component Preview Mode False
      </RootElement>
    );
  }

  return (
    <RootElement
      ref={ref}
      internalProps={internalProps}
      className={classNames('plitzi-component__demo-child', className)}
    >
      {content}
    </RootElement>
  );
};

export default DemoChild;
