function updateUserInterface() {
  //populateDeliveryAddress();
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  if (userInfo) {
    // Hide Login/Signup and Show User Info Dropdown
    document.getElementById("loginNavItem").style.display = "none";
    document.getElementById("signupNavItem").style.display = "none";
    document.getElementById("userInfoDropdown").style.display = "block";
    document.getElementById("navbarDropdown").textContent = userInfo.username; // Use username or name based on your session structure

    // Update the div with user information
    document.getElementById("userInfoUsername").textContent ==
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

function populateDeliveryAddress() {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  if (userInfo) {
    // Format the delivery address from user information
    const fullAddress = `${userInfo.address1 || ""} ${
      userInfo.address2 || ""
    }, ${userInfo.city || ""} ${userInfo.state || ""} ${userInfo.zipcode || ""}`
      .trim()
      .replace(/\s\s+/g, " ");
    //console.log("fullAddress: " + fullAddress);
    document.getElementById("deliveryAddress").value = fullAddress;
  } else {
    // Clear the delivery address if no user is logged in
    document.getElementById("deliveryAddress").value = "";
  }
}

async function getFuelQuotesByUserId(userId) {
  const apiUrl =
    "https://4353.azurewebsites.net/api/api.php?action=get_fuel_quotes";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    //console.log("sent data: " + JSON.stringify({ user_id: userId }));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fuel quotes:", error);
    return [];
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
      console.error("Error during signup:");
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
        // Display an error message on the page
        const loginErrorMessageDiv = document.getElementById("loginErrorMessage");
        loginErrorMessageDiv.textContent = "Username or password is not in the system."; // Custom message for user
        document.getElementById("loginError").style.display = "block"; // Make error visible
      } else {
        sessionStorage.setItem("userInfo", JSON.stringify(data)); // Save user info in session storage
        $("#loginModal").modal("hide");
        updateUserInterface(); // Update UI without needing to refresh the page
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Display a generic error message if an exception occurs during fetch
      const loginErrorMessageDiv = document.getElementById("loginErrorMessage");
      loginErrorMessageDiv.textContent = "An error occurred during login. Please try again.";
      document.getElementById("loginError").style.display = "block"; // Make error visible
    }
    if (!data.error) {
      displayFuelQuotes(); // Update the fuel quote table after successful login
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
      //console.log("Save Changes button clicked!");
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
        const requestBody = {
          id: userId,
          name: name,
          address1: address1,
          address2: address2,
          city: city,
          state: state,
          zipcode: zipcode,
        };

        const response = await fetch(updateUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();

        if (data.error) {
          console.error("Update Error:", data.error);
        } else {
          sessionStorage.setItem("userInfo", JSON.stringify(requestBody));
          //console.log(JSON.stringify(requestBody));
          updateUserInterface();
          $("#editUserModal").modal("hide");
          //reffresh the page
          //location.reload();
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    });
});

async function displayFuelQuotes() {
  const userId = JSON.parse(sessionStorage.getItem("userInfo")).id;

  const fuelQuotes = await getFuelQuotesByUserId(userId);
  //console.log(fuelQuotes); // Check if the data is being fetched correctly

  const tableBody = document.getElementById("fuelQuoteTableBody");
  tableBody.innerHTML = ""; // Clear existing rows

  fuelQuotes.forEach((quote) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${quote.gallons}</td>
      <td>${quote.delivery_address}</td>
      <td>${quote.delivery_date}</td>
      <td>$${parseFloat(quote.suggested_price).toFixed(2)}</td>
      <td>$${parseFloat(quote.total_price).toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Call displayFuelQuotes to populate the table when the page loads or when the user logs in
document.addEventListener("DOMContentLoaded", function () {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  if (userInfo) {
    displayFuelQuotes();
  }
});
document
  .getElementById("fuelQuoteForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo")); // Assuming userInfo contains the user ID
    if (!userInfo) {
      alert("Please log in to submit a fuel quote.");
      return;
    }

    const gallonsRequested = document.getElementById("gallonsRequested").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value; // Ensure this is set from user data
    const deliveryDate = document.getElementById("deliveryDate").value;
    const suggestedPrice = document.getElementById("suggestedPrice").value;
    const totalPrice = document.getElementById("totalAmountDue").value;

    // Check if the delivery date is valid
    if (!deliveryDate || deliveryDate === "1900-01-01") {
      dateError.textContent = "Please enter a valid delivery date.";
      dateError.style.display = "block"; // Make sure the error message is visible
      return; // Stop the function here to prevent submission
    } else {
      dateError.textContent = "";
      dateError.style.display = "none";
    }

    // Prepare the data to be sent to the API
    const formData = {
      user_id: userInfo.id,
      gallons: gallonsRequested,
      delivery_date: deliveryDate,
      suggested_price: suggestedPrice,
      total_price: totalPrice,
    };

    try {
      const response = await fetch(
        "https://4353.azurewebsites.net/api/api.php?action=insert_fuel_quote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        document.getElementById("formFeedback").style.display = "block";
        document.getElementById("formFeedback").innerHTML =
          "<strong>Success:</strong> Fuel quote added successfully!";
        // Optionally reset the form or redirect the user
      } else {
        throw new Error(
          data.message || "An error occurred while submitting the fuel quote."
        );
      }
    } catch (error) {
      console.error("Error submitting the fuel quote:", error);
      document.getElementById("formFeedback").style.display = "block";
      document.getElementById(
        "formFeedback"
      ).innerHTML = `<strong>Error:</strong> ${error.message}`;
    }
  });
document
  .getElementById("gallonsRequested")
  .addEventListener("input", function () {
    const gallons = parseFloat(this.value);
    const suggestedPrice = parseFloat(
      document.getElementById("suggestedPrice").value
    );

    // Check if gallons is a number and greater than 0
    if (!isNaN(gallons) && gallons > 0) {
      const totalPrice = gallons * suggestedPrice;
      document.getElementById("totalAmountDue").value = totalPrice.toFixed(2); // Format to two decimal places
    } else {
      document.getElementById("totalAmountDue").value = ""; // Clear the total amount due if input is not valid
    }
  });

module.exports = { updateUserInterface, populateDeliveryAddress, getFuelQuotesByUserId, displayFuelQuotes };
