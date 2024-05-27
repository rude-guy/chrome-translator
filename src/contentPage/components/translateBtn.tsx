import { CSSProperties, useMemo } from 'react';
import { useTranslateContext } from '../App';
import selectionInstance from '../composables/selection';

// 图标大小
const ICON_SIZE = 27;

export const TranslateBtn = () => {
  const { point, setShowPanel } = useTranslateContext();
  const style = useMemo<CSSProperties>(() => {
    if (!point) return {};
    return {
      display: 'block',
      left: `${selectionInstance.getLeft(point.left, ICON_SIZE)}px`,
      top: `${selectionInstance.getTop(point.top, ICON_SIZE)}px`,
    };
  }, [point]);
  const handleClick = () => {
    setShowPanel(true);
  };
  return (
    <div className="chrome-translator-warp" style={style} onClickCapture={handleClick}>
      <div className="chrome-translator-icon"></div>
    </div>
  );
};
