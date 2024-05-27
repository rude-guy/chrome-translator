import { useEffect, useMemo } from 'react';
import { useTranslateContext } from '../App';
import { useStream } from '../composables/useStream';
import { Markdown } from './markdown';
import { useScroll } from '../composables/useScroll';

export const Panel = () => {
  const { translateText, apiKey } = useTranslateContext();

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
    toBottom({
      behavior: 'smooth',
    });
  }, [toBottom, result]);

  return (
    <div className="chrome-translator-bubble">
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
