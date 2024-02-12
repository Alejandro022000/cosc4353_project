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
                <th>Client Code</th>
                <th>System Name</th>
                <th>Results</th>
                <th>Insert Datetime</th>
                <th>Update Datetime</th>
            </tr>
        </thead>
        <tbody>
            <?php
            try {
                $conn = new PDO("sqlsrv:server = tcp:myserverale.database.windows.net,1433; Database = mydatabase", "aleadmin", "456456asdAa!");
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $sql = "SELECT ClientCode, SystemName, Results, InsertDatetime, UpdateDatetime FROM Test";
                $stmt = $conn->prepare($sql);
                $stmt->execute();

                // set the resulting array to associative
                $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                foreach($stmt->fetchAll() as $row) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($row['ClientCode']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['SystemName']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['Results']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['InsertDatetime']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['UpdateDatetime']) . "</td>";
                    echo "</tr>";
                }
            } catch(PDOException $e) {
                echo "Error: " . $e->getMessage();
            }
            ?>
        </tbody>
    </table>
</body>
</html>
