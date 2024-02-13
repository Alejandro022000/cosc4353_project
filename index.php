<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Front page</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<style>
  body {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/></svg>');
    background-size: cover;
    background-position: center;
  }
  .navbar-brand {
    font-weight: bold;
    color: #fff !important;
  }
  .btn-outline-primary {
    border-color: #007bff;
    color: #007bff;
  }
  .btn-outline-primary:hover {
    background-color: #007bff;
    color: #fff;
  }
</style>
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">TODO LOGO</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ml-auto">
      <!-- Login/Signup Links -->
      <li class="nav-item" id="loginNavItem">
        <a class="nav-link" href="#" data-toggle="modal" data-target="#loginModal">Login</a>
      </li>
      <li class="nav-item" id="signupNavItem">
        <a class="btn btn-outline-primary ml-2" href="#" data-toggle="modal" data-target="#signupModal">Sign Up</a>
      </li>
      
      <!-- User Info Dropdown (Hidden by default) -->
      <li id="userInfoDropdown" class="nav-item dropdown" style="display: none;">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          User Name
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Account</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" id="signOutButton" href="#">Sign Out</a>
        </div>
      </li>
    </ul>
  </div>
</nav>


<div class="container mt-5">
  <div class="row">
    <div class="col-md-6">
      <h1>TODO</h1>
      <p>Make this page look better</p>
    </div>
  </div>
</div>
<!-- Login Modal -->
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="loginModalLabel">Login</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="username-login">Username</label>
            <input type="text" class="form-control" id="username-login" placeholder="Enter username" required>
          </div>
          <div class="form-group">
            <label for="password-login">Password</label>
            <input type="password" class="form-control" id="password-login" placeholder="Password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Sign Up Modal -->
<div class="modal fade" id="signupModal" tabindex="-1" role="dialog" aria-labelledby="signupModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="signupModalLabel">Sign Up</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="signupForm">
          <div class="form-group">
            <label for="username-signup">Username</label>
            <input type="text" class="form-control" id="username-signup" placeholder="Choose a username" required>
          </div>
          <div id="signupError" class="form-group" style="display: none;">
              <!-- Error messages will be inserted here -->
          </div>
          <div class="form-group">
            <label for="password-signup">Password</label>
            <input type="password" class="form-control" id="password-signup" placeholder="Create a password" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters">
          </div>
          <div class="form-group">
            <label for="password-confirm">Confirm Password</label>
            <input type="password" class="form-control" id="password-confirm" placeholder="Confirm password" required>
          </div>
          <!-- Error message placeholder -->
          <div id="passwordError" class="form-group" style="display: none;">
            <p class="text-danger">Passwords do not match.</p>
          </div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Signup Success Modal -->
<div class="modal fade" id="signupSuccessModal" tabindex="-1" role="dialog" aria-labelledby="signupSuccessModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="signupSuccessModalLabel">Signup Successful</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>You have successfully created an account. Please login.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#loginModal">Login</button>
      </div>
    </div>
  </div>
</div>


<script>
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    var password = document.getElementById('password-signup').value;
    var confirmPassword = document.getElementById('password-confirm').value;
    var username = document.getElementById('username-signup').value;
    var passwordError = document.getElementById('passwordError');
    var signupError = document.getElementById('signupError'); // Placeholder for signup errors

    // Ensure the signupError div exists in your HTML, or create it dynamically if needed
    if (!signupError) {
        signupError = document.createElement('div');
        signupError.id = 'signupError';
        document.getElementById('signupForm').prepend(signupError);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        passwordError.style.display = 'block';
        signupError.style.display = 'none'; // Hide signup error if it's visible
        return; // Stop the function here
    } else {
        passwordError.style.display = 'none';
    }

    // Define the API URL for signup
    const signupUrl = 'https://4353.azurewebsites.net/api/api.php?action=signup';

    try {
        // Send the signup request to the server
        const response = await fetch(signupUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();

        if (data.error) {
            // Display error message from the server
            signupError.style.display = 'block';
            signupError.innerHTML = `<p class="text-danger">${data.error}</p>`; // Update this line to match your HTML structure
            // Optionally, hide the modal here to show the error
        } else {
            // Show the success modal
            $('#signupModal').modal('hide');
            $('#signupSuccessModal').modal('show');
            signupError.style.display = 'none'; // Ensure any previous error message is hidden
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});


document.getElementById('loginModal').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    var username = document.getElementById('username-login').value;
    var password = document.getElementById('password-login').value;

    // Define the API URL for login
    const loginUrl = 'https://4353.azurewebsites.net/api/api.php?action=get_user_login';

    try {
        // Send the login request to the server using POST
        const response = await fetch(loginUrl, {
            method: 'POST', // Changed to POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password})
        });

        const data = await response.json();

        if (data.error) {
            // Handle error
            console.error('Login Error:', data.error);
        } else {
            // Assuming data contains user info on successful login
            sessionStorage.setItem('userInfo', JSON.stringify(data)); // Save user info in session storage
            $('#loginModal').modal('hide');
            // Redirect or update UI as needed
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (userInfo) {
        // Hide Login/Signup and Show User Info Dropdown
        document.getElementById('loginNavItem').style.display = 'none';
        document.getElementById('signupNavItem').style.display = 'none';
        document.getElementById('userInfoDropdown').style.display = 'block';
        document.getElementById('navbarDropdown').textContent = userInfo.username; // Use username or name based on your session structure
    }

    document.getElementById('signOutButton').addEventListener('click', function() {
        sessionStorage.removeItem('userInfo'); // Remove user info from session storage
        window.location.reload(); // Reload the page to reflect the change
    });
});

</script>


<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
</html>
