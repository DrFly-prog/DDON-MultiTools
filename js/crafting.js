document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('recipeTable').querySelector('tbody');
    const wishListTableBody = document.getElementById('wishListTable').querySelector('tbody');

    let itemListMapping = {};

    // Liste des catégories par ID
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

    // Charger les fichiers JSON et remplir la wish list depuis localStorage s'il existe des éléments
    Promise.all([
        fetch('data/CraftingRecipes.json').then(response => response.json()),
        fetch('data/ItemList.json').then(response => response.json())
    ])
    .then(([craftingRecipes, itemList]) => {
        itemList.forEach(item => {
            itemListMapping[Number(item.ItemId)] = item.Name;
        });

        createTable(craftingRecipes, itemListMapping);
        loadWishListFromStorage();
    })
    .catch(error => console.error('Erreur lors du chargement des fichiers JSON:', error));

   function createTable(data, itemListMapping) {
    tableBody.innerHTML = ''; // Réinitialise le contenu du tableau

    data.forEach(category => {
        category.RecipeList.forEach(recipe => {
            const itemId = Number(recipe.ItemID);
            const itemName = itemListMapping[itemId] || 'Unknown';
            const categoryName = categories[category.Category] || 'Unknown';

            const row = document.createElement('tr');
            row.setAttribute('data-item-name', itemName.toLowerCase()); // Ajoute un attribut pour la recherche

            row.innerHTML = `
                <td><input type="checkbox" class="select-checkbox"></td>
                <td>${recipe.RecipeID}</td>
                <td>${itemName}</td>
                <td>${categoryName}</td>
                <td class="hide-column">${recipe.Time}</td> <!-- Colonne masquée -->
                <td class="hide-column">${recipe.Cost}</td> <!-- Colonne masquée -->
                <td class="hide-column">${recipe.Exp}</td> <!-- Colonne masquée -->
                <td>${recipe.NeedRank}</td>
                <td>${formatMaterials(recipe.CraftMaterialList, itemListMapping)}</td>
            `;

            row.querySelector('.select-checkbox').addEventListener('change', (event) => {
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

    function formatMaterials(materials, itemListMapping) {
        if (!materials || !Array.isArray(materials)) return 'Unknown';
        return materials.map(material => {
            const itemName = itemListMapping[material.ItemId] || 'Unknown';
            return `${itemName} x${material.Num}`;
        }).join(', ');
    }

    function addToWishList(row, itemName, categoryName, recipe) {
        const wishListRow = document.createElement('tr');
        wishListRow.innerHTML = `
            <td><input type="checkbox" class="select-checkbox" checked></td>
            <td>${recipe.RecipeID}</td>
            <td>${itemName}</td>
            <td>${categoryName}</td>
            <td>${recipe.NeedRank}</td>
            <td>${formatMaterials(recipe.CraftMaterialList, itemListMapping)}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;

        wishListRow.querySelector('.remove-btn').addEventListener('click', () => {
            wishListRow.remove();
            saveWishListToStorage();
        });

        wishListTableBody.appendChild(wishListRow);
        saveWishListToStorage();
    }

    function removeFromWishList(row) {
        const recipeID = row.querySelector('td:nth-child(2)').textContent;
        Array.from(wishListTableBody.querySelectorAll('tr')).forEach(wishListRow => {
            if (wishListRow.querySelector('td:nth-child(2)').textContent === recipeID) {
                wishListRow.remove();
                saveWishListToStorage();
            }
        });
    }

    // Sauvegarde la wish list dans le localStorage
    function saveWishListToStorage() {
        const wishListData = Array.from(wishListTableBody.querySelectorAll('tr')).map(row => {
            return {
                recipeID: row.cells[1].textContent,
                itemName: row.cells[2].textContent,
                categoryName: row.cells[3].textContent,
                rank: row.cells[4].textContent,
                materials: row.cells[5].textContent
            };
        });
        localStorage.setItem('wishList', JSON.stringify(wishListData));
    }

    document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Convertit l'entrée utilisateur en minuscule
    filterTable(searchTerm);
    });

    function filterTable(searchTerm) {
        const rows = tableBody.querySelectorAll('tr'); // Sélectionne toutes les lignes du tableau
        rows.forEach(row => {
            const itemName = row.getAttribute('data-item-name'); // Récupère le nom de l'item
            if (itemName && itemName.includes(searchTerm)) {
                row.style.display = ''; // Affiche la ligne si elle correspond
            } else {
                row.style.display = 'none'; // Cache la ligne si elle ne correspond pas
            }
        });
    }

    // Charge la wish list depuis le localStorage
    function loadWishListFromStorage() {
        const wishListData = JSON.parse(localStorage.getItem('wishList')) || [];
        wishListTableBody.innerHTML = ''; // Réinitialise le contenu du tableau

        wishListData.forEach(item => {
            const wishListRow = document.createElement('tr');
            wishListRow.innerHTML = `
                <td><input type="checkbox" class="select-checkbox" checked></td>
                <td>${item.recipeID}</td>
                <td>${item.itemName}</td>
                <td>${item.categoryName}</td>
                <td>${item.rank}</td>
                <td>${item.materials}</td>
                <td><button class="remove-btn">Remove</button></td>
            `;

            wishListRow.querySelector('.remove-btn').addEventListener('click', () => {
                wishListRow.remove();
                saveWishListToStorage();
            });

            wishListTableBody.appendChild(wishListRow);
        });
    }
});
