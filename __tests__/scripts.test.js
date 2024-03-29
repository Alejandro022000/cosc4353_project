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

  it("should handle server error and display error message", async () => {
    // Mock form data
    const formData = {
      gallonsRequested: "100",
      deliveryAddress: "123 Main St",
      deliveryDate: "2024-03-20",
      suggestedPrice: "2.50",
      totalAmountDue: "250.00",
    };

    // Mock server error response
    fetchMock.mockResponseOnce(JSON.stringify({ error: "Network response was not ok" }), { status: 500 });

    // Trigger the form submission
    await handleFormSubmit(formData);

    // Check if error message is displayed
    expect(mockElement.innerHTML).toBe("<strong>Error:</strong> Network response was not ok");
  });

  it("should handle network error and display error message", async () => {
    // Mock form data
    const formData = {
      gallonsRequested: "100",
      deliveryAddress: "123 Main St",
      deliveryDate: "2024-03-20",
      suggestedPrice: "2.50",
      totalAmountDue: "250.00",
    };

    // Mock network error response
    fetchMock.mockRejectOnce(new Error("Network error occurred"));

    // Trigger the form submission
    await handleFormSubmit(formData);

    // Check if error message is displayed
    expect(mockElement.innerHTML).toBe("<strong>Error:</strong> Network error occurred");
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
    expect(global.document.createElement).toHaveBeenCalledTimes(3);

    // Mock appendChild method to verify the argument
    expect(appendChildMock).toHaveBeenCalledTimes(3);
    expect(appendChildMock).toHaveBeenCalledWith(expect.any(Object));
    expect(appendChildMock).toHaveBeenCalledWith(expect.any(Object));
  });

  
});


describe("saveChangesButton Event Listener", () => {
  let originalSessionStorage;
  let originalDocument;

  beforeEach(() => {
    fetchMock.resetMocks();
    mockElement.innerHTML = ""; 
    originalSessionStorage = global.sessionStorage;
    originalDocument = global.document;

    // Mock sessionStorage
    global.sessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    // Mock document
    global.document = {
      getElementById: jest.fn(),
      createElement: jest.fn().mockImplementation((tagName) => {
        return {
          id: tagName,
          click: jest.fn(), // Mock click method
        };
      }),
    };
  });

  afterEach(() => {
    // Restore the original sessionStorage and document objects
    global.sessionStorage = originalSessionStorage;
    global.document = originalDocument;
  });
  


  it("should send a request to update user information when saveChangesButton is clicked", async () => {
    // Mock user input values
    const name = "John Doe";
    const address1 = "123 Main St";
    const address2 = "Apt 101";
    const city = "New York";
    const state = "NY";
    const zipcode = "10001";

    // Mock userInfo in sessionStorage
    const userInfo = {
      id: "123",
      name: "John Doe",
      address1: "123 Main St",
      address2: "Apt 101",
      city: "New York",
      state: "NY",
      zipcode: "10001"
    };
    global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify(userInfo));

    // Mock user input fields in the document
    global.document.getElementById.mockReturnValueOnce({ value: name });
    global.document.getElementById.mockReturnValueOnce({ value: address1 });
    global.document.getElementById.mockReturnValueOnce({ value: address2 });
    global.document.getElementById.mockReturnValueOnce({ value: city });
    global.document.getElementById.mockReturnValueOnce({ value: state });
    global.document.getElementById.mockReturnValueOnce({ value: zipcode });

    // Mock response from the server
    const mockResponse = { id: "123", name, address1, address2, city, state, zipcode };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    // Mock the saveChangesButton click event listener
    const clickEventListener = jest.fn();
    const saveChangesButton = document.createElement("button");
    saveChangesButton.id = "saveChangesButton";
    global.document.getElementById.mockReturnValueOnce(saveChangesButton);
    saveChangesButton.addEventListener = jest.fn().mockImplementation((event, callback) => {
      if (event === "click") {
        clickEventListener.mockImplementation(callback);
      }   
    });

    // Trigger the click event on the saveChangesButton
    saveChangesButton.click();

    // Wait for asynchronous tasks to complete
    await Promise.resolve();

    // Check if the update request is sent with the correct data
    expect(fetchMock).toHaveBeenCalledWith(
      "https://4353.azurewebsites.net/api/api.php?action=update_user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userInfo.id,
          name: name,
          address1: address1,
          address2: address2,
          city: city,
          state: state,
          zipcode: zipcode,
        }),
      }
    );

    // Check if sessionStorage is updated with the new user information
    expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
      "userInfo",
      JSON.stringify(mockResponse)
    );

    // Assuming updateUserInterface and $("#editUserModal").modal are globally accessible functions
    // Check if updateUserInterface is called
    expect(updateUserInterface).toHaveBeenCalled();

    // Check if the modal is hidden
    expect($("#editUserModal").modal).toHaveBeenCalledWith("hide");
});

  it("should handle errors during update", async () => {
    // Mock user input values
    const name = "John Doe";
    const address1 = "123 Main St";
    const address2 = "Apt 101";
    const city = "New York";
    const state = "NY";
    const zipcode = "10001";

    // Mock userInfo in sessionStorage
    const userInfo = {
      id: "123",
    };
    global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify(userInfo));

    // Mock user input fields in the document
    global.document.getElementById.mockReturnValueOnce({ value: name });
    global.document.getElementById.mockReturnValueOnce({ value: address1 });
    global.document.getElementById.mockReturnValueOnce({ value: address2 });
    global.document.getElementById.mockReturnValueOnce({ value: city });
    global.document.getElementById.mockReturnValueOnce({ value: state });
    global.document.getElementById.mockReturnValueOnce({ value: zipcode });

    // Mock error responses from the server
    const mockError1 = new Error("Network error");
    const mockError2 = new Error("Network response was not ok");
    const mockError3 = new Error("Network error occurred");

    fetch.mockRejectedValueOnce(mockError1);
    fetch.mockRejectedValueOnce(mockError2);
    fetch.mockRejectedValueOnce(mockError3);

    // Trigger the click event on the saveChangesButton
    const saveChangesButton = document.createElement("button");
    saveChangesButton.id = "saveChangesButton";
    saveChangesButton.click();

    // Wait for asynchronous tasks to complete
    await Promise.resolve();

    // Check if the errors are logged
    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenNthCalledWith(1, "Error submitting the quote:", mockError1);
    expect(console.error).toHaveBeenNthCalledWith(2, "Error submitting the quote:", mockError2);
    expect(console.error).toHaveBeenNthCalledWith(3, "Error submitting the quote:", mockError3);
  });

  
});
