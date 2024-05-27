import { useRef } from 'react';
import { isScrolledToBottom } from './utils';

export const useScroll = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const toBottom = () => {
    if (!scroller.current || isScrolling.current) return;
    isScrolling.current = true;
    timer.current = setInterval(() => {
      if (isScrolledToBottom(scroller.current!)) {
        isScrolling.current = false;
        clearTimer();
        return;
      }
      scroller.current!.scrollTo({ top: scroller.current!.scrollHeight, behavior: 'smooth' });
    }, 500);
  };

  const witElasticRange = (elastic = 10) => {
    const { scrollTop, clientHeight, scrollHeight } = scroller.current!;
    const scrollBottom = scrollTop + clientHeight;
    return scrollBottom <= scrollHeight + elastic && scrollBottom >= scrollHeight - elastic;
  };
  const onScroll = () => {
    if (!scroller.current) {
      return;
    }
    const isBottom = witElasticRange();
    isScrolling.current = !isBottom;
    if (!isBottom) {
      clearTimer();
    }
  };

  return {
    scroller,
    toBottom,
    onScroll,
  };
};
