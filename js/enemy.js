document.addEventListener('DOMContentLoaded', () => {
    const dropsTableBody = document.getElementById('dropsTable').querySelector('tbody');
    const enemiesTableBody = document.getElementById('enemiesTable').querySelector('tbody');
    let stageIdMap = {};

    // Load Stage ID reference from stage_list.slt.json
    fetch('data/stage_list.slt.json')
        .then(response => response.json())
        .then(stageData => {
            stageData.StageListInfoList.forEach(stage => {
                stageIdMap[stage.StageId] = stage.StageName.En;
            });
            loadEnemyData(); // Call loadEnemyData after stageIdMap is ready
        })
        .catch(error => console.error('Error loading stage data:', error));

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
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${dropTable.id}</td>
                    <td>${dropTable.name}</td>
                    <td>${item[0]}</td>
                    <td>${item[1]}</td>
                    <td>${item[2]}</td>
                    <td>${item[3]}</td>
                    <td>${item[5]}</td>
                `;
                dropsTableBody.appendChild(row);
            });
        });
    }

    function populateEnemiesTable(enemies) {
        enemies.forEach(enemy => {
            const row = document.createElement('tr');
            const stageName = stageIdMap[enemy.StageId] || 'Unknown';
            row.innerHTML = `
                <td>${stageName}</td>
                <td>${enemy.LayerNo}</td>
                <td>${enemy.GroupId}</td>
                <td>${enemy.SubGroupId}</td>
                <td>${enemy.EnemyId}</td>
                <td>${enemy.Lv}</td>
                <td>${enemy.Experience}</td>
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
