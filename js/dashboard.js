document.addEventListener('DOMContentLoaded', () => {
    const wishListTableBody = document.getElementById('wishListTable').querySelector('tbody');

    // Charger la wish list depuis le localStorage
    function loadWishListFromStorage() {
        const wishListData = JSON.parse(localStorage.getItem('wishList')) || [];
        wishListTableBody.innerHTML = ''; // Réinitialise le contenu du tableau

        wishListData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.recipeID}</td>
                <td>${item.itemName}</td>
                <td>${item.categoryName}</td>
                <td>${item.rank}</td>
                <td>${item.materials}</td>
            `;
            wishListTableBody.appendChild(row);
        });
    }

    // Charger la wish list au chargement de la page
    loadWishListFromStorage();
});
