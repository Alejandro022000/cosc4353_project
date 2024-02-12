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
            // API URL
            $apiUrl = 'https://4353.azurewebsites.net/api/api.php?action=get_table';
            
            // Initialize CURL
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $apiUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            // Execute CURL, fetch the JSON data and decode
            $result = curl_exec($ch);
            curl_close($ch);
            
            // Check if the result is not false
            if ($result !== false) {
                // Decode the JSON data into a PHP array
                $data = json_decode($result, true);

                // Check if there's an error key in the response
                if (isset($data['error'])) {
                    echo "<tr><td colspan='5'>Error: " . htmlspecialchars($data['error']) . "</td></tr>";
                } else {
                    // Iterate through the array and populate the table
                    foreach ($data as $row) {
                        echo "<tr>";
                        echo "<td>" . htmlspecialchars($row['ClientCode']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['SystemName']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['Results']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['InsertDatetime']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['UpdateDatetime']) . "</td>";
                        echo "</tr>";
                    }
                }
            } else {
                echo "<tr><td colspan='5'>Error fetching data.</td></tr>";
            }
            ?>
        </tbody>
    </table>
</body>
</html>
