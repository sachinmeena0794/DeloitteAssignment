document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");
    const pagination = document.getElementById("pagination");
    const filterToggle = document.querySelector(".filter-toggle");
    const sortToggle = document.querySelector(".sort-toggle");
    const filters = document.getElementById("filters");
    const sortSelect = document.getElementById("sort");
    const categoryFilters = document.getElementById("category-filters");

    let products = [];
    let categories = [];
    let currentPage = 1;
    const productsPerPage = 6;

    // Function to render products
    const renderProducts = (page = 1) => {
        productList.innerHTML = "";
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const slicedProducts = products.slice(start, end);

        slicedProducts.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <div class="price">$${product.price}</div>
                <img src="public/images/heart-icon.png" class="heart-icon" alt="Heart Icon">
            `;

            productList.appendChild(productElement);
        });

        renderPagination();
    };

    // Function to render pagination
    const renderPagination = () => {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(products.length / productsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderProducts(currentPage);
            });

            pagination.appendChild(pageButton);
        }
    };

    // Function to render categories
    const renderCategories = () => {
        categories.forEach(category => {
            const categoryElement = document.createElement("div");
            categoryElement.innerHTML = `
                <input type="checkbox" id="${category}" name="category" value="${category}">
                <label for="${category}">${category}</label>
            `;
            categoryFilters.appendChild(categoryElement);
        });
    };

    // Fetch products from the API
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(); // Initially render products
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });

    // Fetch categories from the API
    fetch("https://fakestoreapi.com/products/categories")
        .then(response => response.json())
        .then(data => {
            categories = data;
            renderCategories(); // Render categories
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });

    // Event listener for sorting products
    sortSelect.addEventListener("change", (e) => {
        const sortBy = e.target.value;
        if (sortBy === "price-low-high") {
            products.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high-low") {
            products.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name-a-z") {
            products.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "name-z-a") {
            products.sort((a, b) => b.title.localeCompare(a.title));
        }
        renderProducts(currentPage);
    });

    // Event listener for toggling filters on mobile
    filterToggle.addEventListener("click", () => {
        filters.classList.toggle("active");
    });

    // Event listener for toggling sort options on mobile
    sortToggle.addEventListener("click", () => {
        sortSelect.classList.toggle("active");
    });
});
