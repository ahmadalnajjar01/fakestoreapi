function toggleProductForm() {
  const formSection = document.getElementById("product-form");
  const currentDisplay = window.getComputedStyle(formSection).display;
  formSection.style.display = currentDisplay === "none" ? "block" : "none";
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;

  const newProduct = {
    title: title,
    price: parseFloat(price),
    image: image,
    description: description,
  };

  console.log("Submitting product:", newProduct);

  try {
    const response = await fetch(
      "https://6789454a2c874e66b7d83a6c.mockapi.io/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("Product added:", result);
      alert("Product added successfully!");

      document.getElementById("product-form").querySelector("form").reset();

      toggleProductForm();

      fetchAndRenderProducts();
    } else {
      console.error("Server response:", response);
      alert("Failed to add product.");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    alert("An error occurred while adding the product.");
  }
}

async function fetchAndRenderProducts() {
  try {
    const response = await fetch(
      "https://6789454a2c874e66b7d83a6c.mockapi.io/products"
    );
    if (response.ok) {
      const products = await response.json();
      console.log("Fetched products:", products);

      const main = document.querySelector("main");

      let productSection = document.getElementById("product-list");
      if (!productSection) {
        productSection = document.createElement("section");
        productSection.id = "product-list";
        main.appendChild(productSection);
      }

      productSection.innerHTML = `
        <h2>Products</h2>
        <div class="products-grid"></div>
      `;

      const gridContainer = productSection.querySelector(".products-grid");

      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="card-image" />
          <div class="card-content">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <div class="card-actions">
              <button class="edit-btn" data-id="${product.id}">Edit</button>
              <button class="delete-btn" data-id="${product.id}">Delete</button>
            </div>
          </div>
        `;

        gridContainer.appendChild(card);
      });

      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
          const id = event.target.dataset.id;
          editProduct(id);
        });
      });

      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
          const id = event.target.dataset.id;
          deleteProduct(id);
        });
      });
    } else {
      console.error("Failed to fetch products:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...");

  const form = document.querySelector("#product-form form");
  form.addEventListener("submit", handleFormSubmit);

  const showFormBtn = document.getElementById("show-form-btn");
  showFormBtn.addEventListener("click", toggleProductForm);

  document.getElementById("product-form").style.display = "none";

  fetchAndRenderProducts();
});

async function deleteProduct(id) {
  const confirmed = confirm("Are you sure you want to delete this product?");
  if (confirmed) {
    try {
      const response = await fetch(
        `https://6789454a2c874e66b7d83a6c.mockapi.io/products/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("Product deleted successfully!");
        fetchAndRenderProducts();
      } else {
        alert("Failed to delete product.");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      alert("An error occurred while deleting the product.");
      console.error("Error:", error);
    }
  }
}

async function editProduct(id) {
  const title = prompt("Enter new title:");
  const price = prompt("Enter new price:");
  const image = prompt("Enter new image URL:");
  const description = prompt("Enter new description:");

  if (title && price && image && description) {
    const updatedProduct = {
      title: title,
      price: parseFloat(price),
      image: image,
      description: description,
    };

    try {
      const response = await fetch(
        `https://6789454a2c874e66b7d83a6c.mockapi.io/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (response.ok) {
        alert("Product updated successfully!");
        fetchAndRenderProducts();
      } else {
        alert("Failed to update product.");
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      alert("An error occurred while updating the product.");
      console.error("Error:", error);
    }
  } else {
    alert("All fields are required to edit the product.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#product-form form");
  form.addEventListener("submit", handleFormSubmit);

  fetchAndRenderProducts();
});
