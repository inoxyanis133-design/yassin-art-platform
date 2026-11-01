import { Suspense } from 'react';
import type { Metadata } from 'next';
import LibraryBrowser from './LibraryBrowser';
export const metadata:Metadata={title:'المكتبة المفتوحة',description:'تصفّح الشعر والقصص والفن والموسيقى والصور في ياسين آرت. قراءة مجانية وإصدارات رقمية قصيرة.'};
export default function Library(){return <main id="main" className="inner-main page-width"><div className="page-intro"><span className="eyebrow">لكلّ مزاجٍ صفحة</span><h1>المكتبة المفتوحة<span className="muted">.</span></h1><p>اختر ما يرافق ليلتك. قصيدة، حكاية، أو فسحة من الفن.<br/>القراءة للجميع، والاقتناء اختياري لدعم هذه المساحة.</p></div><Suspense fallback={<div className="skeleton"/>}><LibraryBrowser/></Suspense></main>;}
