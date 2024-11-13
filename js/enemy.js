document.addEventListener('DOMContentLoaded', () => {
    const dropsTableBody = document.getElementById('dropsTable').querySelector('tbody');
    const enemiesTableBody = document.getElementById('enemiesTable').querySelector('tbody');
    let stageIdMap = {};
    let enemyIdMap = {};
    let itemIdMap = {};

    // Load StageId mapping from stage_list.slt.json
    fetch('data/stage_list.slt.json')
        .then(response => response.json())
        .then(stageData => {
            stageData.StageListInfoList.forEach(stage => {
                stageIdMap[stage.StageId] = stage.StageName.En;
            });
            loadEnemyNames(); // Load enemy names after stageIdMap is ready
        })
        .catch(error => console.error('Error loading stage data:', error));

    function loadEnemyNames() {
        fetch('data/Enemyname.json')
            .then(response => response.json())
            .then(enemyData => {
                enemyData.forEach(enemy => {
                    enemyIdMap[enemy.id] = enemy.name;
                });
                loadItemNames(); // Load item names after enemyIdMap is ready
            })
            .catch(error => console.error('Error loading enemy names:', error));
    }

    function loadItemNames() {
        fetch('data/Itemlist.json')
            .then(response => response.json())
            .then(itemData => {
                itemData.forEach(item => {
                    itemIdMap[item.ItemId] = item.Name;
                });
                loadEnemyData(); // Load EnemySpawn.json after itemIdMap is ready
            })
            .catch(error => console.error('Error loading item names:', error));
    }

    function loadEnemyData() {
        fetch('data/EnemySpawn.json')
            .then(response => response.json())
            .then(data => {
                populateDropsTable(data.dropsTables);
                populateEnemiesTable(data.enemies);
            })
            .catch(error => console.error('Error loading EnemySpawn data:', error));
    }

    function populateDropsTable(drops) {
        drops.forEach(dropTable => {
            dropTable.items.forEach(item => {
                const itemName = itemIdMap[item[0]] || 'Unknown';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${dropTable.id || 'N/A'}</td>
                    <td>${dropTable.name || 'N/A'}</td>
                    <td>${itemName}</td>                <!-- Display Item Name -->
                    <td>${item[2] || 'N/A'}</td>
                    <td>${item[5] || 'N/A'}</td>
                `;
                dropsTableBody.appendChild(row);
            });
        });
    }

    function populateEnemiesTable(enemies) {
        enemies.forEach(enemy => {
            const stageName = stageIdMap[enemy[0]] || 'Unknown';
            const enemyName = enemyIdMap[enemy[4]] || 'Unknown';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stageName}</td>          <!-- StageName -->
                <td>${enemyName}</td>          <!-- EnemyName instead of EnemyId -->
                <td>${enemy[8] || 'N/A'}</td>  <!-- Level -->
                <td>${enemy[23] || 'N/A'}</td> <!-- Experience -->
            `;
            enemiesTableBody.appendChild(row);
        });
    }

    // Search functionality for Drops Table
    document.getElementById('dropsSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        Array.from(dropsTableBody.querySelectorAll('tr')).forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
        });
    });

    // Search functionality for Enemies Table
    document.getElementById('enemiesSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        Array.from(enemiesTableBody.querySelectorAll('tr')).forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
        });
    });
});
