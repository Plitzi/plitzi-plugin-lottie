// Packages
import React, { useCallback, useEffect, useRef, useState } from 'react';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import lottieWeb from 'lottie-web';

const emptyObject = {};

export const LOTTIE_DIRECTION_FORWARD = 1;
export const LOTTIE_DIRECTION_REVERSE = -1;

// https://github.com/airbnb/lottie-web
/**
 * @param {{
 *   className?: string;
 *   ref?: { current: any };
 *   id?: string;
 *   path?: string;
 *   renderer?: 'svg' | 'canvas' | 'html';
 *   play?: boolean;
 *   speed?: number;
 *   goTo?: number;
 *   segments?: [];
 *   useSubframes?: boolean;
 *   direction?: 1 | -1;
 *   autoplay?: boolean;
 *   loop?: boolean;
 *   animationData?: object;
 *   rendererSettings?: object;
 *   audioFactory?: object;
 *   onComplete?: () => void;
 *   onLoopComplete?: () => void;
 *   onEnterFrame?: () => void;
 *   onSegmentStart?: () => void;
 *   onLoad?: () => void;
 * }} props
 * @param {{
 *   current?: object;
 * }} ref
 * @returns {React.ReactElement}
 */
const LottiePlayer = props => {
  const {
    className = '',
    ref,
    id = '',
    path = '',
    renderer = 'svg',
    play = false,
    speed = 1,
    direction = 1,
    loop = false,
    autoplay = false,
    audioFactory,
    useSubframes = true,
    goTo,
    segments,
    animationData,
    rendererSettings = emptyObject,
    onComplete = noop,
    onLoopComplete = noop,
    onEnterFrame = noop,
    onSegmentStart = noop,
    onLoad = noop
  } = props;
  const refInternal = useRef(ref.current);
  const [ready, setReady] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    if (id) {
      lottieWeb.setIDPrefix(`${id}-prefix`);
    }

    let animationDataAux;
    if (animationData && typeof animationData === 'object') {
      // Prevent Memory Leaks from lottie-web due object mutations
      animationDataAux = cloneDeep(animationData);
    }

    animationRef.current = lottieWeb.loadAnimation({
      animationData: animationDataAux,
      path,
      container: refInternal.current,
      renderer,
      loop,
      autoplay,
      rendererSettings,
      ...(audioFactory ? { audioFactory } : {})
    });

    return () => {
      setReady(false);
      animationRef.current.destroy();
      animationRef.current = undefined;
    };
  }, [id, path, renderer, loop, autoplay, rendererSettings, audioFactory]);

  useEffect(() => {
    if (!animationRef.current) {
      return undefined;
    }

    animationRef.current.addEventListener('complete', onComplete);

    return () => {
      animationRef.current?.removeEventListener('complete', onComplete);
    };
  }, [onComplete]);

  useEffect(() => {
    if (!animationRef.current) {
      return undefined;
    }

    animationRef.current.addEventListener('loopComplete', onLoopComplete);

    return () => {
      animationRef.current?.removeEventListener('loopComplete', onLoopComplete);
    };
  }, [onLoopComplete]);

  useEffect(() => {
    if (!animationRef.current) {
      return undefined;
    }

    animationRef.current.addEventListener('enterFrame', onEnterFrame);

    return () => {
      animationRef.current?.removeEventListener('enterFrame', onEnterFrame);
    };
  }, [onEnterFrame]);

  useEffect(() => {
    if (!animationRef.current) {
      return undefined;
    }

    animationRef.current.addEventListener('segmentStart', onSegmentStart);

    return () => {
      animationRef.current?.removeEventListener('segmentStart', onSegmentStart);
    };
  }, [onSegmentStart]);

  const handleLoad = useCallback(
    e => {
      setReady(true);
      onLoad(e);
    },
    [onLoad]
  );

  useEffect(() => {
    if (!animationRef.current) {
      return undefined;
    }

    animationRef.current?.addEventListener('DOMLoaded', handleLoad);

    return () => {
      animationRef.current?.removeEventListener('DOMLoaded', handleLoad);
    };
  }, [handleLoad]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    animationRef.current.loop = loop;
  }, [ready, loop]);

  useEffect(() => {
    if (!ready || Number.isNaN(speed)) {
      return;
    }

    animationRef.current.setSpeed(speed);
  }, [speed, ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    animationRef.current.setDirection(direction);
  }, [direction, ready]);

  useEffect(() => {
    if (!ready || (!goTo && goTo !== 0)) {
      return;
    }

    const isFrame = true; // TODO
    if (play) {
      animationRef.current.goToAndPlay(goTo, isFrame);
    } else {
      animationRef.current.goToAndStop(goTo, isFrame);
    }
  }, [goTo, play, ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (animationRef.current.setSubframe) {
      animationRef.current.setSubframe(useSubframes);
    }
  }, [useSubframes, ready]);

  const wasPlayingSegmentsRef = useRef(false);
  useEffect(() => {
    if (!ready) {
      return;
    }

    function playReverse(lastFrame) {
      animationRef.current.goToAndPlay(lastFrame, true);
      animationRef.current.setDirection(direction);
    }

    if (play === true) {
      const force = true;
      wasPlayingSegmentsRef.current = !!segments;
      if (segments) {
        animationRef.current.playSegments(segments, force);

        // This needs to be called after playSegments or it will not play backwards
        if (direction === -1) {
          // TODO What if more than one segment
          const lastFrame = typeof segments[1] === 'number' ? segments[1] : segments[1][1];
          playReverse(lastFrame);
        }
      } else {
        if (wasPlayingSegmentsRef.current) {
          animationRef.current.resetSegments(force);
        }

        if (direction === -1) {
          const lastFrame = animationRef.current.getDuration(true);
          playReverse(lastFrame);
        } else {
          animationRef.current.play();
        }
      }
    } else if (play === false) {
      animationRef.current.pause();
    }
  }, [play, segments, ready, direction]);

  const handleRef = useCallback(current => {
    refInternal.current = current;
    if (ref) {
      ref.current = current;
    }
  }, []);

  return <div ref={handleRef} className={className} />;
};

export default LottiePlayer;
