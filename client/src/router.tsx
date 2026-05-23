import { createBrowserRouter } from "react-router-dom";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout";
import { SignInPage } from "./pages/auth/Sign-in";
import { StoreHome } from "./pages/customer/Home";
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { SignUpPage } from "./pages/auth/Sign-up";
import { ProtectedLayout } from "./components/auth/ProtectedLayout";
import { CustomerProfile } from "./pages/customer/Profile";
import { RoleGaurdLayout } from "./components/auth/RoleGaurdLayout";
import AdminProducts from "./pages/admin/Products";
import AdminSettings from "./pages/admin/Settings";
import AdminOrders from "./pages/admin/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCoupons from "./pages/admin/Coupons";
import { AdminLayout } from "./components/layout/AdminLayout";




export const router = createBrowserRouter([
    {
        path : "/",
        element : <CustomerLayout/>,
        children : [
            {
                index : true,
                element : <StoreHome/>
            },
            {
                element : <PublicOnlyLayout/>,
                children :[
                    {
                        path : "sign-in/*",
                        element : <SignInPage/>
                    },
                    {
                        path : "sign-up/*",
                        element : <SignUpPage/>
                    },
                    
                ]
            },
            {
                element : <ProtectedLayout/>,
                children : [
                    {
                        path : 'profile',
                        element: <CustomerProfile/>
                    }
                ]
            }
        ]
    },
    {
        element : <ProtectedLayout/>,
        children : [{
            element : <RoleGaurdLayout allow={["admin"]}/>,
            children : [{
                path : 'admin',
                element : <AdminLayout/>,

                children : [
                    {
                        index : true,
                        element : <AdminDashboard/>
                    },
                    {
                        path : 'orders',
                        element : <AdminOrders/>
                    },
                    {
                        path : 'settings',
                        element : <AdminSettings/>
                    },
                    {
                        path : 'products',
                        element : <AdminProducts/>
                    },
                    {
                        path : 'coupons',
                        element : <AdminCoupons/>
                    },
                    
                ]
            }]
        }]
    }
])