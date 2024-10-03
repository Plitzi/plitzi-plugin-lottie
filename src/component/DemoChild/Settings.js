// Packages
import React, { useCallback } from 'react';
import noop from 'lodash/noop';
// import Input from '@plitzi/plitzi-ui/Input';

/**
 * @param {{
 *   content?: string;
 *   onUpdate?: (key: string, value: string) => void;
 * }} props
 * @returns {React.ReactElement}
 */
const Settings = props => {
  const { content = '', onUpdate = noop } = props;

  const handleChangeContent = useCallback(e => onUpdate('content', e.target.value), [onUpdate]);

  return (
    <div className="flex flex-col">
      <div className="bg-[#1A2835] px-4 py-2 flex items-center justify-center">
        <h1 className="text-white m-0">Demo Child Settings</h1>
      </div>
      <div className="flex flex-col w-full px-4 py-2">
        <label>Content</label>
        <input value={content} onChange={handleChangeContent} className="rounded" />
      </div>
    </div>
  );
};

export default Settings;
