import { notFound } from 'next/navigation';
import { books } from '@/lib/books';
import { features } from '@/lib/features';
import { Reader } from '@/components/Reader';
import { VisitorReader } from '@/components/VisitorReader';
import type { Metadata } from 'next';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=[...books,...features].find(b=>b.slug===slug);return {title:item?.title||'قراءة من إبداعات الزوار',description:item?.description||'اكتشف أصواتًا أدبية جديدة في ياسين آرت.'};}
export default async function ReadPage({params}:Props){const {slug}=await params;const book=books.find(b=>b.slug===slug);if(book)return <Reader book={book}/>;const feature=features.find(b=>b.slug===slug);if(feature)return <Reader book={feature} purchasable={false}/>;if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug))return <VisitorReader id={slug}/>;notFound();}
