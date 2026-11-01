'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getUser, onAuthChange, handleAuthCallback } from '@netlify/identity';
import { api, type SessionUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
const Context=createContext<{user:SessionUser|null;ready:boolean;refresh:()=>Promise<void>;inviteToken:string;recovery:boolean;clearCallback:()=>void}>({user:null,ready:false,refresh:async()=>{},inviteToken:'',recovery:false,clearCallback:()=>{}});
export function PlatformProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<SessionUser|null>(null); const [ready,setReady]=useState(false);const [inviteToken,setInvite]=useState('');const [recovery,setRecovery]=useState(false);const router=useRouter();
 const refresh=useCallback(async()=>{await getUser();try{const data=await api<{user:SessionUser|null}>('session');setUser(data.user);}catch{setUser(null);}setReady(true);},[]);
 useEffect(()=>{let active=true;(async()=>{try{const result=await handleAuthCallback();if(active&&result){if(result.type==='invite')setInvite(result.token||'');if(result.type==='recovery')setRecovery(true);router.push('/account');}}catch{router.push('/account?callback=error');}await refresh();})();const unsub=onAuthChange(()=>{void refresh();});return()=>{active=false;unsub();};},[refresh,router]);
 return <Context.Provider value={{user,ready,refresh,inviteToken,recovery,clearCallback:()=>{setInvite('');setRecovery(false);}}}>{children}</Context.Provider>;
}
export function usePlatform(){return useContext(Context);}
