import Product from "../../domain/entity/Product";

export default interface ProductRepository {
	list (): Promise<Product[]>;
	get (idProduct: number): Promise<Product>;
	findAllPaginated(opts: { page:number; limit:number; filters?: any }): Promise<{ data: Product[]; pagination: any }>;
}
