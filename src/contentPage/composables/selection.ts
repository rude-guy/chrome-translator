// 图标的宽高
const ICON_SIZE = 27;

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export interface RectRange {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type TranslateCallback = (data: {
  top: number;
  left: number;
  rect: RectRange;
  selectedText: string;
}) => void;

export type TEvents = {
  translate: TranslateCallback;
};

class Selection {
  startPoint: Point;
  endPoint: Point;
  selectedText: string;
  isSelected: boolean;
  private _events;

  constructor() {
    this.startPoint = new Point(0, 0);
    this.endPoint = new Point(0, 0);
    this.selectedText = '';
    this.isSelected = false;
    this._events = new Map<keyof TEvents, TEvents[keyof TEvents][]>();
    this.init();
  }

  init() {
    this.addEventListenerMousedown();
    this.addEventListenerMousemove();
    this.addEventListenerMouseup();
  }

  // 订阅事件
  on(type: keyof TEvents, handle: TEvents[keyof TEvents]) {
    const handleCallbacks = this._events.get(type) || [];
    handleCallbacks.push(handle);
    this._events.set(type, handleCallbacks);
  }

  off(type: keyof TEvents, handle: TEvents[keyof TEvents]) {
    const handleCallbacks = this._events.get(type) || [];
    const index = handleCallbacks.indexOf(handle);
    if (index !== -1) {
      handleCallbacks.splice(index, 1);
    }
    this._events.set(type, handleCallbacks);
  }

  // 触发事件
  _emit<T extends keyof TEvents>(type: T, ...data: Parameters<TEvents[T]>) {
    const handleCallbacks = this._events.get(type) || [];
    handleCallbacks.forEach((handle) => {
      // @ts-ignore
      handle(...data);
    });
  }

  resetSelection() {
    this.startPoint = new Point(0, 0);
    this.endPoint = new Point(0, 0);
    this.isSelected = false;
    this.selectedText = '';
  }

  addEventListenerMousedown() {
    document.addEventListener('mousedown', () => {
      this.isSelected = false;
    });
  }

  // 记录坐标
  addEventListenerMousemove() {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString() : '';
      // 初始化
      if (!this.isSelected && selectedText) {
        this.startPoint.x = e.pageX;
        this.startPoint.y = e.pageY;
        this.endPoint.x = e.pageX;
        this.endPoint.y = e.pageY;
        this.isSelected = true;
        this.selectedText = selectedText;
        return;
      }
      // 更新坐标
      if (this.isSelected && selectedText) {
        this.endPoint.x = e.pageX;
        this.endPoint.y = e.pageY;
        this.selectedText = selectedText;
      }
    });
  }

  _getLeft(x: number) {
    const screenWidth = document.body.clientWidth;
    return Math.min(x, screenWidth - ICON_SIZE);
  }

  _getTop(y: number, selection: globalThis.Selection) {
    const screenHeight = document.body.clientHeight;
    const fontSize = this._getFontsize(selection);
    return Math.min(y + fontSize, screenHeight - ICON_SIZE - fontSize);
  }

  _getFontsize(selection: globalThis.Selection) {
    let fontSize = 14;
    try {
      const element =
        selection.focusNode!.nodeType === Node.TEXT_NODE
          ? (selection.focusNode!.parentNode as Element)
          : (selection.focusNode as Element);
      fontSize = parseInt(window.getComputedStyle(element).fontSize, 10);
    } catch (error) {
      console.error(error);
    }
    return fontSize;
  }

  _getSelectionRect(selection: globalThis.Selection) {
    let left = Infinity;
    let right = Infinity;
    let top = Infinity;
    let bottom = Infinity;
    if (selection.rangeCount > 0) {
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        const rects = range.getClientRects();
        for (let j = 0; j < rects.length; j++) {
          const rect = rects[j];
          left = Math.min(left, rect.left);
          right = Math.min(right, rect.right);
          top = Math.min(top, rect.top);
          bottom = Math.min(bottom, rect.bottom);
        }
      }
    }
    return { left, right, top, bottom };
  }

  addEventListenerMouseup() {
    document.addEventListener('mouseup', (e: MouseEvent) => {
      const selection = window.getSelection()!;
      const selectedText = selection ? selection.toString().trim() : '';
      if (!this.isSelected || !selectedText) {
        return;
      }
      Promise.resolve().then(() => {
        this._emit('translate', {
          left: this._getLeft(e.pageX),
          top: this._getTop(e.pageY, selection),
          rect: this._getSelectionRect(selection),
          selectedText,
        });
      });
    });
  }
}

export default new Selection();
