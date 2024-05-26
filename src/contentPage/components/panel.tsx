import React, { useEffect, useMemo } from 'react';
import { useTranslateContext } from '../App';

async function translate(text: string, OPENAI_API_KEY: string) {
  const prompt = `Translate this into Simplified Chinese:\n\n${text}\n\n`;
  const body = {
    model: 'gpt-3.5-turbo',
    prompt: prompt,
    max_tokens: 100,
    temperature: 0,
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + OPENAI_API_KEY,
    },
    body: JSON.stringify(body),
  };
  const response = await fetch('https://api.openai.com/v1/completions', options);
  const json = await response.json();
  console.log(json);

  return json.choices[0].text;
}

export const Panel = () => {
  const { translateText, apiKey } = useTranslateContext();

  useEffect(() => {
    // 发送请求
    if (translateText) {
      translate(translateText, apiKey);
    }
  }, [translateText, apiKey]);

  const languageForm = useMemo(() => {
    // TODO: 识别语言
    return translateText ? '英语' : '英语';
  }, [translateText]);

  const languageTo = useMemo(() => {
    // TODO: 参数
    return '中文';
  }, []);

  return (
    <div className="chrome-translator-bubble">
      <div className="bubble-warp">
        <div className="bubble-language source">{languageForm}</div>
        <p className="bubble-content">{translateText}</p>
        <div className="bubble-language target">{languageTo}</div>
        <p className="bubble-content">
          {translateText}
          {/* <Markdown loading={false} content={''} /> */}
        </p>
      </div>
    </div>
  );
};
