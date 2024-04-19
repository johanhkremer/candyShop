import {
	addProductShoppingCart,
	removeProductShoppingCart,
	findProduct
} from "./localStorageLogic";
import { renderOrder } from "./placeOrder";
import { renderPopup } from "./productCard";
import { Product } from "./interface";

// DOM referenser
export function setListeners() {
	const infoBtns = document.querySelectorAll(
		"#moreInfo"
	) as NodeListOf<HTMLButtonElement>;
	const eraseBtns = document.querySelectorAll(
		"#eraseFromCart"
	) as NodeListOf<HTMLButtonElement>;
	const addBtns = document.querySelectorAll(
		"#addToCart"
	) as NodeListOf<HTMLButtonElement>;

	// Knapp för mer information
	infoBtns.forEach((infoBtn) => {
		infoBtn.addEventListener("click", (event) => {
			event.preventDefault();
			renderPopup(Number(infoBtn.value));
		});
	});

	// Tar bort produkt i localStorage
	eraseBtns.forEach((eraseBtn) => {
		// Kod appliceas på alla knappar
		// Stockstatus sparas för varje knapp
		const stockStatus = eraseBtn.getAttribute("data-stockStatus");

		// Inhiberar addknapp om den är outofstock
		if (stockStatus === "outofstock") {
			eraseBtn.disabled = true;
		}

		eraseBtn.addEventListener("click", () => {
			if (eraseBtn.value) {
				const product = findProduct(Number(eraseBtn.value)) as Product;
				removeProductShoppingCart({
					id: product.id,
					price: product.price,
					image: `https://www.bortakvall.se${product.images.thumbnail}`,
					name: product.name,
					stock: product.stock_quantity
				});
			}
		});
	});

	// Lägger till produkt i localStorage
	addBtns.forEach((addBtn) => {
		// Kod appliceas på alla knappar
		// Stockstatus sparas för varje knapp
		const stockStatus = addBtn.getAttribute("data-stockStatus");
		// Inhiberar addknapp om den är outofstock
		if (stockStatus === "outofstock") {
			addBtn.disabled = true;
		}

		addBtn.addEventListener("click", () => {
			// Kod appliceras på en specifik knapp
			const product = findProduct(Number(addBtn.value)) as Product;

			addProductShoppingCart({
				id: product.id,
				price: product.price,
				image: `https://www.bortakvall.se${product.images.thumbnail}`,
				name: product.name,
				stock: product.stock_quantity
			});
		});
	});
}

export function checkoutListner() {
	const checkoutEl = document.querySelector<HTMLButtonElement>("#checkout")!;

	checkoutEl?.addEventListener("click", () => {
		const asideWrapper =
			document.querySelector<HTMLDivElement>("#sideWindow")!;

		asideWrapper.innerHTML = `
    ${renderOrder()}
    `;
	});
}
