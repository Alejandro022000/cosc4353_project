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
    <table id="dataTable">
        <thead>
            <tr>
                <th>Client Code</th>
                <th>System Name</th>
                <th>Results</th>
                <th>Insert Datetime</th>
                <th>Update Datetime</th>
            </tr>
        </thead>
        <tbody id="tableBody">
            <!-- Data rows will be inserted here using JavaScript -->
        </tbody>
    </table>

    <script>
        // Define the API URL
        const apiUrl = 'https://4353.azurewebsites.net/api/api.php?action=get_table';

        // Function to fetch data and update the table
        async function fetchDataAndUpdateTable() {
            try {
                // Fetch data from the API
                const response = await fetch(apiUrl);
                const data = await response.json();

                // Reference to the table body
                const tableBody = document.getElementById('tableBody');

                // Check if there's an error key in the response
                if (data.error) {
                    tableBody.innerHTML = `<tr><td colspan='5'>Error: ${data.error}</td></tr>`;
                } else {
                    // Iterate through the data and append rows to the table
                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${row.ClientCode}</td>
                            <td>${row.SystemName}</td>
                            <td>${row.Results}</td>
                            <td>${row.InsertDatetime}</td>
                            <td>${row.UpdateDatetime}</td>
                        `;
                        tableBody.appendChild(tr);
                    });
                }
            } catch (error) {
                // Handle errors (e.g., network error, invalid JSON response)
                document.getElementById('tableBody').innerHTML = `<tr><td colspan='5'>Error fetching data.</td></tr>`;
            }
        }

        // Call the function to fetch data and update the table when the page loads
        fetchDataAndUpdateTable();
    </script>
</body>
</html>
