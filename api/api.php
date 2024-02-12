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
// Replace these with actual values for testing
$serverName = "tcp:myserverale.database.windows.net,1433";
$database = "mydatabase";
$username = "aleadmin";
$password = "456456asdAa!";


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


    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);    // Hash the password before storing it
    $conn = connectToDatabase();
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
