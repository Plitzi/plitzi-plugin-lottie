// Packages
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactLottie from 'react-lottie-player';
import classNames from 'classnames';
import get from 'lodash/get';
import { RootElement } from '@plitzi/plitzi-sdk'; // usePlitziServiceContext

// Styles
import './Assets/index.scss';

const emptyObject = {};

/**
 * @param {{
 *   className?: string;
 *   internalProps?: Record<string, unknown>;
 *   url?: string;
 *   autoplay?: boolean;
 *   loop?: boolean;
 *   clearOnStop?: boolean;
 *   mode?: 'hover' | 'focus' | 'click' | 'custom';
 * }} props
 * @returns {React.ReactElement}
 */
const Lottie = props => {
  const {
    ref,
    className = '',
    url = '',
    autoplay = true,
    loop = true,
    clearOnStop = false,
    mode = 'custom',
    internalProps = emptyObject
  } = props;
  const lottieRef = useRef();
  const [play, setPlay] = useState(autoplay);

  useEffect(() => {
    setPlay(autoplay);
  }, [autoplay]);

  const handleMouseEnter = useCallback(() => {
    if (mode === 'hover') {
      setPlay(true);
    }
  }, [mode]);

  const handleMouseLeave = useCallback(() => {
    if (mode === 'hover') {
      setPlay(false);
      if (clearOnStop) {
        lottieRef.current.stop();
      }
    }
  }, [mode, clearOnStop]);

  const handlePlayAnimation = useCallback(() => {
    setPlay(true);
  }, []);

  const handleStopAnimation = useCallback(
    params => {
      setPlay(false);
      if (params.clearOnStop) {
        lottieRef.current.stop();
      }
    },
    [lottieRef.current]
  );

  const interactionCallbacks = useMemo(() => {
    const label = get(internalProps, 'definition.label', 'Modal');

    return {
      playAnimation: {
        title: `Lottie ${label} - Play Animation`,
        callback: handlePlayAnimation,
        preview: {},
        params: {}
      },
      stopAnimation: {
        title: `Lottie ${label} - Stop Animation`,
        callback: handleStopAnimation,
        preview: {},
        params: {
          clearOnStop: {
            label: 'Clear On Stop',
            canBind: true,
            type: 'boolean',
            defaultValue: false
          }
        }
      }
    };
  }, [handlePlayAnimation, handleStopAnimation, internalProps?.definition?.label]);

  return (
    <RootElement
      ref={ref}
      internalProps={internalProps}
      className={classNames('plitzi-component__lottie', className)}
      interactionCallbacks={interactionCallbacks}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactLottie ref={lottieRef} className="lottie__container" loop={loop} path={url} play={play} />
    </RootElement>
  );
};

export default Lottie;
