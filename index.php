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
    <tbody id="dataRows"></tbody>
    <script>
document.addEventListener("DOMContentLoaded", function() {
    fetch('https://mycosc4353.azurewebsites.net/api.php')
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
                        <td>${row.ClientCode}</td>
                        <td>${row.SystemName}</td>
                        <td>${row.Results}</td>
                        <td>${row.InsertDatetime}</td>
                        <td>${row.UpdateDatetime}</td>
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
