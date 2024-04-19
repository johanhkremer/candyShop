export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	on_sale: boolean;
	images: {
		thumbnail: string;
		large: string;
	};
	stock_status: string;
	stock_quantity: number;
	tags: Tag[];
}

interface Tag {
	id: number;
	name: string;
	slug: string;
}

export interface ProductItem {
	id: number;
	image: string;
	name: string;
	price: number;
	stock: number;
}

export interface CartItem extends ProductItem {
	amount: number;
	totalCost: number;
}

export interface ApiResponse {
	status: string;
	data: {
		id: number;
		user_id: number;
		order_date: string;
	};
}

export interface Data {
	customer_first_name: string;
	customer_last_name: string;
	customer_address: string;
	customer_postcode: string;
	customer_city: string;
	customer_email: string;
	order_total: number;
	order_items: Item[];
}

interface Item {
	product_id: number;
	qty: number;
	item_price: number;
	item_total: number;
}
