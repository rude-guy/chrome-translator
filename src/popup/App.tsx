import { FormEventHandler, useEffect, useState } from 'react';
import './App.scss';

const secret = '***************************************';

function App() {
  const [apiKey, setApiKey] = useState('');
  const handleChange: FormEventHandler = (e) => {
    setApiKey((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      if (result.apiKey) {
        setApiKey(secret);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ apiKey }, () => {
      setApiKey(secret);
    });
  };
  return (
    <div className="chrome-keys-container">
      <label>API Key</label>
      <input type="text" value={apiKey} onChange={handleChange} />
      <button onClick={handleSave}>Save API Key</button>
    </div>
  );
}
export default App;
