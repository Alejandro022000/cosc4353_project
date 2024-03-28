// Import necessary functions or libraries for testing
const fetchMock = require("jest-fetch-mock");
const {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} = require("@jest/globals");

// Import the JavaScript code you want to test
const { handleFormSubmit, updateUserInterface, populateFuelHistory } = require("../js/scripts.js");

// Mocking the fetch API
fetchMock.enableMocks();

// Mock the document.getElementById function
const mockElement = { innerHTML: "" };
document.getElementById = jest.fn().mockImplementation((id) => {
  if (id === "formFeedback") {
    return mockElement;
  }
  return null;
});

describe("handleFormSubmit", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockElement.innerHTML = ""; 
  });

  it("should submit the form data to the backend and display success message on successful response", async () => {
    // Mock form data
    const formData = {
      gallonsRequested: "100",
      deliveryAddress: "123 Main St",
      deliveryDate: "2024-03-20",
      suggestedPrice: "2.50",
      totalAmountDue: "250.00",
    };

    // Mock response from the backend
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Trigger the form submission
    await handleFormSubmit(formData);

    // Check if fetch was called with the correct arguments
    expect(fetchMock).toHaveBeenCalledWith(
      "https://4353.azurewebsites.net/api/api.php?action=submit_quote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    // Check if success message is displayed
    expect(mockElement.innerHTML).toBe(
      "<strong>Success:</strong> Quote submitted successfully!"
    );
  });

  it("should display error message on failed response", async () => {
    // Mock form data
    const formData = {
      gallonsRequested: "100",
      deliveryAddress: "123 Main St",
      deliveryDate: "2024-03-20",
      suggestedPrice: "2.50",
      totalAmountDue: "250.00",
    };

    // Mock failed response from the backend
    fetchMock.mockRejectOnce(new Error("Network error"));

    // Trigger the form submission
    await handleFormSubmit(formData);

    // Check if error message is displayed
    expect(mockElement.innerHTML).toBe("<strong>Error:</strong> Network error");
  });
});

// describe code for updateUserInterface tests
describe("updateUserInterface", () => {
  let originalSessionStorage;
  let originalDocument;

  beforeEach(() => {
    originalSessionStorage = global.sessionStorage;
    originalDocument = global.document;

    // Mock sessionStorage
    global.sessionStorage = {
      getItem: jest.fn(),
    };

    // Mock document
    global.document = {
      getElementById: jest.fn(),
    };
  });

  afterEach(() => {
    // Restore the original sessionStorage and document objects
    global.sessionStorage = originalSessionStorage;
    global.document = originalDocument;
  });

  it("should update the user interface when user information is available", () => {
    // Mock user information
    const userInfo = {
      username: "testuser",
      id: "123",
      name: "Test User",
      address1: "123 Main St",
      address2: "",
      city: "Test City",
      state: "Test State",
      zipcode: "12345",
    };

    global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify(userInfo));

    // Mock document.getElementById method to return elements
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } });
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } }); 
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } }); 
    global.document.getElementById.mockReturnValueOnce({ textContent: "" }); 
    global.document.getElementById.mockReturnValueOnce({ textContent: "" });
    global.document.getElementById.mockReturnValueOnce({ innerHTML: "" });
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } }); 

    updateUserInterface();

    // Check if the DOM elements are handled as expected
    expect(global.document.getElementById).toHaveBeenCalledTimes(7);
    expect(global.document.getElementById).toHaveBeenCalledWith("loginNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith("signupNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith("userInfoDropdown");
    expect(global.document.getElementById).toHaveBeenCalledWith("navbarDropdown");
    expect(global.document.getElementById).toHaveBeenCalledWith("userInfoUsername");
    expect(global.document.getElementById).toHaveBeenCalledWith("userInfoDetails");
    expect(global.document.getElementById).toHaveBeenCalledWith("userInfoContainer");
  });

  it("should update the user interface when user information is not available", () => {
    // Mock sessionStorage getItem method to return null (no user information)
    global.sessionStorage.getItem.mockReturnValueOnce(null);

    // Mock document.getElementById method to return elements
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } }); // Mocking loginNavItem
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } }); // Mocking signupNavItem
    global.document.getElementById.mockReturnValueOnce({ style: { display: "" } }); // Mocking userInfoDropdown

    updateUserInterface();

    expect(global.document.getElementById).toHaveBeenCalledTimes(3);
    expect(global.document.getElementById).toHaveBeenCalledWith("loginNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith("signupNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith("userInfoDropdown");
  });
});

describe("populateFuelHistory", () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = global.document;

    global.document = {
      getElementById: jest.fn(),
      createElement: jest.fn(() => ({ innerHTML: "" })),
    };
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  it("should populate the fuel history table with provided data", () => {
    // Mock fuel history data
    const fuelHistoryData = [
      {
        gallonsRequested: 100,
        deliveryAddress: "123 Main St",
        deliveryDate: "2024-03-20",
        pricePerGallon: 2.5,
        totalAmountDue: 250.0,
      },
      {
        gallonsRequested: 150,
        deliveryAddress: "786 River Par St",
        deliveryDate: "2024-02-13",
        pricePerGallon: 2.25,
        totalAmountDue: 337.5,
      },
    ];

    // Mock document.getElementById method to return fuel history table
    const appendChildMock = jest.fn(); // Mock appendChild method
    global.document.getElementById.mockReturnValueOnce({
      appendChild: appendChildMock,
    });

    populateFuelHistory();

    // Check if the table rows are added correctly
    expect(global.document.getElementById).toHaveBeenCalledWith("fuelQuoteTableBody");
    expect(global.document.createElement).toHaveBeenCalledTimes(2);

    // Mock appendChild method to verify the argument
    expect(appendChildMock).toHaveBeenCalledTimes(2);
    expect(appendChildMock).toHaveBeenCalledWith(expect.any(Object));
    expect(appendChildMock).toHaveBeenCalledWith(expect.any(Object));
  });
});
