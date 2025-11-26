import CsvPresenter from "../presenter/CsvPresenter";
import HttpServer from "./HttpServer";
import JsonPresenter from "../presenter/JsonPresenter";
import UsecaseFactory from "../factory/UsecaseFactory";


export default class HttpController {

	constructor (httpServer: HttpServer, usecaseFactory: UsecaseFactory) {

		httpServer.on("get", "/products", async function (params: any, body: any, headers: any) {
    const contentType = headers["content-type"] || "application/json";
    const getProducts = usecaseFactory.createGetProducts(contentType);
    
    const rawPage = params.page !== undefined ? Number(params.page) : 1;
    const rawLimit = params.limit !== undefined ? Number(params.limit) : 10;
    if (!Number.isInteger(rawPage) || rawPage < 1) {
        return { statusCode: 400, body: { error: 'page must be an integer >= 1' } };
    }
    if (![10,20,50].includes(rawLimit)) {
        return { statusCode: 400, body: { error: 'limit must be one of 10,20,50' } };
    }
    const output = await getProducts.execute({ page: rawPage, limit: rawLimit });
    return output;
});

		httpServer.on("get", "/products/:idProduct", async function (params: any, body: any, headers: any) {
			const getProduct = usecaseFactory.createGetProduct();
			const output = await getProduct.execute(params.idProduct);
			return output;
		});
	}
}
