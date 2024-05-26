import root from './main';

function appendContainer(root: HTMLElement) {
  const contentContainer = document.createElement('div');
  contentContainer.id = 'chrome-translator-container';
  contentContainer.append(root);
  document.body.append(contentContainer);
}

let isInit = false;

function init() {
  timer && clearTimeout(timer);
  if (isInit) return;
  console.log('init chrome-translator');
  appendContainer(root);
  isInit = true;
}

const timer = setTimeout(init, 1000);
document.addEventListener('load', init);
document.addEventListener('DOMContentLoaded', init);
