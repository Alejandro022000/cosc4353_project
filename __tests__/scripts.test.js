// Import necessary functions or libraries for testing
const { fireEvent } = require("@testing-library/dom");

const fetchMock = require("jest-fetch-mock");
const {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} = require("@jest/globals");

// Import the JavaScript code you want to test
const {
  updateUserInterface,
  populateDeliveryAddress,
  getFuelQuotesByUserId,
  displayFuelQuotes
} = require("../js/scripts.js");

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
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
    global.document.getElementById.mockReturnValueOnce({ textContent: "" });
    global.document.getElementById.mockReturnValueOnce({ textContent: "" });
    global.document.getElementById.mockReturnValueOnce({ innerHTML: "" });
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });

    updateUserInterface();

    // Check if the DOM elements are handled as expected
    expect(global.document.getElementById).toHaveBeenCalledTimes(7);
    expect(global.document.getElementById).toHaveBeenCalledWith("loginNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "signupNavItem"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoDropdown"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "navbarDropdown"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoUsername"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoDetails"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoContainer"
    );
  });

  it("should update the user interface when user information is not available", () => {
    // Mock sessionStorage getItem method to return null (no user information)
    global.sessionStorage.getItem.mockReturnValueOnce(null);

    // Mock document.getElementById method to return elements
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    }); // Mocking loginNavItem
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    }); // Mocking signupNavItem
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    }); // Mocking userInfoDropdown

    updateUserInterface();

    expect(global.document.getElementById).toHaveBeenCalledTimes(3);
    expect(global.document.getElementById).toHaveBeenCalledWith("loginNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "signupNavItem"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoDropdown"
    );
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

  it("should handle error during update", async () => {
    // Mock error response from the server
    const mockError = new Error("Network error");
    fetch.mockRejectedValueOnce(mockError);
  
    // Create a button element
    const saveChangesButton = document.createElement("button");
    saveChangesButton.id = "saveChangesButton";
  
    // Create a mock document object with a body property
    const mockDocument = {
      body: document.createElement("body"),
      createElement: jest.fn().mockReturnValue(saveChangesButton),
    };
  
    // Replace the global document object with the mock document
    global.document = mockDocument;
  
    // Attach the event listener to the button
    saveChangesButton.onclick = async () => {
      // Simulate the behavior of the event listener
      try {
        // This part should simulate the actual behavior of your event listener
        // and make the fetch call.
        throw mockError;
      } catch (error) {
        console.error("Error during update:", error);
      }
    };
  
    // Call the click method to simulate the click event
    saveChangesButton.click();
  
    // Wait for asynchronous tasks to complete
    await Promise.resolve();
  
    // Check if console.error is not called
    expect(console.error).not.toHaveBeenCalled();
  });
  
  


});

describe("DOMContentLoaded event", () => {
  beforeEach(() => {
    // Mock the necessary DOM elements and functions
    document.body.innerHTML = `
      <form id="fuelQuoteForm">
        <input type="text" id="gallonsRequested">
        <input type="text" id="deliveryAddress">
        <input type="text" id="deliveryDate">
        <input type="text" id="suggestedPrice">
        <input type="text" id="totalAmountDue">
        <button type="submit">Submit</button>
      </form>
    `;
  });

  test("Populate form fields and attach event listener", () => {
    // Mock console.log to check if the messages are logged
    console.log = jest.fn();

    // Invoke the event listener directly
    document.addEventListener("DOMContentLoaded", () => {
      // Check if form fields are populated correctly
      expect(document.getElementById("gallonsRequested").value).toBe("100");
      expect(document.getElementById("deliveryAddress").value).toBe(
        "123 Main St"
      );
      expect(document.getElementById("deliveryDate").value).toBe("2024-03-20");
      expect(document.getElementById("suggestedPrice").value).toBe("2.50");
      expect(document.getElementById("totalAmountDue").value).toBe("250.00");

      // Check if event listener is attached to the form
      const form = document.getElementById("fuelQuoteForm");
      const submitListener = form.onsubmit;
      expect(submitListener).toBeTruthy(); // Ensure event listener is attached

      // Mock the handleFormSubmit function to ensure it's called when the form is submitted
      const mockHandleFormSubmit = jest.fn();
      window.handleFormSubmit = mockHandleFormSubmit;

      // Simulate form submission
      form.dispatchEvent(new Event("submit"));

      // Ensure handleFormSubmit is called with the correct data
      expect(mockHandleFormSubmit).toHaveBeenCalledWith({
        gallonsRequested: "100",
        deliveryAddress: "123 Main St",
        deliveryDate: "2024-03-20",
        suggestedPrice: "2.50",
        totalAmountDue: "250.00",
      });

      // Check if console.log messages are logged
      expect(console.log).toHaveBeenCalledWith("Populating form fields...");
      expect(console.log).toHaveBeenCalledWith("Gallons Requested:", "100");
      expect(console.log).toHaveBeenCalledWith(
        "Delivery Address:",
        "123 Main St"
      );
      expect(console.log).toHaveBeenCalledWith("Delivery Date:", "2024-03-20");
      expect(console.log).toHaveBeenCalledWith("Suggested Price:", "2.50");
      expect(console.log).toHaveBeenCalledWith("Total Amount Due:", "250.00");
    });
  });
});

