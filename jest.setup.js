const { JSDOM } = require("jsdom");

const dom = new JSDOM(
  `
  <!doctype html>
  <html>
  <body>
    <form id="loginModal">
      <input id="username-login" />
      <input id="password-login" />
      <div id="loginErrorMessage"></div>
      <div id="loginError" style="display:none;"></div>
    </form>
    <div id="signupForm"></div>
    <form id="fuelQuoteForm"></form>
    <input id="gallonsRequested"></input>
    <input id="deliveryAddress"></input> <!-- Ensure this element is present -->
    <table>
      <tbody id="fuelQuoteTableBody"></tbody>
    </table>
  </body>
  </html>`,
  {
    url: "http://localhost",
  }
);

// Set up the global environment
global.document = dom.window.document;
global.window = dom.window;
global.navigator = {
  userAgent: "node.js",
};
global.$ = jest.fn(() => ({
  modal: jest.fn(),
}));
global.console.error = jest.fn();
global.document.dispatchEvent = jest.fn();

// Set up sessionStorage mock
const mockSessionStorage = {
  getItem: jest.fn((key) => mockSessionStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockSessionStorage.store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete mockSessionStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockSessionStorage.store = {};
  }),
  store: {},
};

Object.defineProperty(global, "sessionStorage", { value: mockSessionStorage });

// Mock createElement function
global.document.createElement = jest.fn().mockImplementation((tagName) => {
  return {
    id: tagName,
    click: jest.fn(), // Mock click method
  };
});

// Append body to the document directly
global.document.body = dom.window.document.body;
