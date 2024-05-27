// 图标的宽高

// 默认字体大小
const DEFAULT_FONT_SIZE = 16;

export type TranslateCallback = (data: { top: number; left: number; selectedText: string }) => void;

export type TEvents = {
  translate: TranslateCallback;
};

class Selection {
  selectedText: string;
  isSelected: boolean;
  private _events;

  constructor() {
    this.selectedText = '';
    this.isSelected = false;
    this._events = new Map<keyof TEvents, TEvents[keyof TEvents][]>();
    this.init();
  }

  init() {
    this.addEventListenerMousedown();
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

  addEventListenerMousedown() {
    document.addEventListener('mousedown', (e: MouseEvent) => {
      // 判断是否为左键点击
      if (e.button !== 0) return;
      this.isSelected = true;
    });
  }

  getLeft(x: number, size: number) {
    const screenWidth = document.body.clientWidth;
    return Math.min(x, screenWidth - size);
  }

  getTop(y: number, size: number) {
    const screenHeight = document.body.clientHeight;
    return Math.min(y + DEFAULT_FONT_SIZE, screenHeight - size - DEFAULT_FONT_SIZE);
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
          left: e.x,
          top: e.y,
          selectedText,
        });
        this.isSelected = false;
      });
    });
  }
}

export default new Selection();
