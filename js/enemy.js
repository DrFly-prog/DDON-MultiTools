document.addEventListener('DOMContentLoaded', () => {
    // Paths to JSON files in the data directory
    const itemEnemyDataPath = 'data/Itemxenemy.json';
    const mapEnemyDataPath = 'data/Mapxenemy.json';

    // Fetch and display Itemxenemy data
    fetch(itemEnemyDataPath)
        .then(response => response.json())
        .then(data => populateItemEnemyTable(data))
        .catch(error => console.error('Error loading Itemxenemy data:', error));

    // Fetch and display Mapxenemy data
    fetch(mapEnemyDataPath)
        .then(response => response.json())
        .then(data => populateMapEnemyTable(data))
        .catch(error => console.error('Error loading Mapxenemy data:', error));

    // Populate Itemxenemy Table
    function populateItemEnemyTable(data) {
        const tableBody = document.getElementById('itemEnemyTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear any existing rows
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item["Item iD"]}</td>
                <td>${item["Item Name"]}</td>
                <td>${item.Dropchance}</td>
                <td>${item["Enemy Id"]}</td>
                <td>${item["Enemy Name"]}</td>
                <td>${item["Enemy Level Min"]}</td>
                <td>${item["Enemy Level Max"]}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Populate Mapxenemy Table
    function populateMapEnemyTable(data) {
        const tableBody = document.getElementById('mapEnemyTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear any existing rows
        data.forEach(location => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${location.StageId}</td>
                <td>${location["Stage Name"]}</td>
                <td>${location.Lv}</td>
                <td>${location.EnemyId}</td>
                <td>${location["Enemy Name"]}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Search functionality for Itemxenemy Table
    document.getElementById('itemEnemySearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.getElementById('itemEnemyTable').querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchTerm) ? '' : 'none';
        });
    });

    // Search functionality for Mapxenemy Table
    document.getElementById('mapEnemySearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.getElementById('mapEnemyTable').querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchTerm) ? '' : 'none';
        });
    });
});
