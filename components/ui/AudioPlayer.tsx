'use client';
import { useState } from 'react';
export function AudioPlayer({src,title}:{src:string;title:string}){const [error,setError]=useState(false);return <div className="audio-panel"><p>{title} · 24 ثانية · نغمات رقمية أصلية</p><audio controls preload="none" src={src} onError={()=>setError(true)} aria-label={title}/>{error&&<p role="alert">تعذّر تحميل الصوت. أعد تحميل الصفحة للمحاولة مجددًا.</p>}</div>;}
