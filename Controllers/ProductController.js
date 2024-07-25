import ProductModel from "../Models/ProductModel.js";
import { responseReturn } from "../utils/response.js";

class ProductController {
    
    /**
     * Add Product
     *
     * Adds a new product to the database. Handles form data processing, image uploading to Cloudinary, and product creation.
     */
    addProduct = async(req, res) => {
        const { name, price, quantity } = req.body;
        // const pictures = req.files.map(file => file.path);
        const pictures = req.files ? req.files.map(file => file.path) : [];

        try {
            const product = new ProductModel({ name, price, quantity, pictures, user: req.user.id });
            await product.save();
            responseReturn(res, 201, { product, message: 'Product Added Successfully' });
          } catch (err) {
            responseReturn(res, 500, { error: 'Internal Server Error' });
          }
    }

    /**
     * Get Products - Retrieves all products from the database.
     */
    getProducts = async(req, res) => {
        try {
            const products = await ProductModel.find({});
            responseReturn(res, 200, { products, message: 'Products retrieved successfully' });
        } catch (error) {
            console.error('Error retrieving products:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    }

    /**
     * Get Product - Retrieves a specific product from the database based on the provided productId.
     */
    getProduct = async(req, res) => {
        const { productId } = req.params;
        try {
            const product = await ProductModel.findById(productId);
            if (product) {
                responseReturn(res, 201, { product, message: 'Product retrieved successfully' });
            } else {
                responseReturn(res, 404, { message: 'Product not found' });
            }
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    }

    /**
     * Update Product - Updates a specific product in the database based on the provided productId.
     */
    updateProduct = async(req, res) => {
        let { name, description, discount, price, brand, productId, stock } = req.body;
        name = name.trim();
        const slug = name.split(" ").join("-");

        try {
            await ProductModel.findByIdAndUpdate(productId, {
                name, description, slug, discount, price, brand, stock 
            });
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product, message: "Product Update Success" });
            
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }
    
    /**
     * Get Products with Pagination - Retrieves products with pagination, allowing for better handling of large datasets.
     */
    getProductsPagination = async(req, res) => {
        const { page, searchValue, perPage } = req.query;
        const { id } = req.user;
        const skipPage = parseInt(perPage) * (parseInt(page) - 1);

        try { 
            if (searchValue) {
                const products = await ProductModel.find({
                    $text: { $search: searchValue }}).skip({ skipPage }).sort({ createdAt: -1 });

                const totalProducts = await ProductModel.find({}).countDocuments();

                responseReturn(res, 200, { totalProducts, products });

            } else {
                const products = await categoryModel.find({}).skip(skipPage).limit(perPage).sort({ createdAt: -1 });
                const totalProducts = await ProductModel.find({}).countDocuments();
                responseReturn(res, 200, { totalProducts, products }); 
            }
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    }
}

export default new ProductController();