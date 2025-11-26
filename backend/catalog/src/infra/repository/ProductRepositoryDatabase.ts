import pgp from "pg-promise";
import ProductRepository from "../../application/repository/ProductRepository";
import Product from "../../domain/entity/Product";
import DatabaseConnection from "../database/DatabaseConnection";


export default class ProductRepositoryDatabase implements ProductRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async list(): Promise<Product[]> {
		const productsData = await this.connection.query("select * from cccat11.product", []);
		const products: Product[] = [];
		for (const productData of productsData) {
			products.push(new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight)));
		}
		return products;
	}

	async get (idProduct: number) {
		const [productData] = await this.connection.query("select * from cccat11.product where id_product = $1", [idProduct]);
		return new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight));
	}


async findAllPaginated({ page, limit, filters }: { page:number; limit:number; filters?: any }) {
    const ALLOWED_LIMITS = [10,20,50];
    const itemsPerPage = ALLOWED_LIMITS.includes(limit) ? limit : 10;
    const currentPage = Math.max(1, Math.floor(page));
    const offset = (currentPage - 1) * itemsPerPage;
   
    const countRes = await this.connection.query("select count(*)::int as count from cccat11.product", []);
    const totalItems = Number((Array.isArray(countRes) ? (countRes[0]?.count ?? 0) : (countRes.rows?.[0]?.count ?? 0)) || 0);
    const dataQuery = "select * from cccat11.product order by id_product limit $1 offset $2";
    const dataRes = await this.connection.query(dataQuery, [itemsPerPage, offset]);
    const rows = Array.isArray(dataRes) ? dataRes : (dataRes.rows || []);
    const data: any[] = [];
    for (const productData of rows) {
        data.push({ idProduct: productData.id_product, description: productData.description || productData.descrip, price: Number(productData.price) });
    }
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    return { data, pagination: { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage: currentPage < totalPages, hasPreviousPage: currentPage > 1 } };
}

}
