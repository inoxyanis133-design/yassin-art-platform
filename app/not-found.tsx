import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound(){return <main id="main" className="not-found"><span>٤٠٤</span><h1>لعلّ الصفحة سقطت بين السطور.</h1><p>لم نجد هذه الحكاية، لكنّ في المكتبة حكايات أخرى تنتظرك.</p><Link className="button button-primary" href="/library">عُد إلى المكتبة <ArrowLeft size={17}/></Link></main>;}
