<!DOCTYPE html>
<html>
<head>
    <title>Database Table</title>
    <meta charset="UTF-8">
    <style>
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        th, td {
            padding: 10px;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>This is a paragraph on my first HTML page.</p>
    <table>
        <thead>
            <tr>
                <th>ClientCode</th>
                <th>SystemName</th>
                <th>Results</th>
                <th>InsertDatetime</th>
                <th>UpdateDatetime</th>
            </tr>
        </thead>
        <tbody>
            <?php
            try {
                $conn = new PDO("sqlsrv:server = tcp:mycosc4353.database.windows.net,1433; Database = mydatabase", "aleadmin", "456456asdAa!");
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                $stmt = $conn->query("SELECT ClientCode, SystemName, Results, InsertDatetime, UpdateDatetime FROM Test");
                while ($row = $stmt->fetch()) {
                    echo "<tr>
                            <td>{$row['ClientCode']}</td>
                            <td>{$row['SystemName']}</td>
                            <td>{$row['Results']}</td>
                            <td>{$row['InsertDatetime']}</td>
                            <td>{$row['UpdateDatetime']}</td>
                          </tr>";
                }
            } catch (PDOException $e) {
                print("Error connecting to SQL Server.");
                die(print_r($e));
            }
            ?>
        </tbody>
    </table>
</body>
</html>
