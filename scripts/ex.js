

// --------- Basic DOM refs ---------
var categoryContainer = document.getElementById("category-container");
var treeCardContainer = document.getElementById("tree-card-container");
var cartContainer = document.getElementById("cart-container");
var spinnerEl = document.getElementById("spinner");
var totalEl = document.getElementById("total");

var totalPrice = 0;

// --------- Spinner helpers ---------
function showSpinner() {
  if (spinnerEl) spinnerEl.classList.remove("hidden");
  if (treeCardContainer) treeCardContainer.style.visibility = "hidden";
}
function hideSpinner() {
  if (spinnerEl) spinnerEl.classList.add("hidden");
  if (treeCardContainer) treeCardContainer.style.visibility = "visible";
}

// --------- Load categories ---------
function loadTreeCategories() {
  return fetch("https://openapi.programming-hero.com/api/categories")
    .then(function (res) { return res.json(); })
    .then(function (json) {
      var categories = json && json.categories ? json.categories : [];
      // build category list
      var html = "";
      for (var i = 0; i < categories.length; i++) {
        var c = categories[i];
        html +=
          '<li data-catid="' + c.id + '" class="hover:bg-[#3b813e] p-2 hover:text-white rounded-xl">' +
          c.category_name +
          "</li>";
      }
      categoryContainer.innerHTML += html; // "All Tree" আগেই আছে
    })
    .catch(function (err) {
      console.log("Error loading categories:", err);
    });
}

// click on a category (event delegation)
categoryContainer.addEventListener("click", function (e) {
  var li = e.target;
  if (!li || !li.getAttribute("data-catid")) return;

  // remove active class from only category items (inside this container)
  var items = categoryContainer.querySelectorAll("li[data-catid]");
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("bg-[#3b813e]", "text-white");
  }
  li.classList.add("bg-[#3b813e]", "text-white");

  plantByCategories(li.getAttribute("data-catid"));
});

// --------- Load all plants ---------
function allPlants() {
  showSpinner();
  return fetch("https://openapi.programming-hero.com/api/plants")
    .then(function (res) { return res.json(); })
    .then(function (json) {
      var plants = json && json.plants ? json.plants : [];
      renderCards(plants);
    })
    .catch(function (err) {
      console.log("Error loading plants:", err);
    })
    .finally(function () {
      hideSpinner();
    });
}

// --------- Render cards ---------
function renderCards(list) {
  var html = "";
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    html +=
      '<div class="bg-white shadow-sm p-4 rounded-lg flex flex-col h-full w-full">' +
      '  <div class="w-full h-[180px]">' +
      '    <img class="rounded-lg w-full h-full object-cover" loading="lazy" src="' + p.image + '" alt="' + p.name + '">' +
      "  </div>" +
      '  <div class="flex flex-col flex-grow mt-3">' +
      '    <h3 class="font-bold text-lg truncate name cursor-pointer" data-id="' + p.id + '">' + p.name + "</h3>" +
      '    <p class="text-sm text-gray-600 line-clamp-2">' + p.description + "</p>" +
      '    <div class="mt-auto">' +
      '      <div class="flex justify-between items-center mb-3">' +
      '        <p class="bg-[#dcfce7] px-3 py-1 text-[12px] rounded-3xl">' + p.category + "</p>" +
      '        <p class="font-bold">৳' + p.price + "</p>" +
      "      </div>" +
      '      <button class="btn bg-[#3b813e] text-white rounded-full w-full py-2" data-name="' + p.name.replace(/"/g, "&quot;") + '" data-price="' + p.price + '">Add To Cart</button>' +
      "    </div>" +
      "  </div>" +
      "</div>";
  }
  treeCardContainer.innerHTML = html;
}

