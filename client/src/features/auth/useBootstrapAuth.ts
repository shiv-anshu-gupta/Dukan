import { useAuth } from "@clerk/react";
import { useAuthStore } from "./store";
import { useEffect } from "react";
import { syncUser, getMe } from "./api";
import { setApiTokenGetter } from "@/lib/api";

export function useBootstrapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { setLoading, setUser, clearAuth, setError } = useAuthStore();

  useEffect(()=>{
    setApiTokenGetter(async()=>{
        const token = await getToken();
        return token ?? null;
    })
  }, [getToken]);
  
  useEffect(() => {
    async function run (){
        if(!isLoaded) return;

        if(!isSignedIn){
            clearAuth();
            return;
        }
        try{
            setLoading();

            await syncUser()
            const me = await getMe();
            setUser(me?.user);   
        }catch(error){
            const errMessage = error instanceof Error ? error.message : "Failed to sync user";
            setError(errMessage);
        }
    }
    void run()
  },[isLoaded, isSignedIn, getToken, setLoading, setUser, clearAuth, setError])
}
