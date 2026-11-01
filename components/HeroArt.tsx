'use client';
import { useState } from 'react';
export function HeroArt(){const [failed,setFailed]=useState(false);return <img className="hero-art" src={failed?'/assets/night-fallback.svg':'/.netlify/images?url=/img/literary-night.png&w=1100&fm=webp&q=85'} onError={()=>setFailed(true)} alt="كتاب مفتوح وفانوس نحاسي أمام جبال يغمرها ضوء الليل" fetchPriority="high" width="1100" height="850"/>;}
