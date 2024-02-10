<?php
// PHP Data Objects(PDO) Sample Code:
try {
    $conn = new PDO("sqlsrv:server = tcp:mycosc4353.database.windows.net,1433; Database = mydatabase", "aleadmin", "456456asdAa!");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    print("Error connecting to SQL Server.");
    die(print_r($e));
}

// SQL Server Extension Sample Code:
$connectionInfo = array("UID" => "aleadmin", "pwd" => "456456asdAa!", "Database" => "mydatabase", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:mycosc4353.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);
?>

<!DOCTYPE html>
<html>
<head>
    <title>My First HTML Page</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>This is a paragraph on my first HTML page.</p>
</body>
</html>
