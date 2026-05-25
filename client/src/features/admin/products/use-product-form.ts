import { useEffect, useState } from "react";
import type { Product, ProductFormState, ProductImage } from "./types";
import { createAdminProduct, updateAdminProduct } from "./api";


type UseProductFormOptions = {
    open : boolean;
    product : Product | null;
    onSaved : () => Promise<void>;
    onClose : () => void;
}


function getEmptyForm() : ProductFormState{
    return {
        title : "",
        description : "",
        category : "",
        brand : "",
        price : "",
        salePercentage : "",
        colors : [],
        sizes : [],
        stock : "",
        status : "active",
        existingImages : [],
        newFiles : [],
        coverImagePublicId : "",
    }
}

export function getCoverImage(images: ProductImage[] = []) {
    return images.find(img=> img.isCover) ?? images[0]
}


function mapProductToFormValues(product : Product) : ProductFormState{
    const cover = getCoverImage(product.images);
    return {
        title: product.title,
        description: product.description,
        category: product.category._id,
        brand: product.brand,
        price: String(product.price),
        salePercentage: String(product.salePercentage ?? 0),
        colors: product.colors ?? [],
        sizes: product.sizes ?? [],
        stock: String(product.stock),
        status: product.status,
        existingImages: product.images ?? [],
        newFiles: [],
        coverImagePublicId: cover?.publicId ?? "",
    }

}

export function useProductForm({
    open,
    product,
    onSaved,
    onClose
} : UseProductFormOptions){
    const [form, setForm] = useState<ProductFormState>(getEmptyForm());
    const [saving, setSaving] = useState(false);

    useEffect(()=>{
        if(product) {
            setForm(mapProductToFormValues(product))
        } else {
            setForm(getEmptyForm())
        }
    }, [open, product])

    function toggleSize(size : string){
            setForm(prev=>({
                ...prev,
                sizes: prev.sizes.includes(size) ? prev.sizes.filter(s=> s !== size) : [...prev.sizes, size]
            }))
    }

    function addColor(color : string){
        setForm(prev=>({
            ...prev,
            colors: prev.colors.includes(color) ? prev.colors : [...prev.colors, color]
        }))
    }

    function removeColor(color : string){
        setForm(prev=>({
            ...prev,
            colors: prev.colors.filter(c=> c !== color)
        }))
    }

    function updateField<K extends keyof ProductFormState>(
        key : K,
        value : ProductFormState[K]
    ){
        setForm(prev=>({
            ...prev,
            [key] : value
        }))
    }

    function addFiles(files : File[]){
        setForm(prev=>({
            ...prev,
            newFiles : [...prev.newFiles, ...files]
        }))
    }

    function removeExistingImage(publicId: string){
        setForm(prev=>{
            const nextImages = prev.existingImages.filter(
                image=> image.publicId !== publicId
            );
            const nextCoverImageId = prev.coverImagePublicId === publicId ?
            (nextImages[0]?.publicId ?? ""): prev.coverImagePublicId;
            return {
                ...prev,
                existingImages: nextImages,
                coverImagePublicId: nextCoverImageId
            }
        })
    }

    function changeCoverImage(publicId: string){
        updateField("coverImagePublicId", publicId);
    }

    async function submit(){
        if(!form.title.trim() || !form.description.trim() || !form.brand.trim() || !form.category.trim() || !form.price.trim() || !form.stock.trim()) return;

        try{
            setSaving(true);

            if(product){
                await updateAdminProduct(product._id,{
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category,
                    brand: form.brand,
                    price: Number(form.price),
                    salePercentage: Number(form.salePercentage),
                    colors: form.colors,
                    sizes: form.sizes,
                    stock: Number(form.stock),
                    status: form.status,
                    existingImages: form.existingImages,
                    coverImagePublicId: form.coverImagePublicId,
                },form.newFiles)
            }else{
                await createAdminProduct({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category,
                    brand: form.brand,
                    price: Number(form.price),
                    salePercentage: Number(form.salePercentage),
                    colors: form.colors,
                    sizes: form.sizes,
                    stock: Number(form.stock),
                    status: form.status,
                },
                form.newFiles,
            );
            }

            await onSaved();
            onClose();
        }finally{
            setSaving(false);
        }
    }

    return {
        form,
        saving,
        isEditMode : !!product,
        toggleSize,
        addColor,
        removeColor,
        addFiles,
        updateField,
        submit,
        removeExistingImage,
        changeCoverImage,
    }
}