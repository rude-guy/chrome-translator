import {
  CSSProperties,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import selectionInstance, { RectRange } from './composables/selection';
import { useClickOutside } from './composables/useClickOutside';
import { Panel } from './components/panel';
import { TranslateBtn } from './components/translateBtn';
import { useApiKey } from './composables/useApikey';
import { stopEventsToContainer } from './composables/utils';

type ContextType = {
  rect: RectRange | null;
  apiKey: string;
  style?: CSSProperties;
  translateText: string;
  setShowPanel: (value: React.SetStateAction<boolean>) => void;
};

const loop = () => {};

const Context = createContext<ContextType>({
  rect: null,
  apiKey: '',
  translateText: '',
  setShowPanel: loop,
});

export const useTranslateContext = () => {
  return useContext(Context);
};

function App() {
  const { apiKey } = useApiKey();
  const [translateText, setTranslateText] = useState<string>('');
  const [rect, setRect] = useState<RectRange | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();

  const clearStatus = () => {
    setRect(null);
    setShowPanel(false);
    setTranslateText('');
    setStyle(undefined);
  };

  // 外部点击
  useClickOutside(divRef, clearStatus);

  console.log(rect);

  useEffect(() => {
    selectionInstance.on('translate', ({ left, top, rect, selectedText }) => {
      setShowPanel(false);
      setRect(rect);
      setTranslateText(selectedText);
      setStyle({ display: 'block', left: `${left}px`, top: `${top}px` });
    });
  }, [apiKey]);

  /** 冒泡拦截 */
  useEffect(() => {
    stopEventsToContainer(divRef.current!);
  }, []);

  const contextValue = useMemo(
    () => ({
      rect,
      style,
      apiKey,
      translateText,
      setShowPanel,
    }),
    [rect, style, translateText, apiKey]
  );
  return (
    <Context.Provider value={contextValue}>
      <div ref={divRef}>{showPanel ? <Panel /> : <TranslateBtn />}</div>
    </Context.Provider>
  );
}

export default App;
