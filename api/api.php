<?php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

// Function to connect to the database
function connectToDatabase() {
    $serverName = 'tcp:myserverale.database.windows.net';
    $database = getenv("DATABASE_NAME");
    $username = getenv("DATABASE_USERNAME");
    $password = getenv("DATABASE_PASSWORD");
    
    try {
        $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        die(json_encode(array("error" => $e->getMessage())));
    }
}

function userSignup() {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];

    // Connect to the database
    $conn = connectToDatabase();

    // Check if the username already exists
    $checkSql = "SELECT COUNT(*) FROM users WHERE username = :username";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute(['username' => $username]);
    $usernameCount = $checkStmt->fetchColumn();

    if ($usernameCount > 0) {
        // Username already exists
        echo json_encode(array("error" => "Username already exists."));
        return; // Stop the function execution
    }

    // Username does not exist, proceed with signup
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT); // Hash the password before storing it
    $sql = "INSERT INTO users (username, password) VALUES (:username, :password)";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute(['username' => $username, 'password' => $hashedPassword]);
        echo json_encode(array("message" => "User successfully registered"));
    } catch (PDOException $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
}


// Function to get table data
function getTableData() {
    $conn = connectToDatabase();
    $sql = "SELECT ClientCode, SystemName, Results, InsertDatetime, UpdateDatetime FROM Test";
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
}

// Function to get user data
function getLoginData() {
    session_start(); // Start the session to manage login state

    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];

    $conn = connectToDatabase();
    $sql = "SELECT id, username, password, name, address1, address2, city, state, zipcode FROM users WHERE username = :username";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Remove password from the array before sending back to the client
            unset($user['password']);
            // Save user info in session
            $_SESSION['user'] = $user;

            echo json_encode($user); // Return user data (without password)
        } else {
            echo json_encode(array("error" => "Invalid credentials"));
        }
    } catch (PDOException $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
}

function updateUserInformation() {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $name = $data['name'];
    $address1 = $data['address1'];
    $address2 = $data['address2'];
    $city = $data['city'];
    $state = $data['state'];
    $zipcode = $data['zipcode'];

    $conn = connectToDatabase();
    $sql = "UPDATE users SET name = :name, address1 = :address1, address2 = :address2, city = :city, state = :state, zipcode = :zipcode WHERE id = :id";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':address1' => $address1,
            ':address2' => $address2,
            ':city' => $city,
            ':state' => $state,
            ':zipcode' => $zipcode,
            ':id' => $id
        ]);
        echo json_encode(array("message" => "User information updated successfully"));
    } catch (PDOException $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
}

function createFuelQuoteTable() {
    $conn = connectToDatabase();
    $sql = "CREATE TABLE IF NOT EXISTS fuel_quotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gallons_requested DECIMAL(10,2) NOT NULL,
        delivery_address VARCHAR(255) NOT NULL,
        delivery_date DATE NOT NULL,
        suggested_price DECIMAL(10,2) NOT NULL,
        total_amount_due DECIMAL(10,2) NOT NULL
    )";

    try {
        $conn->exec($sql);
        echo json_encode(array("message" => "Fuel Quote Table created successfully"));
    } catch (PDOException $e) {
        echo json_encode(array("error" => $e->getMessage()));
    }
}


// Basic routing
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'get_table':
                getTableData();
                break;
            // Add more cases for other actions
            default:
                echo json_encode(array("error" => "Unknown action"));
                break;
        }
    } else {
        echo json_encode(array("error" => "No action specified"));
    }
}
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'signup':
                userSignup();
                break;                           
            case 'get_user_login':
                getLoginData();
                break;
            case 'update_user':
                updateUserInformation();
                break;
            case 'create_table':
                createFuelQuoteTable();
                break;
            // Add more cases for other actions
            default:
                echo json_encode(array("error" => "Unknown action"));
                break;
        }
    } else {
        echo json_encode(array("error" => "No action specified"));
    }
}
else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>