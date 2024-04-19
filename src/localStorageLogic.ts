import { Product, ProductItem, CartItem } from "./interface";

let cart: CartItem[] = [];

// Skicka produktlistan till localstorage
export function productListToLocalStorage(productList: Product[]) {
	localStorage.setItem("productList", JSON.stringify(productList));
}

// Funktion för att hitta rätt produkten-id i localstorage
export function findProduct(id: number): Product | undefined {
	const productList: Product[] = JSON.parse(
		localStorage.getItem("productList") ?? ""
	);
	const product = productList.find((product) => product.id === Number(id));
	return product;
}

//
export function adjustCart(id: number, action: string) {
	const item = findExistingItem(id);
	//Hämtar cart för att kunna uppdatera nuvarande
	const cart = getCart();
	// Hämtar index av vårt item för att kunna ändra det och lägga in på samma plats
	const indexOfItem = cart?.findIndex((candy) => candy.id === Number(id));

	if (item) {
		if (action === "add") {
			item.amount++;
			item.totalCost = item.price * item.amount;
		} else {
			item.amount--;
			item.totalCost = item.price * item.amount;
		}

		if (item.amount == 0) {
			removeFromCart(Number(item.id));
		} else {
			cart?.splice(indexOfItem, 1, item);
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	}
}

// Funktion för att ta bort en vara från varukorgen
export function removeFromCart(id: number) {
	const cart = getCart();
	cart?.forEach((candy) => {
		if (candy.id === id) {
			const indexOfCandy = cart.findIndex((candy) => candy.id === id);
			cart.splice(indexOfCandy, 1);
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	});
}

// Funktion för att lägga till en produkt i varukorgen
export function addProductShoppingCart(product: ProductItem) {
	const item = findExistingItem(product.id);

	if (item) {
		// Loopar igen vår array och hittar rätt objekt och uppdaterar det
		cart.forEach((candyItem: CartItem) => {
			if (candyItem.id === product.id) {
				candyItem.amount++;
				candyItem.totalCost = candyItem.price * candyItem.amount;
			}
		});
	} else {
		// Lägger till nytt godis om det inte finns i varukorgen
		cart.push({
			id: product.id,
			image: product.image,
			name: product.name,
			price: product.price,
			stock: product.stock,
			amount: 1,
			totalCost: product.price
		});
	}

	// Uppdaterar LocalStorage
	localStorage.setItem("cart", JSON.stringify(cart));
}

// Minska antalet i varukorgen
export function removeProductShoppingCart(product: ProductItem) {
	const item = findExistingItem(product.id);

	if (item) {
		// Loopar  igen vår array och hittar rätt objekt och uppdaterar det
		cart.forEach((candyItem: CartItem, index) => {
			if (candyItem.id === item.id && candyItem.amount !== 1) {
				candyItem.amount--;
				candyItem.totalCost = candyItem.price * candyItem.amount;
				cart.splice(index, 1, candyItem);
			} else {
				cart.splice(index, 1);
			}
			localStorage.setItem("cart", JSON.stringify(cart));
		});
	}
}

// Ger dig hela kundvagnen
export function getCart(): CartItem[] {
	const cartJSON = localStorage.getItem("cart");
	if (cartJSON !== null) {
		const cart: CartItem[] = JSON.parse(cartJSON);
		return cart;
	} else {
		return (cart = []);
	}
}

function findExistingItem(id: number): CartItem | undefined {
	const cartJSON = localStorage.getItem("cart");

	if (cartJSON) {
		cart = JSON.parse(cartJSON);
		const found = cart.find((candy) => candy.id == id);
		return found;
	} else {
		return undefined;
	}
}
