import "./style.css";
import { productCard } from "./productCard.ts";
import { setListeners } from "./eventListners.ts";
import { cartListener } from "./cart.ts";
import { fetchAllproducts } from "./apiCalls.ts";

// Funktion för att rendera hela hemsidan
async function renderScreen() {
	const productList = await fetchAllproducts();
	const productsInStock = productList.filter(
		(product) => product.stock_status == "instock"
	);

	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <nav>
    <p>CandyShop</p>
    <div class="bajs">
        <i class="bi bi-cart2"></i>
    </div>
  </nav>
 
  
  <main id="toRender">
  <div class="numberOfProducts">
    <p>${productList.length} Produkter (${productsInStock.length} i lager)</p>
  </div>
  ${await productCard()}
  </main>
  `;
	setListeners();
	cartListener();
}
renderScreen();
