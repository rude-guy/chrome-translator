/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useTransition } from 'react';

export const useStream = (text: string, OPEN_API_KEY: string) => {
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const parseStreamedData = (chunk: string) => {
    const lines = chunk.split('\n');
    let parsedText = '';
    let error = '';
    try {
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataContent = line.substring(6);
          if (dataContent === '[DONE]') {
            break;
          }
          const data = JSON.parse(dataContent);
          if (data.choices && data.choices.length > 0) {
            const content = data.choices[0].delta.content;
            if (content) {
              parsedText += content;
            }
          }
        }
      }
    } catch (err) {
      error = JSON.stringify(err, null, 2);
    }
    return { parsedText, error };
  };

  const processTextChunk = (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    let resultText = '';
    const decoder = new TextDecoder('utf-8');
    return async function processText() {
      const { done, value } = await reader.read();
      if (done) {
        return resultText;
      }
      const chunk = decoder.decode(value, { stream: true });
      const { error, parsedText } = parseStreamedData(chunk);
      if (error) {
        setError(error);
        return false;
      }
      resultText += parsedText;
      startTransition(() => setResult((pre) => pre + parsedText));
      return processText();
    };
  };

  useEffect(() => {
    if (!text) return;
    const fetchData = async () => {
      const prompt = `Translate this into Simplified Chinese:\n\n${text}\n\n`;
      const body = {
        model: 'gpt-3.5-turbo-16k',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0,
        stream: true,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPEN_API_KEY}`,
        },
        body: JSON.stringify(body),
      };
      try {
        setLoading(true);
        const response = await fetch('https://one.wisehood.ai/v1/chat/completions', options);
        const reader = response.body!.getReader();
        const processText = processTextChunk(reader);
        const resultText = await processText();
        if (resultText === false) {
          return;
        }
        setResult(resultText);
      } catch (err) {
        setError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [OPEN_API_KEY, text]);

  return { result, error, loading, isPending };
};
