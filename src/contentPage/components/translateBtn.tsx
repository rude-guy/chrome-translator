import { useTranslateContext } from '../App';

export const TranslateBtn = () => {
  const { style, setShowPanel } = useTranslateContext();
  const handleClick = () => {
    setShowPanel(true);
  };
  return (
    <div className="chrome-translator-warp" style={style} onClickCapture={handleClick}>
      <div className="chrome-translator-icon"></div>
    </div>
  );
};
