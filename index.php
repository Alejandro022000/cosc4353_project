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
        <tbody id="dataRows"></tbody>
    </table>

    <script>
document.addEventListener("DOMContentLoaded", function() {
    fetch('https://mycosc4353.azurewebsites.net/api/api.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('dataRows');
        let rows = '';
        data.forEach(row => {
            rows += `<tr>
            <td>${row.ClientCode}</td> <!-- Corrected Property Names -->
            <td>${row.SystemName}</td> <!-- Corrected Property Names -->
            <td>${row.Results}</td>
            <td>${row.InsertDatetime}</td> <!-- Corrected Property Names -->
            <td>${row.UpdateDatetime}</td> <!-- Corrected Property Names -->
         </tr>`;

        });
        tableBody.innerHTML = rows;
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});
</script>

</body>
</html>