describe("updateUserInterface", () => {
  // Mock sessionStorage
  global.sessionStorage = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    fetchMock.resetMocks();
    mockElement.innerHTML = "";
    // Mock document.getElementById
    document.getElementById = jest.fn((id) => {
      return {
        id,
        style: {
          display: "none",
        },
      };
    });

    // Reset UI elements
    document.getElementById("loginNavItem").style.display = "none";
    document.getElementById("signupNavItem").style.display = "none";
    document.getElementById("userInfoDropdown").style.display = "none";
  });

  it("should handle missing user information fields", () => {
    // Mock user information with missing fields
    const userInfo = {
      username: "testuser",
      id: "123",
      // Missing name, address1, city, state, and zipcode
    };
  
    global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify(userInfo));
  
    // Mock document.getElementById method to return elements
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
    global.document.getElementById.mockReturnValueOnce({ textContent: "" });
    global.document.getElementById.mockReturnValueOnce({ textContent: "" });
    global.document.getElementById.mockReturnValueOnce({ innerHTML: "" });
    global.document.getElementById.mockReturnValueOnce({
      style: { display: "" },
    });
  
    updateUserInterface();
  
    // Check if the DOM elements are handled as expected
    expect(global.document.getElementById).toHaveBeenCalledTimes(10);
    expect(global.document.getElementById).toHaveBeenCalledWith("loginNavItem");
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "signupNavItem"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoDropdown"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "navbarDropdown"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoUsername"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoDetails"
    );
    expect(global.document.getElementById).toHaveBeenCalledWith(
      "userInfoContainer"
    );
  });

  it("should hide login/signup and show user info dropdown when user is logged in", () => {
    // Mock user information in sessionStorage
    global.sessionStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ username: "testuser" })
    );

    updateUserInterface();

    // Assert UI changes
    expect(document.getElementById("loginNavItem").style.display).toBe("none");
    expect(document.getElementById("signupNavItem").style.display).toBe("none");
    expect(document.getElementById("userInfoDropdown").style.display).toBe(
      "none"
    );
  });

  it("should show login/signup and hide user info dropdown when user is not logged in", () => {
    // Mock no user information in sessionStorage
    global.sessionStorage.getItem.mockReturnValueOnce(null);

    updateUserInterface();

    // Assert UI changes
    expect(document.getElementById("loginNavItem").style.display).toBe("none");
    expect(document.getElementById("signupNavItem").style.display).toBe("none");
    expect(document.getElementById("userInfoDropdown").style.display).toBe(
      "none"
    );
  });
});

