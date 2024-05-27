import { CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslateContext } from '../App';
import { useStream } from '../composables/useStream';
import { Markdown } from './markdown';
import { useScroll } from '../composables/useScroll';
import selectionInstance from '../composables/selection';

export const Panel = () => {
  const { translateText, apiKey, point } = useTranslateContext();

  const languageForm = useMemo(() => {
    // TODO: 识别语言
    return translateText ? '英语' : '英语';
  }, [translateText]);

  const languageTo = useMemo(() => {
    // TODO: 参数
    return '中文';
  }, []);

  const { result, error, loading } = useStream(translateText, apiKey);

  const { onScroll, scroller, toBottom } = useScroll();

  useEffect(() => {
    toBottom();
  }, [toBottom, result]);

  /** 定位 */
  const translatorRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!point || !translatorRef.current) return;
    const { clientWidth, clientHeight } = translatorRef.current;
    setStyle({
      top: `${selectionInstance.getTop(point.left, clientHeight)}px`,
      left: `${selectionInstance.getLeft(point.top, clientWidth)}px`,
    });
  }, [point]);

  return (
    <div className="chrome-translator-bubble" ref={translatorRef} style={style}>
      <div className="bubble-warp">
        <div className="bubble-language source">{languageForm}</div>
        <p className="bubble-content">{translateText}</p>
        <div className="bubble-language target">{languageTo}</div>
        <p className="bubble-content" ref={scroller} onScroll={onScroll}>
          {error ? error : <Markdown loading={loading} content={result} />}
        </p>
      </div>
    </div>
  );
};
