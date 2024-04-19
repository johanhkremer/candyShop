import { Product } from "./interface";
import { fetchAllproducts } from "./apiCalls";
import { findProduct } from "./localStorageLogic";
import { setListeners } from "./eventListners";
import { cartListener } from "./cart";

//Funktion som renderar ut alla produktkort
export async function productCard() {
	// Kollar inte efter error då det görs i fetchAllproducts, borde jag ändå  kolla?
	const products: Product[] = await fetchAllproducts();

	products.sort(function (a, b) {
		let nameA = a.name.toLocaleUpperCase();
		let nameB = b.name.toLocaleUpperCase();

		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});

	return products
		.map((element) => {
			return `
      <div class="card" value="${element.id} status="${element.stock_status}">
      <img src="https://www.bortakvall.se${
			element.images.thumbnail
		}" class="card-img-top" alt="...">
      <div class="card-body">
      <div>
        <header>
          <h5 class="card-title">${element.name}</h5> <p>${element.price} kr</p>
        </header>
        <article class="tagContainer">
          ${element.tags
				.map((tags) => {
					return `<p class="tag card-text">${tags.name}</p>`;
				})
				.join("")}
        </article>
        </div>
        <footer>
          <button id="moreInfo" class="btn btnText" value="${element.id}" ">Mer Info</button>
          <div class="cardCartBtn btn">
              <button id="eraseFromCart" class="btn btnIcon" value="${element.id}" data-stockStatus="${
					element.stock_status
				}">
                  <i class="bi bi-cart-dash"></i>
              </button>
              <button id="addToCart" class="btn btnIcon"  btnIcon" value="${element.id}" data-stockStatus="${
					element.stock_status
				}">
                  <i class="bi bi-cart-plus" value="add"></i>
              </button>
          </div>
        </footer>
      </div>
    </div>
`;
		})
		.join("");
}

// Renderar popup-fönstret
export const renderPopup = (id: number) => {
	const mainEL = document.querySelector<HTMLDivElement>("#app")!;
	const product = findProduct(id) as Product;

	const infoPopupHTML = `
    <div class="moreInfoPopup">
      <div class="moreInfoPopupContent">
        <img src="https://www.bortakvall.se${
			product.images.large
		}" alt="largecandy">
        <div class="popupText">
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <p>Antal i lager: ${
				product.stock_quantity == null
					? "Slut i lager"
					: product.stock_quantity
			}</p>
        <div>
        <button class="btn btnIcon closePopup">&times</button>
      </div>
    </div>`;

	mainEL.innerHTML += infoPopupHTML;
	const closePopup =
		document.querySelector<HTMLButtonElement>(".closePopup")!;

	// Lyssnar efter att användaren klickar på "läs mer"
	closePopup.addEventListener("click", () => {
		const moreInfoPopup =
			document.querySelector<HTMLDivElement>(".moreInfoPopup");
		if (moreInfoPopup) {
			moreInfoPopup.remove();
		}
	});
	setListeners();
	cartListener();
};
