import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import type { Book } from '@/lib/books';
import { BookCover } from './BookCover';
export function BookCard({book}:{book:Book}){return <article className="book-card"><Link href={`/read/${book.slug}`} className="cover-link" aria-label={`قراءة ${book.title}`}><BookCover book={book}/><span className="cover-hover">اقرأ مجانًا <ArrowUpLeft size={18}/></span></Link><div className="book-meta"><span>{book.category} · إصدار قصير</span><span>قراءة مجانية</span></div><Link href={`/read/${book.slug}`}><h3>{book.title}</h3></Link><div className="book-card-bottom"><span>إصدارات ياسين آرت</span><span className="book-price">30 <small>د.م.</small></span></div></article>;}
