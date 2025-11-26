import Presenter from "../../infra/presenter/Presenter";
import ProductRepository from "../repository/ProductRepository";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class GetProducts {
    productRepository: ProductRepository;

    constructor (repositoryFactory: RepositoryFactory, readonly presenter: Presenter) {
        this.productRepository = repositoryFactory.createProductRepository();
    }

    async execute (opts?: { page?: number; limit?: number }): Promise<any> {
        const page = opts?.page ?? 1;
        const limit = opts?.limit ?? 10;
        const { data, pagination } = await this.productRepository.findAllPaginated({ page, limit });
        const output: Output[] = [];
        for (const product of data) {
            output.push({
                idProduct: product.idProduct,
                description: product.description,
                price: product.price
            });
        }
        return this.presenter.present({ data: output, pagination });
    }
}

type Output = {
    idProduct: number,
    description: string,
    price: number
}
