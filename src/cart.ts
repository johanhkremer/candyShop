import { getCart, adjustCart, removeFromCart } from "./localStorageLogic";
import { renderOrder } from "./placeOrder";
import { CartItem } from "./interface";
import "bootstrap/dist/css/bootstrap.css";
import { setListeners } from "./eventListners";

// Öppna aside som innehåller kassan
export function cartListener() {
	const mainEl = document.querySelector<HTMLDivElement>("#app")!;
	const cartIcon = document.querySelector<HTMLDivElement>(".bajs")!;

	// Lyssnare för att rendera varukorgen
	cartIcon.addEventListener("click", () => {
		mainEl.innerHTML += `<aside id="sideWindow"></aside>`;
		renderCart();
	});
}

// UIn för att rendera ut asiden!
const renderCart = () => {
	const aside = document.querySelector<HTMLDivElement>("#sideWindow")!;
	const cartItems: CartItem[] = getCart();

	if (cartItems.length < 1) {
		aside.innerHTML = `
    <div class="emptyCart">
    <p>Tyvärr har du inget i din kundvagn</p>
    <button class="btn btnText closeCartBtn">Handla lite</button>
    </div>
    `;
	} else {
		// Totala summan för alla produkter så du vet
		let totalPrice: number = 0;
		cartItems?.forEach((total) => {
			totalPrice += total.totalCost;
		});

		// Totala antalet produkter både av samma och olika
		let totalProduct: number = 0;
		cartItems?.forEach((total) => {
			totalProduct += total.amount;
		});

		aside.innerHTML = `
    <header class="cartHeader">
        <button class="btn btnIcon closeCartBtn">
        <i class="bi bi-x-square"></i>
        </button>
    </header>

    <div class="cartItemsWrapper" id="cartItemsWrapper">
  <h2 class="headerKassa">Kundvagn</h2>
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
                              <button class="increaseCandy btn btnIcon" value="${cartItem.id}">
                                <i class="bi bi-arrow-up-short"></i>
                                </button>
                              <p class="smallText amount" value="${cartItem.id}">${cartItem.amount}</p>
                              <button class="decreaseCandy btn btnIcon" value="${cartItem.id}">
                                  <i class="bi bi-arrow-up-short"></i>
                              </button>
                          </div>
                          <button class="eraseProduct" value="${cartItem.id}"><i class="bi bi-trash"></i></button>
                      </div>
                    </li>`;
			})
			.join("")}
      </ul>
    </div>

    <div class="sumTable">
    <p>Din order:</p>
        <ul>
        <li class="smallText">
          Antal godisar: ${totalProduct} st
        </li>
        <li class="smallText">
          skatt: ${Number(totalPrice * 0.2).toFixed(0)} kr
        </li>
        <li>
          Att betala:${totalPrice} kr
        </li>
        </ul>
        <button id="checkout" class="btn btnText">Checkout</button>
    </div>
    `;
	}

	closeCart();
	adjustCandyItems();
	getIdToRemove();
	checkout();
};

// Funktion för att stänga varukorgen om användaren vill kolla mer i godisaffären
function closeCart() {
	const buttonCartEl =
		document.querySelector<HTMLButtonElement>(".closeCartBtn")!;
	buttonCartEl?.addEventListener("click", () => {
		const cartItemsWrapperEl =
			document.querySelector<HTMLDivElement>("#sideWindow")!;
		cartItemsWrapperEl.remove();
		cartListener();
		setListeners();
	});
}

// Funktion som tar användaren till formuläret för att fylla in sin data
function checkout() {
	const checkoutEl = document.querySelector<HTMLFormElement>("#checkout");
	checkoutEl?.addEventListener("click", () => {
		renderOrder();
		const sumTable = document.querySelector<HTMLDivElement>(".sumTable");
		sumTable?.remove();
	});
}

// Funktion för att ändra antalet godisar i varukorgen
function adjustCandyItems() {
	const increaseCandy = document.querySelectorAll(".increaseCandy");
	const decreaseCandy = document.querySelectorAll(".decreaseCandy");

	// Öka antalet godisar
	increaseCandy.forEach((increaseBtn) => {
		increaseBtn.addEventListener("click", () => {
			if (increaseBtn.nextElementSibling) {
				const id: number = Number(
					increaseBtn.nextElementSibling.getAttribute("value")
				);
				adjustCart(id, "add");
				renderCart();
			}
		});
	});

	// Minska antalet godisar
	decreaseCandy.forEach((decreaseBtn) => {
		decreaseBtn.addEventListener("click", () => {
			if (decreaseBtn.previousElementSibling) {
				const id: number = Number(
					decreaseBtn.previousElementSibling.getAttribute("value")
				);
				adjustCart(id, "remove");
				renderCart();
			}
		});
	});
}

// Tar bort direkt från kundvagnen
function getIdToRemove() {
	const allCartItems = document.querySelectorAll(".eraseProduct");
	allCartItems.forEach((element) => {
		element.addEventListener("click", () => {
			const candyID = element.getAttribute("value");
			removeFromCart(Number(candyID));
			renderCart();
		});
	});
}
