import bkash from './bkash/bkash.js';

export const services = (app) => {
  app.configure(bkash);
};