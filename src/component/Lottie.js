// Packages
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import ReactLottie from 'react-lottie-player';
import classNames from 'classnames';
import get from 'lodash/get';
import { RootElement } from '@plitzi/plitzi-sdk'; // usePlitziServiceContext

// Relatives
import ReactLottie from './LottiePlayer';

// Styles
import './Assets/index.scss';

const emptyObject = {};

/**
 * @param {{
 *   className?: string;
 *   internalProps?: Record<string, unknown>;
 *   url?: string;
 *   autoPlay?: boolean;
 *   loop?: boolean;
 *   clearOnStop?: boolean;
 *   reversePlayOnStop?: boolean;
 *   direction: number;
 *   mode?: 'hover' | 'focus' | 'click' | 'interaction' | 'custom';
 * }} props
 * @returns {React.ReactElement}
 */
const Lottie = props => {
  const {
    ref,
    className = '',
    url = '',
    autoPlay = true,
    loop = true,
    clearOnStop = false,
    reversePlayOnStop = false,
    direction: directionProp = 1,
    mode = 'custom',
    internalProps = emptyObject
  } = props;
  const lottieRef = useRef(null);
  const [playState, setPlayState] = useState(autoPlay);
  const [direction, setDirection] = useState(directionProp);

  useEffect(() => {
    setDirection(directionProp);
  }, [directionProp]);

  useEffect(() => {
    setPlayState(autoPlay);
  }, [autoPlay]);

  const play = useCallback(() => {
    setPlayState(true);
    if (reversePlayOnStop) {
      setDirection(1);
    }
  }, [reversePlayOnStop]);

  const stop = useCallback(
    clearOnStopAux => {
      if (clearOnStopAux && !reversePlayOnStop) {
        setPlayState(false);
        lottieRef.current.stop();
        setPlayState(reversePlayOnStop);
      } else if (reversePlayOnStop) {
        setDirection(-1);
      }
    },
    [reversePlayOnStop]
  );

  const handleMouseEnter = useCallback(() => {
    if (mode !== 'hover') {
      return;
    }

    play();
  }, [mode, play]);

  const handleMouseLeave = useCallback(() => {
    if (mode !== 'hover') {
      return;
    }

    stop(clearOnStop);
  }, [mode, clearOnStop, stop]);

  const handlePlayAnimation = useCallback(() => {
    if (mode !== 'interaction') {
      return;
    }

    play();
  }, [play, mode]);

  const handleStopAnimation = useCallback(
    params => {
      if (mode !== 'interaction') {
        return;
      }

      stop(params.clearOnStop);
    },
    [stop, mode]
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

  const handleLoopComplete = useCallback(() => {
    console.log('called end');
    setPlayState(false);
  }, [direction, reversePlayOnStop]);

  return (
    <RootElement
      ref={ref}
      internalProps={internalProps}
      className={classNames('plitzi-component__lottie', className)}
      interactionCallbacks={interactionCallbacks}
      direction={direction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactLottie
        ref={lottieRef}
        id={internalProps.id}
        // renderer="svg"
        // rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        className="lottie__container"
        loop={loop}
        path={url}
        play={playState}
        direction={direction}
        onLoopComplete={handleLoopComplete}
      />
    </RootElement>
  );
};

export default Lottie;
