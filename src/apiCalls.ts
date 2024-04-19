import { Data, Product } from "./interface";
import { productListToLocalStorage } from "./localStorageLogic";

// Api anrop med GET som metod
export async function fetchAllproducts(): Promise<Product[]> {
	// Hämtar produktlistan från API
	const res = await fetch("https://www.bortakvall.se/api/v2/products");
	// Felhantering
	if (!res.ok) {
		throw new Error(
			`Could not fetch the list of prodecuts. The status code was: ${res.status}`
		);
	}
	const data: { data: Product[] } = await res.json();
	// Skickar produktlistan till en funktion i localStorageLogic.ts
	productListToLocalStorage(data.data);
	return data.data;
}

// Api anrop mned POST som metod
export async function sendOrder(inputValues: Data) {
	const apiURL = "https://www.bortakvall.se/api/v2/users/31/orders";
	// Skickar en order till API
	const res = await fetch(apiURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(inputValues)
	});
	// Felhantering
	if (!res.ok) {
		throw new Error(
			`Sorry! There is an problem, could not place your order. Status code was: ${res.status}`
		);
	}
	const data = await res.json();
	return data;
}
