
// container dom catch here.............
let allPlantsCache = [];
const categoryContainer = document.getElementById("category-container");
const treeCardContainer = document.getElementById("tree-card-container");
const cartContainer = document.getElementById("cart-container");
const detailsContainer = document.getElementById("details-container");
const total = parseInt(document.getElementById("total").innerText);
let totalPrice = 0;


//load category .................
const loadTreeCategories = async () => {
    try {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/categories"
  );
  if (!response.ok) throw new Error('API failed');
  const json = await response.json();
  const category = json.categories;
  //console.log(category);

  category.forEach((cat) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <li onclick="plantByCategories('${cat.id}')" class="hover:bg-[#3b813e] p-2 hover:text-white rounded-xl">${cat.category_name}</li>
        `;
    categoryContainer.appendChild(li);
  });

  //using event delegation
  categoryContainer.addEventListener("click", (e) => {
    const allList = document.querySelectorAll("li");
    //console.log(allList);

    allList.forEach((li) => {
      li.classList.remove("bg-[#3b813e]", "text-white");
    });

    if (e.target.tagName === "LI") {
      e.target.classList.add("bg-[#3b813e]", "text-white");
    }
  });
}catch (error) {
    console.error('Error', error);
}
};

//All plants fetch here................
const allPlants = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/plants"
  );
  const json = await response.json();
  const plant = json.plants;
  //console.log(plant.plants);

  treeCardContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();
  plant.forEach((plant) => {
    const div = document.createElement("div");
    div.innerHTML = `
          <div id="cards" class="bg-white shadow-sm p-4 rounded-lg flex flex-col h-full w-full">
    <div class="w-full h-[180px]">
        <img class="rounded-lg w-full h-full object-cover" loading="lazy" src="${plant.image}" alt="${plant.name}">
    </div>

    <div class="flex flex-col flex-grow mt-3">
        <h3 onclick="loadTreeDetail('${plant.id}')" class="font-bold text-lg truncate name">${plant.name}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">${plant.description}</p>

        <div class="mt-auto">
            <div class="flex justify-between items-center mb-3">
                <p class="bg-[#dcfce7] px-3 py-1 text-[12px] rounded-3xl">${plant.category}</p>
                <p class="font-bold">৳${plant.price}</p>
            </div>
            <button onclick="addToCart('${plant.name}', ${plant.price})" class="btn bg-[#3b813e] text-white rounded-full w-full py-2">
                Add To Cart
            </button>
        </div>
    </div>
</div>
`;
    fragment.appendChild(div);
  });
  treeCardContainer.appendChild(fragment);
  spinner(false);
};

//both load category and plants masage show ..............
const initializeApp = async () => {
    await Promise.all([loadTreeCategories(), allPlants()]);
};
initializeApp();



const loadTreeDetail = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`
  );
  const json = await response.json();
  const data = json.plants;
  showModal(data);
};

const showModal = (data) => {
  detailsContainer.innerHTML = `
     <div class="flex flex-col justify-center h-full w-full space-y-3">
       <h3 class="font-bold text-lg">${data.name}</h3>
       <img class="w-full h-40 object-cover rounded-lg mx-auto" src="${data.image}" alt="">
       <p class="text-sm">Category: <span class="font-medium">${data.category}</span></p>
       <p class="text-sm">Price: ৳<span class="font-semibold">${data.price}</span></p>
       <p class="text-sm leading-relaxed text-gray-600">${data.description}</p>
     </div>
  `;
  document.getElementById("my_modal").showModal();
};


//get plants by categories.............
const plantByCategories = async (id) => {
  spinner(true);
  const response = await fetch(
    `https://openapi.programming-hero.com/api/category/${id}`
  );
  const json = await response.json();
  const plantByCat = json.plants;

  treeCardContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();
  plantByCat.forEach((plant) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div id="cards" class="bg-white shadow-sm p-4 rounded-lg flex flex-col w-full">
    <div class="w-full h-[180px]">
        <img class="rounded-lg w-full h-full object-cover" loading="lazy" src="${plant.image}" alt="${plant.name}">
    </div>

    <div class="flex flex-col flex-grow mt-3">
        <h3 onclick="loadTreeDetail('${plant.id}')" class="font-bold text-lg truncate name">${plant.name}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">${plant.description}</p>

        <div class="mt-auto">
            <div class="flex justify-between items-center mb-3">
                <p class="bg-[#dcfce7] px-3 py-1 text-[12px] rounded-3xl">${plant.category}</p>
                <p class="font-bold">৳${plant.price}</p>
            </div>
            <button onclick="addToCart('${plant.name}', ${plant.price})" class="btn bg-[#3b813e] text-white rounded-full w-full py-2">
                Add To Cart
            </button>
        </div>
    </div>
</div>
        `;
        fragment.appendChild(div);
    });
    treeCardContainer.appendChild(fragment);
  spinner(false);
};

//add to cart..............
const addToCart = (name, price) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="rounded-xl p-4 bg-[#f0fdf4] mb-2 flex justify-between items-center">
    <div class="space-y-1">
    <p class="text-[12px] font-semibold">${name}</p>
    <p class="text-[#889396] price">${price}<i class="fa-solid fa-xmark text-sm"></i> ${1}</p>
    </div>
    <i class="fa-solid fa-xmark text-red-600 hover:text-red-900 cursor-pointer"></i>
    </div>
    `;
    cartContainer.appendChild(div);
    alert(`${name} has been added to the cart`);

  
  const total = parseInt(document.getElementById("total").innerText);
  const treePrice = parseInt(`${price}`);

  const totalPrice = total + treePrice;
  document.getElementById("total").innerText = totalPrice;
};

//remove part.............
cartContainer.addEventListener("click", (e) => {
  const total = parseInt(document.getElementById("total").innerText);
  if (e.target.tagName === "I") {
    e.target.parentElement.remove();
    const parent = e.target.parentElement;

    const getPrice = parseInt(parent.querySelector(".price").innerText);
    const priceMinus = total - getPrice;
    document.getElementById("total").innerText = priceMinus;
  }
});

//spinner added part .......
const spinnerEl = document.getElementById("spinner");

const spinner = (status) => {
  if (status) {
    spinnerEl.classList.remove("hidden");
    treeCardContainer.style.visibility = "hidden";
  } else {
    spinnerEl.classList.add("hidden");
    treeCardContainer.style.visibility = "visible";
  }
};
