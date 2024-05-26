/**
 * 阻止冒泡
 **/
export const stopEventsToContainer = (
  el: HTMLDivElement,
  type: 'addEventListener' | 'removeEventListener' = 'addEventListener'
) => {
  el[type]('click', (event) => {
    event.stopPropagation();
  });
  el[type]('mousedown', (event) => {
    event.stopPropagation();
  });
  el[type]('mouseup', (event) => {
    event.stopPropagation();
  });
};
