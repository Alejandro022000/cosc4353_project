const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body><div id="signupForm"></div><div id="loginModal"></div></body></html>', {
  url: 'http://localhost'
});

global.document = dom.window.document;
global.window = dom.window;
global.navigator = {
  userAgent: 'node.js',
};
