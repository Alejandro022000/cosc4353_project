<?php
// Set header for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 


// Function to connect to the database
function connectToDatabase() {
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
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>
