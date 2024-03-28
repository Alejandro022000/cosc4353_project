function updateUserInterface() {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  if (userInfo) {
    // Hide Login/Signup and Show User Info Dropdown
    document.getElementById("loginNavItem").style.display = "none";
    document.getElementById("signupNavItem").style.display = "none";
    document.getElementById("userInfoDropdown").style.display = "block";
    document.getElementById("navbarDropdown").textContent = userInfo.username; // Use username or name based on your session structure

    // Update the div with user information
    document.getElementById("userInfoUsername").textContent +=
      userInfo.username;
    document.getElementById("userInfoDetails").innerHTML = `
      <strong>ID:</strong> ${userInfo.id}<br>
      <strong>Name:</strong> ${userInfo.name || "Not provided"}<br>
      <strong>Address 1:</strong> ${userInfo.address1 || "Not provided"}<br>
      <strong>Address 2:</strong> ${userInfo.address2 || "Not provided"}<br>
      <strong>City:</strong> ${userInfo.city || "Not provided"}
      <strong>State:</strong> ${userInfo.state || "Not provided"}
      <strong>Zipcode:</strong> ${userInfo.zipcode || "Not provided"}
    `;

    // Show the user info container
    document.getElementById("userInfoContainer").style.display = "block";
  } else {
    // Show Login/Signup and Hide User Info Dropdown
    document.getElementById("loginNavItem").style.display = "block";
    document.getElementById("signupNavItem").style.display = "block";
    document.getElementById("userInfoDropdown").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateUserInterface();
});

document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission
    var password = document.getElementById("password-signup").value;
    var confirmPassword = document.getElementById("password-confirm").value;
    var username = document.getElementById("username-signup").value;
    var passwordError = document.getElementById("passwordError");
    var signupError = document.getElementById("signupError"); // Placeholder for signup errors

    // Ensure the signupError div exists in your HTML, or create it dynamically if needed
    if (!signupError) {
      signupError = document.createElement("div");
      signupError.id = "signupError";
      document.getElementById("signupForm").prepend(signupError);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      passwordError.style.display = "block";
      signupError.style.display = "none"; // Hide signup error if it's visible
      return; // Stop the function here
    } else {
      passwordError.style.display = "none";
    }

    // Define the API URL for signup
    const signupUrl =
      "https://4353.azurewebsites.net/api/api.php?action=signup";

    try {
      // Send the signup request to the server
      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (data.error) {
        // Display error message from the server
        signupError.style.display = "block";
        signupError.innerHTML = `<p class="text-danger">${data.error}</p>`; // Update this line to match your HTML structure
        // Optionally, hide the modal here to show the error
      } else {
        // Show the success modal
        $("#signupModal").modal("hide");
        $("#signupSuccessModal").modal("show");
        signupError.style.display = "none"; // Ensure any previous error message is hidden
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  });

