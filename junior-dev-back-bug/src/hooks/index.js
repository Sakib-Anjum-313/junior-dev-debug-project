import peerserver from './peerserver/index.js';

export const hooks = (app) => {
  app.hook(peerserver);
};