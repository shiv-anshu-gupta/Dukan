import {Router, type Request, type Response} from 'express';
import { getDbUserFromReq, requireAdmin } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { Category } from '../../models/Category';
import { requireFound, requireNumber, requireText } from '../../utils/helpers';
import { ok } from '../../utils/envelope';
import { Product } from '../../models/Products';
import multer from 'multer';
import { uploadManyBuffersToCloudinary } from '../../utils/cloudinary';
import { AppError } from '../../utils/AppError';

type UploadedImage = {
    url : string;
    publicId : string;
    isCover : boolean;
}

export const adminProductRouter = Router();
const upload = multer({
    storage : multer.memoryStorage(),
    limits : {
        fieldSize : 5*1024*1024, 
        files : 10,
    }
})
adminProductRouter.use(requireAdmin);

//categories

adminProductRouter.get('/categories', asyncHandler(async (req: Request, res: Response)=> {
    const categories = await Category.find({}).sort({name : 1});

    res.json(ok(categories));
}))


adminProductRouter.post('/categories', asyncHandler(async (req: Request, res: Response)=> {
    const name = String(req.body.name || "").trim();

    requireText(name, "Category name is required");

    const category = await Category.create({name});

    res.status(201).json(ok(category));
}));

adminProductRouter.put('/categories/:id', asyncHandler(async (req: Request, res: Response)=> {
    const name = String(req.body.name || "").trim();
    const extractCategoryId = req.params.id as string;
    

    requireText(name, "Category name is required");
    const existingCategory = await Category.findById(extractCategoryId);
    const category = await requireFound(existingCategory, "Category not found");

    category.name = name;

    await category.save();
    res.json(ok(category));
}));


adminProductRouter.get('/products', asyncHandler(async(req: Request, res: Response)=> {
    const search = String(req.query.search || "").trim();

    const query : Record<string, unknown> = {};

    if(search){
        query.title = {$regex: search, $options : "i"}
    }

    const products = await Product.find(query).populate('category', 'name').sort({createdAt : -1});

    res.json(ok(products));
}))

adminProductRouter.get('/products/:id', asyncHandler(async(req: Request, res: Response)=> {
    const productId = req.params.id as string

    const product = await Product.findById(productId).populate("category", "name");
    
    requireText(product, "Product not found", 404);
    res.json(ok(product));
}))

adminProductRouter.get('/products', asyncHandler(async(req: Request, res: Response)=> {
    const search = String(req.query.search || "").trim();

    const query : Record<string, unknown> = {};

    if(search){
        query.title = {$regex: search, $options : "i"}
    }

    const products = await Product.find(query).populate('category', 'name').sort({createdAt : -1});
    
    res.json(ok(products));
}))

adminProductRouter.post('/products', upload.array('images', 10), asyncHandler(async(req: Request, res: Response)=> {
    
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const brand = String(req.body.brand || "").trim();
    const stock = Number(req.body.stock);
    const price = Number(req.body.price);
    const salePercentage = Number((req.body.salePrice) || 0);
    const status = String(req.body.status || "active").trim();
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];

    requireText(title, "Product title is required");
    requireText(description, "Product description is required");
    requireText(category, "Product category is required");
    requireText(brand, "Product brand is required");
    requireNumber(stock, "Product stock is required");
    requireNumber(price, "Product price is required");
    requireNumber(salePercentage, "Product sale percentage is required");

    const existingCategory = await Category.findById(category);
    requireFound(existingCategory, "Category not found");

    const files = (req.files as Express.Multer.File[]) || [];

    if(!files.length){
        throw new Error("At least one product image is required");
    }

    const uploadImages = await uploadManyBuffersToCloudinary(
        files.map(file=> file.buffer)
    )

    const images = uploadImages.map((img, index)=>({
        url : img.url,
        publicId : img.publicId,
        isCover : index === 0
    }))

    const user = await getDbUserFromReq(req);
    const product = await Product.create({
        title, description, category, brand, stock, price, salePercentage, status, colors, sizes, images,
        createdBy : user._id                      
     });

    const createdProduct = await Product.findById(product._id).populate('category', 'name');

    res.status(201).json(ok(createdProduct));
    
}))

adminProductRouter.put('/products/:id', upload.array('images', 10), asyncHandler(async(req: Request, res: Response)=> {
    const productId = req.params.id as string;
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const brand = String(req.body.brand || "").trim();
    const stock = Number(req.body.stock);
    const price = Number(req.body.price);
    const salePercentage = Number((req.body.salePrice) || 0);
    const status = String(req.body.status || "active").trim() as 'active' | 'inactive';
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];
    const coverImagePublicId = String(req.body.coverImagePublicId || "").trim();

    requireText(title, "Product title is required");
    requireText(description, "Product description is required");
    requireText(category, "Product category is required");
    requireText(brand, "Product brand is required");
    requireNumber(stock, "Product stock is required");
    requireNumber(price, "Product price is required");
    requireNumber(salePercentage, "Product sale percentage is required");

    const existingCategoryDoc = await Category.findById(category);
    const existingCategory = requireFound(existingCategoryDoc, "Category not found");

    const productDoc = await Product.findById(productId);
    const product = requireFound(productDoc, "Product not found");

    const files = (req.files as Express.Multer.File[]) || [];

    const uploadNewImages = await uploadManyBuffersToCloudinary(
        files.map(file=> file.buffer),
    );

    const newlyAddedImages = uploadNewImages.map(image=>({
        url : image.url,
        publicId : image.publicId,
        isCover : false
     }));

     let existingImages : UploadedImage[] = product.images.map(
        (image, index) => ({
            url : image.url,
            publicId: image.publicId,
            isCover : image.isCover,
        })
     )

     const mergedImages : UploadedImage[] = [...existingImages, ...newlyAddedImages];

     if(!mergedImages.length){
        throw new AppError(400, "At least one product image is required");
     }

     const finalImages : UploadedImage[] = 
     mergedImages.map((image : UploadedImage, index) => ({
        url : image.url,
        publicId : image.publicId,
        isCover : coverImagePublicId ? image.publicId === coverImagePublicId : index === 0
     }));

     product.title = title;
     product.description = description;
     product.category = existingCategory._id;
     product.brand = brand;
     product.stock = stock;
     product.price = price;
     product.salePercentage = salePercentage;
     product.status = status;
     product.colors = colors;
     product.sizes = sizes;
     product.set('images', finalImages);
    
     await product.save();

     const updateProduct = await Product.findById(product._id).populate("category", "name");

     res.json(ok(updateProduct));
}))
