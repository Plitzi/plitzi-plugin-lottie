// Packages
import React, { useCallback } from 'react';
import noop from 'lodash/noop';
// import Input from '@plitzi/plitzi-ui/Input';

/**
 * @param {{
 *   url?: string;
 *   autoplay?: boolean;
 *   loop?: boolean;
 *   clearOnStop?: boolean;
 *   mode?: 'hover' | 'focus' | 'click' | 'custom';
 *   onUpdate?: (key: string, value: string) => void;
 * }} props
 * @returns {React.ReactElement}
 */
const Settings = props => {
  const { url = '', autoplay = true, loop = true, clearOnStop = false, mode = 'custom', onUpdate = noop } = props;

  const handleChangeUrl = useCallback(e => onUpdate('url', e.target.value), [onUpdate]);

  return (
    <div className="flex flex-col">
      <div className="bg-[#1A2835] px-4 py-2 flex items-center justify-center">
        <h1 className="text-white m-0">Lottie Settings</h1>
      </div>
      <div className="flex flex-col w-full px-4 py-2">
        <label>Url</label>
        <input value={url} onChange={handleChangeUrl} className="rounded" />
      </div>
    </div>
  );
};

export default Settings;
