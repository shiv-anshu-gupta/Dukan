import { useCallback, useEffect, useState } from "react";
import type { Product, Category } from "./types";
import { getAdminCategories, getAdminProducts } from "./api";

export function useAdminProducts() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const loadCategories = useCallback(async () => {
        const data = await getAdminCategories();
        setCategories(data ?? []);
    }, []);

    const loadProducts = useCallback(async (searchValue: string) => {

        setLoading(true);

        try{
            const data = await getAdminProducts(searchValue);
            setProducts(data ?? []);
        }catch{
            console.log('fetching failed');
            
        }finally{
            setLoading(false);
        }

    }, []);

    function openCreateDialog(){
        setEditingProduct(null);
        setProductDialogOpen(true);
    }

    function openEditDialog(product: Product){
        setEditingProduct(product);
        setProductDialogOpen(true);
    }

    function closeProductDialog(){
        setProductDialogOpen(false);
        setEditingProduct(null);
    }

    const refreshAll = useCallback(async() => {
        await Promise.all([loadCategories(), loadProducts(search)]);
    }, [loadCategories, loadProducts, search]);

    useEffect(() => {
        void loadCategories()
    }, [loadCategories]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void loadProducts(search);
        },250);
        return () => clearTimeout(timer);
    }, [search, loadProducts]);

    return{
        search,
        setSearch,
        products,
        setProducts,
        categories,
        loading,
        categoryDialogOpen,
        setCategoryDialogOpen,
        productDialogOpen,
        setProductDialogOpen,
        editingProduct,
        setEditingProduct,
        openCreateDialog,
        closeProductDialog,
        refreshAll,
        openEditDialog,
    }
}