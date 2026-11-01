'use client';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <main id="main" className="error-boundary"><h2>تعثّرت الصفحة للحظة.</h2><p>النصوص لا تزال هنا. أعد المحاولة لنفتح النافذة مجددًا.</p><button className="button button-primary" onClick={reset}>إعادة المحاولة</button></main>;}
