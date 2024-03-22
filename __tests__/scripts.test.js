// Import necessary functions or libraries for testing
const fetchMock = require("jest-fetch-mock");
const {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} = require("@jest/globals");

// Mocking the fetch API
fetchMock.enableMocks();

// Import the JavaScript code you want to test
const { handleFormSubmit } = require("../js/scripts.js");

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
    mockElement.innerHTML = ""; // Reset the innerHTML for each test
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
