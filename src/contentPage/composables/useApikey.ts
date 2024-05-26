import { useState, useEffect } from 'react';

/**
 * 获取API_KEY
 */
export const useApiKey = () => {
  const [apiKey, setApiKey] = useState('');
  useEffect(() => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
    const handleApiKeyChange = (changes: { [name: string]: chrome.storage.StorageChange }) => {
      for (const key in changes) {
        if (key === 'apiKey') {
          const newApiKey = changes[key].newValue;
          setApiKey(newApiKey);
        }
      }
    };
    chrome.storage.onChanged.addListener(handleApiKeyChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleApiKeyChange);
    };
  }, []);

  return { apiKey };
};