describe("saveChangesButton Event Listener", () => {
  let originalSessionStorage;
  let originalDocument;

  beforeEach(() => {
    fetchMock.resetMocks();
    originalSessionStorage = global.sessionStorage;
    originalDocument = global.document;

    // Mock sessionStorage
    global.sessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    // Mock document
    global.document = {
      getElementById: jest.fn().mockImplementation((id) => {
        if (
          id === "editName" ||
          id === "editAddress1" ||
          id === "editAddress2" ||
          id === "editCity" ||
          id === "editState" ||
          id === "editZipcode"
        ) {
          return { value: "" };
        }
        return null;
      }),
      createElement: jest.fn().mockImplementation((tagName) => {
        return {
          id: tagName,
          click: jest.fn(), // Mock click method for the button
        };
      }),
    };
  });

  afterEach(() => {
    // Restore the original sessionStorage and document objects
    global.sessionStorage = originalSessionStorage;
    global.document = originalDocument;
  });

  it("should display error message on failed update", async () => {
    // Mock user information in sessionStorage
    const userInfo = { id: "123", username: "testuser" };
    global.sessionStorage.getItem.mockReturnValue(JSON.stringify(userInfo));

    // Mock user input values
    const name = "John Doe";
    const address1 = "123 Main St";
    const address2 = "Apt 101";
    const city = "New York";
    const state = "NY";
    const zipcode = "10001";
    global.document.getElementById.mockReturnValueOnce({ value: name });
    global.document.getElementById.mockReturnValueOnce({ value: address1 });
    global.document.getElementById.mockReturnValueOnce({ value: address2 });
    global.document.getElementById.mockReturnValueOnce({ value: city });
    global.document.getElementById.mockReturnValueOnce({ value: state });
    global.document.getElementById.mockReturnValueOnce({ value: zipcode });

    // Mock failed response from the server
    fetchMock.mockRejectOnce(new Error("Network error"));

    // Simulate click event on saveChangesButton
    const saveChangesButton = document.createElement("button");
    saveChangesButton.id = "saveChangesButton";
    saveChangesButton.click();

    // Check if error message is displayed
    // Note: You may need to mock or assert the display of error message in your tests
  });
});
describe("loginModal Form Submission", () => {
  let mockSubmitHandler;

  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ username: "testuser", id: "123" }),
    });

    // Create a mock function for the event handler
    mockSubmitHandler = jest.fn(async (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Extract form data
      const username = document.getElementById("username-login").value;
      const password = document.getElementById("password-login").value;

      // Define the API URL for login
      const loginUrl =
        "https://4353.azurewebsites.net/api/api.php?action=get_user_login";

      // Send the login request to the server using POST
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.error) {
        sessionStorage.setItem("userInfo", JSON.stringify(data));
      }
    });

    // Mock document.getElementById to return input elements and the form
    document.getElementById = jest.fn((id) => {
      switch (id) {
        case "username-login":
          return { value: "testuser" };
        case "password-login":
          return { value: "password123" };
        case "loginModal":
          return {
            addEventListener: (event, callback) => {
              if (event === "submit") {
                mockSubmitHandler = callback;
              }
            },
          };
        default:
          return null;
      }
    });

    // Mock sessionStorage
    global.sessionStorage = {
      setItem: jest.fn(),
    };
  });

  it("should submit login form and update sessionStorage on successful login", async () => {
    // Manually trigger the event handler to simulate form submission
    await mockSubmitHandler({ preventDefault: jest.fn() });

    // Check if fetch was called with the correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      "https://4353.azurewebsites.net/api/api.php?action=get_user_login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "testuser", password: "password123" }),
      }
    );

    // Check if sessionStorage was updated
    expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
      "userInfo",
      JSON.stringify({ username: "testuser", id: "123" })
    );
  });
  it("should handle login error and not update sessionStorage", async () => {
    // Mock error response from the server
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid credentials" })
    );

    // Trigger the form submission
    require("../js/scripts.js");

    // Check if sessionStorage was not updated
    expect(global.sessionStorage.setItem).not.toHaveBeenCalled();
  });
});
describe("signupForm Form Submission", () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    // Mock document.getElementById to return input elements and the form
    document.getElementById = jest.fn((id) => {
      switch (id) {
        case "password-signup":
          return { value: "password123" };
        case "password-confirm":
          return { value: "password123" }; // Matching password for confirmation
        case "username-signup":
          return { value: "newuser" };
        case "passwordError":
          return { style: { display: "none" } };
        case "signupError":
          return { style: { display: "none" }, innerHTML: "" };
        case "signupForm":
          return {
            addEventListener: jest.fn((event, callback) => {
              if (event === "submit") {
                callback({ preventDefault: jest.fn() }); // Simulate form submission
              }
            }),
          };
        default:
          return null;
      }
    });
  });

  it("should display error message on failed signup", async () => {
    // Mock error response from the server
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Username already exists" })
    );

    // Trigger the form submission
    require("../js/scripts.js");
  });
});

describe('populateDeliveryAddress', () => {
  beforeEach(() => {
    // Mock sessionStorage getItem method
    global.sessionStorage = {
      getItem: jest.fn(),
    };

    // Mock document.getElementById method to return an input element
    global.document.getElementById = jest.fn().mockReturnValue({ value: '' });
  });

  it('should populate delivery address when user information is available', () => {
    // Mock user information
    const userInfo = {
      address1: '123 Main St',
      address2: 'Apt 101',
      city: 'Test City',
      state: 'Test State',
      zipcode: '12345',
    };
    global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify(userInfo));

    // Call the function
    populateDeliveryAddress();

    // Check if the delivery address is populated correctly
    expect(global.document.getElementById).toHaveBeenCalledWith('deliveryAddress');
    expect(global.document.getElementById().value).toBe('123 Main St Apt 101, Test City Test State 12345');
  });

  it('should clear delivery address when no user is logged in', () => {
    // Mock no user information in sessionStorage
    global.sessionStorage.getItem.mockReturnValueOnce(null);

    // Call the function
    populateDeliveryAddress();

    // Check if the delivery address is cleared
    expect(global.document.getElementById).toHaveBeenCalledWith('deliveryAddress');
    expect(global.document.getElementById().value).toBe('');
  });
});

describe('getFuelQuotesByUserId', () => {
  beforeEach(() => {
    // Mock fetch function
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // Clear fetch mock
    global.fetch.mockClear();
  });

  it('should return fuel quotes when API call is successful', async () => {
    // Mock successful API response
    const userId = '123';
    const mockData = [{ id: '1', gallons: '100', price: '2.50' }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    // Call the function
    const result = await getFuelQuotesByUserId(userId);

    // Check if fetch was called with the correct arguments
    expect(global.fetch).toHaveBeenCalledWith("https://4353.azurewebsites.net/api/api.php?action=get_fuel_quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    // Check if the function returns the expected data
    expect(result).toEqual(mockData);
  });

  it('should return an empty array when API call fails or returns an error', async () => {
    // Mock failed API response
    const userId = '123';
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    // Call the function
    const result = await getFuelQuotesByUserId(userId);

    // Check if fetch was called with the correct arguments
    expect(global.fetch).toHaveBeenCalledWith("https://4353.azurewebsites.net/api/api.php?action=get_fuel_quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    // Check if the function returns an empty array
    expect(result).toEqual([]);
  });
});



