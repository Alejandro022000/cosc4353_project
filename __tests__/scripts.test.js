// Import necessary functions or libraries for testing
const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');
const fetchMock = require('jest-fetch-mock');

// Mock the DOM environment
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = {
  userAgent: 'node.js',
};

// Import the JavaScript code you want to test
const { initializeFuelQuoteForm } = require('../js/scripts.js');

// Mocking the fetch API
beforeEach(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('initializeFuelQuoteForm', () => {
  it('should populate form fields with hardcoded values', () => {
    // Run the function to initialize the form
    initializeFuelQuoteForm();

    // Test if the form fields are populated with hardcoded values
    expect(document.getElementById("gallonsRequested").value).toBe("100");
    expect(document.getElementById("deliveryAddress").value).toBe("123 Main St");
    expect(document.getElementById("deliveryDate").value).toBe("2024-03-20");
    expect(document.getElementById("suggestedPrice").value).toBe("2.50");
    expect(document.getElementById("totalAmountDue").value).toBe("250.00");
  });

  it('should submit the form data to the backend and display success message on successful response', async () => {
    // Run the function to initialize the form
    initializeFuelQuoteForm();

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

    // Simulate form submission
    fireEvent.submit(document.getElementById("fuelQuoteForm"));

    // Wait for asynchronous tasks to complete
    await new Promise(resolve => setTimeout(resolve, 0));

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
    expect(document.getElementById("formFeedback").innerHTML).toBe("<strong>Success:</strong> Quote submitted successfully!");
  });

  // Add more test cases as needed
});
