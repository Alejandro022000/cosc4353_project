<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // This is for cross-origin requests

try {
    $conn = new PDO("sqlsrv:server = tcp:mycosc4353.database.windows.net,1433; Database = mydatabase", "aleadmin", "456456asdAa!");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Assuming you're making a GET request to fetch data
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $stmt = $conn->query("SELECT ClientCode, SystemName, Results, InsertDatetime, UpdateDatetime FROM Test");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($results);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => "Error connecting to SQL Server."]);
}
?>
