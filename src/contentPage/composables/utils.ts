/**
 * 阻止冒泡
 **/
export const stopEventsToContainer = (el: HTMLDivElement) => {
  const stopBubble = (e: Event) => {
    e.stopPropagation();
  };
  el.addEventListener('click', stopBubble);
  el.addEventListener('mousedown', stopBubble);
  el.addEventListener('mouseup', stopBubble);
};

/** 是否已触底 */
export const isScrolledToBottom = (element: HTMLElement) => {
  return element.scrollHeight - element.scrollTop === element.clientHeight;
};