// --------- Card interactions: name click / add to cart ---------
treeCardContainer.addEventListener("click", function (e) {
  var target = e.target;

  // open details when name clicked
  if (target && target.classList.contains("name")) {
    var id = target.getAttribute("data-id");
    if (id) loadTreeDetail(id);
    return;
  }

  // add to cart
  if (target && target.tagName === "BUTTON" && target.hasAttribute("data-price")) {
    var name = target.getAttribute("data-name");
    var price = parseInt(target.getAttribute("data-price"), 10) || 0;
    addToCart(name, price);
  }
});

// --------- Load one plant details ---------
function loadTreeDetail(id) {
  fetch("https://openapi.programming-hero.com/api/plant/" + id)
    .then(function (res) { return res.json(); })
    .then(function (json) {
      var data = json && json.plants ? json.plants : null;
      if (data) showModal(data);
    })
    .catch(function (err) {
      console.log("Error loading details:", err);
    });
}

// --------- Show modal (requires existing HTML dialog) ---------
function showModal(data) {
  var modal = document.getElementById("my_modal");            // <dialog id="my_modal">
  var detailsContainer = document.getElementById("details-container"); // inside dialog

  if (!modal || !detailsContainer) {
    alert("Modal elements not found in HTML.");
    return;
  }

  detailsContainer.innerHTML =
    '<div class="flex flex-col justify-center h-full w-full space-y-3">' +
    '  <h3 class="font-bold text-xl">' + data.name + "</h3>" +
    '  <img class="w-full h-48 object-cover rounded-lg mx-auto" src="' + data.image + '" alt="' + data.name + '">' +
    '  <p class="text-sm">Category: <span class="font-medium">' + data.category + "</span></p>" +
    '  <p class="text-sm">Price: ৳<span class="font-semibold">' + data.price + "</span></p>" +
    '  <p class="text-sm leading-relaxed text-gray-600">' + data.description + "</p>" +
    "</div>";

  // open native dialog (works without any JS framework)
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    // fallback if <dialog> unsupported
    modal.style.display = "block";
  }
}

// --------- Filter by category ---------
function plantByCategories(id) {
  showSpinner();
  fetch("https://openapi.programming-hero.com/api/category/" + id)
    .then(function (res) { return res.json(); })
    .then(function (json) {
      var list = json && json.plants ? json.plants : [];
      renderCards(list);
    })
    .catch(function (err) {
      console.log("Error loading category plants:", err);
    })
    .finally(function () {
      hideSpinner();
    });
}

// --------- Add to cart & update total ---------
function addToCart(name, price) {
  var row = document.createElement("div");
  row.innerHTML =
    '<div class="rounded-2xl p-4 bg-[#f0fdf4] mb-2 flex justify-between items-center">' +
    '  <div class="space-y-1">' +
    '    <p class="text-[12px] font-semibold">' + name + "</p>" +
    '    <p class="text-[#889396] price">' + price + ' <i class="fa-solid fa-xmark text-sm"></i> 1</p>' +
    "  </div>" +
    '  <i class="fa-solid fa-xmark text-red-600 hover:text-red-900 cursor-pointer" data-remove="' + price + '"></i>' +
    "</div>";

  cartContainer.appendChild(row);

  totalPrice = (parseInt(totalEl.innerText, 10) || 0) + (parseInt(price, 10) || 0);
  totalEl.innerText = totalPrice;

  alert(name + " has been added to the cart");
}

// remove from cart (event delegation)
cartContainer.addEventListener("click", function (e) {
  var icon = e.target;
  if (!icon || !icon.getAttribute("data-remove")) return;

  var price = parseInt(icon.getAttribute("data-remove"), 10) || 0;
  totalPrice = Math.max(0, (parseInt(totalEl.innerText, 10) || 0) - price);
  totalEl.innerText = totalPrice;

  // remove row
  var row = icon.parentElement;
  if (row) row.remove();
});

// --------- Init ---------
function initializeApp() {
  Promise.all([loadTreeCategories(), allPlants()]).then(function () {
    // ready
  });
}

// Run when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
