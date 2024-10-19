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
  const [animation, setAnimation] = useState();

  useEffect(() => {
    if (id) {
      lottieWeb.setIDPrefix(`${id}-prefix`);
    }

    let animationDataAux;
    if (animationData && typeof animationData === 'object') {
      // Prevent Memory Leaks from lottie-web due object mutations
      animationDataAux = cloneDeep(animationData);
    }

    const { current } = refInternal;
    const anim = lottieWeb.loadAnimation({
      animationData: animationDataAux,
      path,
      container: current,
      renderer,
      loop,
      autoplay,
      rendererSettings,
      ...(audioFactory ? { audioFactory } : {})
    });
    setAnimation(anim);

    return () => {
      setReady(false);
      setTimeout(() => {
        anim.destroy();
        setAnimation(undefined);
      }, 0);
    };
  }, [id, path, renderer, loop, autoplay, rendererSettings, audioFactory]);

  useEffect(() => {
    if (!animation) {
      return undefined;
    }

    animation.addEventListener('complete', onComplete);

    return () => {
      animation.removeEventListener('complete', onComplete);
    };
  }, [animation, onComplete]);

  useEffect(() => {
    if (!animation) {
      return undefined;
    }

    animation.addEventListener('loopComplete', onLoopComplete);

    return () => {
      animation.removeEventListener('loopComplete', onLoopComplete);
    };
  }, [animation, onLoopComplete]);

  useEffect(() => {
    if (!animation) {
      return undefined;
    }

    animation.addEventListener('enterFrame', onEnterFrame);

    return () => {
      animation.removeEventListener('enterFrame', onEnterFrame);
    };
  }, [animation, onEnterFrame]);

  useEffect(() => {
    if (!animation) {
      return undefined;
    }

    animation.addEventListener('segmentStart', onSegmentStart);

    return () => {
      animation.removeEventListener('segmentStart', onSegmentStart);
    };
  }, [animation, onSegmentStart]);

  const handleLoad = useCallback(
    e => {
      setReady(true);
      onLoad(e);
    },
    [onLoad]
  );

  useEffect(() => {
    if (!animation) {
      return undefined;
    }

    animation.addEventListener('DOMLoaded', handleLoad);

    return () => {
      animation.removeEventListener('DOMLoaded', handleLoad);
    };
  }, [animation, handleLoad]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    animation.loop = loop;
  }, [ready, loop, animation]);

  useEffect(() => {
    if (!ready || Number.isNaN(speed)) {
      return;
    }

    animation.setSpeed(speed);
  }, [speed, ready, animation]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    animation.setDirection(direction);
  }, [direction, animation, ready]);

  useEffect(() => {
    if (!ready || (!goTo && goTo !== 0)) {
      return;
    }

    const isFrame = true; // TODO
    if (play) {
      animation.goToAndPlay(goTo, isFrame);
    } else {
      animation.goToAndStop(goTo, isFrame);
    }
  }, [animation, goTo, play, ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (animation.setSubframe) {
      animation.setSubframe(useSubframes);
    }
  }, [animation, useSubframes]);

  const wasPlayingSegmentsRef = useRef(false);
  useEffect(() => {
    if (!ready) {
      return;
    }

    function playReverse(lastFrame) {
      animation.goToAndPlay(lastFrame, true);
      animation.setDirection(direction);
    }

    if (play === true) {
      const force = true;
      wasPlayingSegmentsRef.current = !!segments;
      if (segments) {
        animation.playSegments(segments, force);

        // This needs to be called after playSegments or it will not play backwards
        if (direction === -1) {
          // TODO What if more than one segment
          const lastFrame = typeof segments[1] === 'number' ? segments[1] : segments[1][1];
          playReverse(lastFrame);
        }
      } else {
        if (wasPlayingSegmentsRef.current) {
          animation.resetSegments(force);
        }

        if (direction === -1) {
          const lastFrame = animation.getDuration(true);
          playReverse(lastFrame);
        } else {
          animation.play();
        }
      }
    } else if (play === false) {
      animation.pause();
    }
  }, [play, segments, ready, direction, animation]);

  const handleRef = useCallback(current => {
    refInternal.current = current;
    if (ref) {
      ref.current = current;
    }
  }, []);

  return <div ref={handleRef} className={className} />;
};

export default LottiePlayer;