document
  .getElementById("loginModal")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    var username = document.getElementById("username-login").value;
    var password = document.getElementById("password-login").value;

    // Define the API URL for login
    const loginUrl =
      "https://4353.azurewebsites.net/api/api.php?action=get_user_login";

    try {
      // Send the login request to the server using POST
      const response = await fetch(loginUrl, {
        method: "POST", // Changed to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Login Error:", data.error);
      } else {
        sessionStorage.setItem("userInfo", JSON.stringify(data)); // Save user info in session storage
        $("#loginModal").modal("hide");
        updateUserInterface(); // Update UI without needing to refresh the page
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  if (userInfo) {
    // Hide Login/Signup and Show User Info Dropdown
    document.getElementById("loginNavItem").style.display = "none";
    document.getElementById("signupNavItem").style.display = "none";
    document.getElementById("userInfoDropdown").style.display = "block";
    document.getElementById("navbarDropdown").textContent = userInfo.username; // Use username or name based on your session structure
  }

  document
    .getElementById("signOutButton")
    .addEventListener("click", function () {
      sessionStorage.removeItem("userInfo"); // Remove user info from session storage
      updateUserInterface(); // Update UI to show login/signup options
      //redirect to home page
      window.location.href = "/index.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  updateUserInterface();
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("saveChangesButton")
    .addEventListener("click", async function () {
      const name = document.getElementById("editName").value;
      const address1 = document.getElementById("editAddress1").value;
      const address2 = document.getElementById("editAddress2").value;
      const city = document.getElementById("editCity").value;
      const state = document.getElementById("editState").value;
      const zipcode = document.getElementById("editZipcode").value;

      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      const userId = userInfo.id;

      const updateUrl =
        "https://4353.azurewebsites.net/api/api.php?action=update_user";

      try {
        const response = await fetch(updateUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            name: name,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zipcode: zipcode,
          }),
        });
        const data = await response.json();

        if (data.error) {
          console.error("Update Error:", data.error);
        } else {
          sessionStorage.setItem("userInfo", JSON.stringify(data));
          updateUserInterface();
          $("#editUserModal").modal("hide");
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Loaded");
  // Hardcoded values
  var gallonsRequested = 100;
  var deliveryAddress = "123 Main St";
  var deliveryDate = "2024-03-20";
  var suggestedPrice = "2.50";
  var totalAmountDue = "250.00";

  // Populate form fields with hardcoded values
  console.log("Populating form fields...");
  console.log("Gallons Requested:", gallonsRequested);
  console.log("Delivery Address:", deliveryAddress);
  console.log("Delivery Date:", deliveryDate);
  console.log("Suggested Price:", suggestedPrice);
  console.log("Total Amount Due:", totalAmountDue);

  // Populate form fields with hardcoded values
  document.getElementById("gallonsRequested").value = gallonsRequested;
  document.getElementById("deliveryAddress").value = deliveryAddress;
  document.getElementById("deliveryDate").value = deliveryDate;
  document.getElementById("suggestedPrice").value = suggestedPrice;
  document.getElementById("totalAmountDue").value = totalAmountDue;

  // Add event listener to handle form submission
  document
    .getElementById("fuelQuoteForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Collect form data
      const formData = {
        gallonsRequested: document.getElementById("gallonsRequested").value,
        deliveryAddress: document.getElementById("deliveryAddress").value,
        deliveryDate: document.getElementById("deliveryDate").value,
        suggestedPrice: document.getElementById("suggestedPrice").value,
        totalAmountDue: document.getElementById("totalAmountDue").value,
      };

      // Call the handleFormSubmit function with the form data
      await handleFormSubmit(formData);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  populateFuelHistory(); // Call populateFuelHistory function on DOMContentLoaded
});

function populateFuelHistory() {
  // Your hardcoded fuel history data
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
    // Add more fuel history data as needed
  ];

  const fuelHistoryTable = document.getElementById("fuelQuoteTableBody");

  // Clear existing content inside the tbody
  fuelHistoryTable.innerHTML = "";

  // Populate the table with data
  fuelHistoryData.forEach((entry) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${entry.gallonsRequested}</td>
            <td>${entry.deliveryAddress}</td>
            <td>${entry.deliveryDate}</td>
            <td>$${entry.pricePerGallon.toFixed(2)}</td>
            <td>$${entry.totalAmountDue.toFixed(2)}</td>
        `;

    fuelHistoryTable.appendChild(row);
  });
}
async function handleFormSubmit(formData) {
  const apiUrl =
    "https://4353.azurewebsites.net/api/api.php?action=submit_quote";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    document.getElementById("formFeedback").innerHTML =
      "<strong>Success:</strong> Quote submitted successfully!";
  } catch (error) {
    console.error("Error submitting the quote:", error);
    document.getElementById(
      "formFeedback"
    ).innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
}
module.exports = { handleFormSubmit, updateUserInterface, populateFuelHistory };
