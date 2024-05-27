import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import selectionInstance from './composables/selection';
import { useClickOutside } from './composables/useClickOutside';
import { Panel } from './components/panel';
import { TranslateBtn } from './components/translateBtn';
import { useApiKey } from './composables/useApikey';
import { stopEventsToContainer } from './composables/utils';

export type Point = {
  left: number;
  top: number;
};

type ContextType = {
  apiKey: string;
  point: Point | null;
  translateText: string;
  setShowPanel: (value: React.SetStateAction<boolean>) => void;
};

const loop = () => {};

const Context = createContext<ContextType>({
  apiKey: '',
  point: null,
  translateText: '',
  setShowPanel: loop,
});

export const useTranslateContext = () => {
  return useContext(Context);
};

function App() {
  const { apiKey } = useApiKey();
  const [translateText, setTranslateText] = useState<string>('');
  const divRef = useRef<HTMLDivElement>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [point, setPoint] = useState<Point | null>(null);

  const clearStatus = () => {
    setShowPanel(false);
    setTranslateText('');
    setPoint(null);
  };

  // 外部点击
  useClickOutside(divRef, clearStatus);

  useEffect(() => {
    selectionInstance.on('translate', ({ left, top, selectedText }) => {
      setShowPanel(false);
      setTranslateText(selectedText);
      setPoint({ left, top });
    });
  }, [apiKey]);

  console.log(point);

  /** 冒泡拦截 */
  useEffect(() => {
    stopEventsToContainer(divRef.current!);
  }, []);

  const contextValue = useMemo(
    () => ({
      point,
      apiKey,
      translateText,
      setShowPanel,
    }),
    [point, translateText, apiKey]
  );
  return (
    <Context.Provider value={contextValue}>
      <div ref={divRef}>{showPanel ? <Panel /> : <TranslateBtn />}</div>
    </Context.Provider>
  );
}

export default App;
