'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Feather, Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { usePlatform } from './PlatformProvider';
export function Header(){
 const path=usePathname(),router=useRouter();const taps=useRef(0);const lastTap=useRef(0);const [open,setOpen]=useState(false);const [light,setLight]=useState(false);const {user}=usePlatform();
 function tap(){const now=Date.now();if(now-lastTap.current>4000)taps.current=0;lastTap.current=now;taps.current++;if(taps.current>=10){taps.current=0;router.push(user?.admin?'/admin':'/account?admin=1');}}
 const links=[['/','الرئيسية'],['/library','المكتبة'],['/publish','فضاء الزوار'],['/about','عن المنصة']];
 return <><header className="site-header"><div className="header-inner"><div className="brand"><button className="brand-mark" onClick={tap} aria-label="ياسين آرت"><Feather size={27}/></button><div><button className="brand-name" onClick={tap}>ياسين آرت<span className="brand-dot">.</span></button><span className="brand-caption">YASSIN ART · أدبٌ وأكثر</span></div></div><nav className="desktop-nav" aria-label="القائمة الرئيسية">{links.map(([href,label])=><Link key={href} className={path===href?'active':''} href={href}>{label}</Link>)}</nav><div className="header-actions"><Link className="icon-button search-button" href="/library?search=1" aria-label="البحث في المكتبة"><Search size={19}/></Link><button className="icon-button theme-button" aria-label={light?'تفعيل الوضع الليلي':'تفعيل الوضع النهاري'} onClick={()=>{document.documentElement.dataset.theme=light?'dark':'light';setLight(!light);}}>{light?<Sun size={19}/>:<Moon size={19}/>}</button><button className="icon-button mobile-toggle" onClick={()=>setOpen(!open)} aria-label={open?'إغلاق القائمة':'فتح القائمة'} aria-expanded={open}>{open?<X/>:<Menu/>}</button></div></div>{open&&<nav className="mobile-nav">{links.map(([href,label])=><Link href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}</header></>;
}
