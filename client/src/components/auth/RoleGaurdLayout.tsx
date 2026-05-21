import type {UserRole} from "@/lib/types";
import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet } from "react-router";
type RoleGuardLayoutProps = {
    allow : UserRole[];
}

export function RoleGaurdLayout({allow}: RoleGuardLayoutProps){
    const {isBootstrapped, status, user} = useAuthStore()

    if(!isBootstrapped || status === "loading") return null;

    if(!user){
        return <Navigate to="/sign-in" replace/>;
    }

    if(!allow.includes(user.role)){
        return <Navigate to="/" replace/>;
    }
    return <Outlet/>
}