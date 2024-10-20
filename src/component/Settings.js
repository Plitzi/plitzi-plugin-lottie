// Packages
import React, { useCallback } from 'react';
import noop from 'lodash/noop';
import Switch from '@plitzi/plitzi-ui-components/Switch';
import Select from '@plitzi/plitzi-ui-components/Select';
import Input from '@plitzi/plitzi-ui-components/Input';

/**
 * @param {{
 *   url?: string;
 *   autoPlay?: boolean;
 *   loop?: boolean;
 *   clearOnStop?: boolean;
 *   reversePlayOnStop?: boolean;
 *   direction: number;
 *   mode?: 'hover' | 'focus' | 'click' | 'interaction' | 'custom';
 *   onUpdate?: (key: string, value: string) => void;
 * }} props
 * @returns {React.ReactElement}
 */
const Settings = props => {
  const {
    url = '',
    autoPlay = true,
    loop = true,
    clearOnStop = false,
    reversePlayOnStop = false,
    direction = 1,
    mode = 'custom',
    onUpdate = noop
  } = props;

  const handleChangeUrl = useCallback(e => onUpdate('url', e.target.value), [onUpdate]);

  const handleChangeAutoPlay = useCallback(e => onUpdate('autoPlay', e.target.checked), [onUpdate]);

  const handleChangeLoop = useCallback(e => onUpdate('loop', e.target.checked), [onUpdate]);

  const handleChangeClearOnStop = useCallback(e => onUpdate('clearOnStop', e.target.checked), [onUpdate]);

  const handleChangeReversePlayOnStop = useCallback(e => onUpdate('reversePlayOnStop', e.target.checked), [onUpdate]);

  const handleChangeMode = useCallback(e => onUpdate('mode', e.target.value), [onUpdate]);

  const handleChangeDirection = useCallback(e => onUpdate('direction', Number(e.target.value)), [onUpdate]);

  return (
    <div className="flex flex-col">
      <div className="bg-[#1A2835] px-4 py-2 flex items-center justify-center">
        <h1 className="text-white m-0">Lottie Settings</h1>
      </div>
      <div className="flex flex-col grow p-2 gap-2">
        <div className="flex flex-col w-full py-2">
          <label>Url</label>
          <Input value={url} onChange={handleChangeUrl} inputClassName="rounded" />
        </div>
        <div className="flex gap-1">
          <Switch value={autoPlay} size="sm" className="!w-auto rounded" onChange={handleChangeAutoPlay}>
            Auto Play
          </Switch>
        </div>
        <div className="flex gap-1">
          <Switch value={loop} size="sm" className="!w-auto rounded" onChange={handleChangeLoop}>
            Loop
          </Switch>
        </div>
        <div className="flex gap-1">
          <Switch value={clearOnStop} size="sm" className="!w-auto rounded" onChange={handleChangeClearOnStop}>
            Clear on stop
          </Switch>
        </div>
        <div className="flex gap-1">
          <Switch
            value={reversePlayOnStop}
            size="sm"
            className="!w-auto rounded"
            onChange={handleChangeReversePlayOnStop}
          >
            Reverse play on stop
          </Switch>
        </div>
        <div className="flex flex-col w-full py-2">
          <label>Direction</label>
          <Select className="rounded" value={direction} onChange={handleChangeDirection}>
            <option value="1">Forward</option>
            <option value="-1">Reverse</option>
          </Select>
        </div>
        <div className="flex flex-col w-full py-2">
          <label>Mode</label>
          <Select className="rounded" value={mode} onChange={handleChangeMode}>
            <option value="hover">Hover</option>
            <option value="focus">Focus</option>
            <option value="click">Click</option>
            <option value="interaction">Interaction</option>
            <option value="custom">Custom</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
