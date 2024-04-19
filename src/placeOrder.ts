import { ApiResponse, Data, CartItem } from "./interface";
import { getCart } from "./localStorageLogic";
import { sendOrder } from "./apiCalls";

// Funktion för att skapa varje objekt som ska skickas med POST till API:et
function objApi() {
	const cart = getCart();
	const orderItems = cart?.map((product) => {
		return {
			product_id: product.id,
			qty: product.amount,
			item_price: product.price,
			item_total: product.totalCost
		};
	});
	return orderItems;
}

// Funktion för att rendera orderinfo + formulär
export function renderOrder() {
	const wrapper =
		document.querySelector<HTMLDivElement>("#cartItemsWrapper")!;
	const cartItems = getCart();

	// Räkna ut total summan av alla godisar
	let totalPrice: number = 0;
	cartItems?.forEach((total) => {
		totalPrice += total.totalCost;
	});

	// Räkna ut antalet av alla godisar
	let totalProduct: number = 0;
	cartItems?.forEach((total) => {
		totalProduct += total.amount;
	});

	// HTML för att rendera ett formulär i kassan
	wrapper.innerHTML = `
<header>
<h2 class="headerKassa">Kassa</h2>
<p>Fyll i dina uppgifter:</p>
</header>
<div>
<ul>
${cartItems
	?.map((cartItem: CartItem) => {
		return `
              <li id="candyCard"> 
               <div class="itemCard">
                   <img src="${cartItem.image}" alt=""/> 
                   <div class="itemCardInfo">
                       <p>${cartItem.name}</p>
                       <p class="smallText">${cartItem.price} kr/st</p>
                       <p class="smallText">totalt ${cartItem.totalCost} kr</p>
                   </div>
                   <div class="sumItemCard">
                       <p class="smallText amount" value="${cartItem.id}">${cartItem.amount}</p> 
                   </div>
               </div>
             </li>`;
	})
	.join("")}
</ul>
<p>Totalt pris: ${totalPrice}</p>
</div>



<form class="orderForm">
 <div class="inputWrapper">
    <label for="firstName" class="underline">
        Förnamn:
        <input type="text" name="förnamn" id="firstName" required>
    </label>

    <label for="lastName" class="underline">
    Efternamn:
    <input type="text" name="efternamn" id="lastName" required>
</label>

    <label for="adressInput" class="underline">
        Adress:
        <input type="text" name="adress" id="adressInput" required>
    </label>

    <label for="zipcodeInput" class="underline">
        Postnummer:
        <input type="text" name="zipcode" id="zipcodeInput" minlength="5" maxlength="6" required>
    </label>

    <label for="cityInput" class="underline">
        Ort:
        <input type="text" name="ort" id="cityInput" required>
    </label>

    <label for="telInput">
        Telefon:
        <input type="text" name="telephone" id="telInput">
    </label>

    <label for="mailInput" class="underline">
        E-post:
        <input type="text" name="email" id="mailInput" required>
    </label>
 </div>
 <button class="btn btnText" type="submit">Lägg order</button>
</form>`;

	placeOrder(totalPrice);
}

// Funktion för att skicka order med inputvärderna till api
function placeOrder(totalPrice: number) {
	const orderFormEl = document.querySelector<HTMLFormElement>(".orderForm");

	// Eventlyssnare som lyssar på att användaren lägger en order
	orderFormEl?.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Alla DOM refernenser
		const firstNameEl =
			document.querySelector<HTMLInputElement>("#firstName");
		const lastNameEl =
			document.querySelector<HTMLInputElement>("#lastName");
		const adressInputEl =
			document.querySelector<HTMLInputElement>("#adressInput");
		const zipcodeInputEl =
			document.querySelector<HTMLInputElement>("#zipcodeInput");
		const cityInputEl =
			document.querySelector<HTMLInputElement>("#cityInput");
		const mailInputEl =
			document.querySelector<HTMLInputElement>("#mailInput");

		// Värderna för alla inputfält
		const firstName = firstNameEl?.value || "";
		const lastName = lastNameEl?.value || "";
		const adressInput = adressInputEl?.value || "";
		const zipcodeInput = zipcodeInputEl?.value || "";
		const cityInput = cityInputEl?.value || "";
		const mailInput = mailInputEl?.value || "";

		const cart = objApi();

		// Skapar ett objekt med beställaren inputs och varor som ska köpas
		const placeOrder: Data = {
			customer_first_name: firstName,
			customer_last_name: lastName,
			customer_address: adressInput,
			customer_postcode: zipcodeInput,
			customer_city: cityInput,
			customer_email: mailInput,
			order_total: totalPrice,
			order_items: cart
		};

		// Kollar att alla requiered inputfält är ifyllda
		if (
			!firstName ||
			!lastName ||
			!adressInput ||
			!zipcodeInput ||
			!cityInput ||
			!mailInput
		) {
			alert("Please fill in all required fields");
			return;
		}

		// Försöker göra en POST till API + Catch hanterar om det inte går att anropa APIet
		try {
			const response = await sendOrder(placeOrder);
			renderStatusSuccess(response);
		} catch (error) {
			renderStatusFail();
		}
	});
}

// Funktion som renderar HTML om ordern gick igenom
const renderStatusSuccess = (data: ApiResponse) => {
	const wrapper =
		document.querySelector<HTMLDivElement>("#cartItemsWrapper")!;
	wrapper.innerHTML = `
    <div class="successwrapper">
    <h2 class="headerKassa">🛍️ Tack för din order! 🛍️</h2>
    <p class="ordernummer">Ditt ordernummer är: ${data.data.id}</p>
    <p>${data.data.order_date}</p>
    </div>
    `;

	//RENDERA KUNDVAGNENS HTML MEN TA BORT KNAPPARNA
};

// Funktion som renderar HTML om ordern inte gick igenom
const renderStatusFail = () => {
	const wrapper =
		document.querySelector<HTMLDivElement>("#cartItemsWrapper")!;
	wrapper.innerHTML = `
    <div class="successwrapper">
    <h2 class="headerKassa">Din order kunde inte skickas</h2>
    <p>Felet ligger hos vår leverantör och de är medvetna om felet</p>
    <figure>
    <img src="/Media/no-candy-for.jpeg" class="img-fluid" alt="meme-no-candy">
    </figure>
    </div>
    `;
};
