import { useMemo, useRef } from 'react';
import { isScrolledToBottom } from './utils';
import { throttle } from 'lodash-es';

export const useScroll = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const isJSScrolling = useRef(false);
  const isScrolling = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef(0);

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  const toBottom = useMemo(() => {
    return throttle(
      () => {
        if (!scroller.current || isJSScrolling.current || isScrolling.current) return;
        isScrolling.current = true;
        clearTimer();
        timer.current = setInterval(() => {
          isJSScrolling.current = false;
          if (isScrolledToBottom(scroller.current!)) {
            isScrolling.current = false;
            clearTimer();
            return;
          }
          scroller.current!.scrollTo({ top: scroller.current!.scrollHeight, behavior: 'smooth' });
        }, 250);
      },
      50,
      { leading: false }
    );
  }, []);

  const witElasticRange = (elastic = 10) => {
    const { scrollTop, clientHeight, scrollHeight } = scroller.current!;
    const scrollBottom = scrollTop + clientHeight;
    return scrollBottom <= scrollHeight + elastic && scrollBottom >= scrollHeight - elastic;
  };
  const onScroll = useMemo(() => {
    return throttle(
      () => {
        if (!scroller.current) {
          return;
        }
        const { scrollTop } = scroller.current;
        const isBottom = witElasticRange();
        if (scrollTop < lastScrollTop.current && !isBottom) {
          isJSScrolling.current = true;
          clearTimer();
          return;
        }
        isScrolling.current = false;
        isJSScrolling.current = false;
        lastScrollTop.current = scrollTop;
      },
      16,
      { leading: false }
    );
  }, []);

  return {
    scroller,
    toBottom,
    onScroll,
  };
};
