export type Category = {
    _id : string;
    name : string;
    createdAt? : string;
    updatedAt? : string;
};

export type ProductImage = {
    url: string;
    publicId: string;
    isCover: boolean;
}

export type ProductCategory = {
    _id: string;
    name: string;
}

export type ProductStatus = "active" | "inactive";

export type Product = {
    _id: string;
    title: string;
    description: string;
    brand: string;
    price: number;
    salePercentage: number;
    colors: string[];
    sizes: string[];
    stock: number;
    categories: ProductCategory;
    images: ProductImage[];
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}

export type CreateCategoryBody = {
    name : string;
}

export type UpdateCategoryBody = {
    name : string;
}

export type CreateProductBody = {
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    salePercentage: number;
    colors: string[];
    sizes: string[];
    stock: number;
    status: ProductStatus;
}

export type UpdateProductBody = {
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    salePercentage: number;
    colors: string[];
    sizes: string[];
    stock: number;
    status: ProductStatus;
    existingImages: ProductImage[];
    coverImagePublicId?: string; 
}
