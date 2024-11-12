document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('recipeTable').querySelector('tbody');
    const wishListTableBody = document.getElementById('wishListTable').querySelector('tbody');

    let itemListMapping = {};  // Mappage global ItemId -> Name

    const categories = {
        1: 'WeaponSword',
        2: 'WeaponShield',
        3: 'WeaponBow',
        4: 'WeaponStaff',
        5: 'WeaponGreatshield',
        6: 'WeaponRod',
        7: 'WeaponDagger',
        8: 'WeaponArchistaff',
        9: 'WeaponMagickBow',
        10: 'WeaponGreatsword',
        11: 'WeaponGauntlet',
        12: 'WeaponLance',
        13: 'EquipArmorHelm',
        14: 'EquipArmorBody',
        15: 'EquipArmorArm',
        16: 'EquipArmorLeg',
        17: 'EquipClothingBody',
        18: 'EquipClothingLeg',
        19: 'EquipOverwear',
        20: 'EquipJewelry',
        21: 'EquipLantern',
        22: 'EquipEnsemble',
        23: 'Use',
        24: 'Job',
        25: 'Material',
        26: 'LimitBreak',
        27: 'Furniture',
        28: 'WeaponMagickSword'
    };

    // Charger les fichiers JSON
    Promise.all([
        fetch('data/CraftingRecipes.json').then(response => response.json()),
        fetch('data/ItemList.json').then(response => response.json())
    ])
    .then(([craftingRecipes, itemList]) => {
        itemList.forEach(item => {
            itemListMapping[Number(item.ItemId)] = item.Name;
        });

        createTable(craftingRecipes, itemListMapping);

        searchInput.addEventListener('input', function() {
            filterTable(searchInput.value.toLowerCase());
        });
    })
    .catch(error => console.error('Erreur lors du chargement des fichiers JSON:', error));

    function createTable(data, itemListMapping) {
    const tableBody = document.querySelector('#recipeTable tbody');
    tableBody.innerHTML = ''; // Réinitialise le contenu du tableau

    data.forEach(category => {
        category.RecipeList.forEach(recipe => {
            const itemId = Number(recipe.ItemID);
            const itemName = itemListMapping[itemId] || 'Unknown';
            const categoryName = categories[category.Category] || 'Unknown';

            const row = document.createElement('tr');
            row.setAttribute('data-item-name', itemName.toLowerCase());

            row.innerHTML = `
                <td><input type="checkbox" class="select-checkbox"></td>
                <td>${recipe.RecipeID}</td>
                <td>${itemName}</td>
                <td>${categoryName}</td>
                <td class="hide-column">${recipe.Time}</td> <!-- Ajouter classe pour masquer -->
                <td class="hide-column">${recipe.Cost}</td> <!-- Ajouter classe pour masquer -->
                <td class="hide-column">${recipe.Exp}</td> <!-- Ajouter classe pour masquer -->
                <td>${recipe.NeedRank}</td>
                <td>${formatMaterials(recipe.CraftMaterialList, itemListMapping)}</td>
            `;

            const checkbox = row.querySelector('.select-checkbox');
            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    addToWishList(row, itemName, categoryName, recipe);
                } else {
                    removeFromWishList(row);
                }
            });

            tableBody.appendChild(row);
        });
    });
}

    function formatMaterials(materials) {
        if (!materials || !Array.isArray(materials)) return 'Unknown';
        return materials.map(material => {
            const itemName = itemListMapping[material.ItemId] || 'Unknown';
            return `${itemName} x${material.Num}`;
        }).join(', ');
    }

    function filterTable(searchTerm) {
        tableBody.querySelectorAll('tr').forEach(row => {
            const itemName = row.getAttribute('data-item-name');
            row.style.display = itemName && itemName.includes(searchTerm) ? '' : 'none';
        });
    }

    function addToWishList(row, itemName, categoryName, recipe) {
        const wishListRow = document.createElement('tr');
        wishListRow.innerHTML = `
            <td><input type="checkbox" class="select-checkbox" checked></td>
            <td>${recipe.RecipeID}</td>
            <td>${itemName}</td>
            <td>${categoryName}</td>
            <td class="hide-column">${recipe.Time}</td>
            <td class="hide-column">${recipe.Cost}</td>
            <td class="hide-column">${recipe.Exp}</td>
            <td>${recipe.NeedRank}</td>
            <td>${formatMaterials(recipe.CraftMaterialList)}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;

        wishListRow.querySelector('.remove-btn').addEventListener('click', () => wishListRow.remove());
        wishListTableBody.appendChild(wishListRow);
    }

    function removeFromWishList(row) {
        const recipeID = row.querySelector('td:nth-child(2)').textContent;
        Array.from(wishListTableBody.querySelectorAll('tr')).forEach(wishListRow => {
            if (wishListRow.querySelector('td:nth-child(2)').textContent === recipeID) {
                wishListRow.remove();
            }
        });
    }
});
