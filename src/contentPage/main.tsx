import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';

const root = document.createElement('div');
root.className = 'chrome-translator-app';

ReactDOM.createRoot(root).render(<App />);

export default root;
