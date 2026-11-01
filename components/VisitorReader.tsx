'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, type Submission } from '@/lib/api';
import type { Category } from '@/lib/books';
import { Reader } from './Reader';
export function VisitorReader({id}:{id:string}){const [item,setItem]=useState<Submission|null>(null);const [error,setError]=useState('');const [loading,setLoading]=useState(true);async function load(){setLoading(true);setError('');try{setItem(await api<Submission>(`content?id=${encodeURIComponent(id)}`));}catch(e){setError((e as Error).message);}finally{setLoading(false);}}useEffect(()=>{void load();},[id]);if(loading)return <main id="main" className="inner-main page-width"><div className="skeleton" aria-label="جارٍ تحميل النص"/></main>;if(error||!item)return <main id="main" className="inner-main page-width"><div className="empty-state"><h1>تعذّر فتح هذا النص.</h1><p>{error}</p><button onClick={load} className="button button-outline">إعادة المحاولة</button> <Link href="/library" className="button button-quiet">العودة للمكتبة</Link></div></main>;return <Reader visitor author={item.author} purchasable={item.kind==='book'} book={{slug:item.id,title:item.title,category:item.category as Category,description:`بقلم ${item.author} · من إبداعات زوار ياسين آرت`,subtitle:'من إبداعات الزوار',color:'#5d6b65',motif:'leaf',chapters:[{title:item.title,text:item.content}]}}/>;}
