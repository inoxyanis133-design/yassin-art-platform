import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { and, desc, eq, or } from 'drizzle-orm';
import { database } from '../../db/index';
import { submissions, orders } from '../../db/schema';
import { books, categories } from '../../lib/books';
import type { Config } from '@netlify/functions';

const fail = (message: string, status = 400) => Response.json({ error: message }, { status, headers:{'Cache-Control':'no-store'} });
const ok = (data: unknown) => Response.json(data, { headers:{'Cache-Control':'no-store'} });
const ownerEmail = 'yassinmalloukqhse@gmail.com';
const isAdmin = (user: Awaited<ReturnType<typeof getUser>>) => !!user?.confirmedAt && user.email?.toLowerCase() === ownerEmail && user.roles?.includes('admin');
const validUuid = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export default async (req: Request) => {
 try {
  const url = new URL(req.url); const action = url.pathname.split('/').pop();
  if (!['GET','POST','PATCH'].includes(req.method)) return fail('طريقة الطلب غير متاحة.',405);
  if(req.method !== 'GET') {
   verifyRequestOrigin(req);
   if(Number(req.headers.get('content-length') || 0) > 400000) return fail('النص أكبر من الحد المسموح.',413);
  }
  const user = await getUser();
  if(action === 'session' && req.method === 'GET') return ok({user:user ? {id:user.id,email:user.email,name:user.name,confirmed:!!user.confirmedAt,admin:!!isAdmin(user)} : null});
  const db = database();
  if(action === 'content' && req.method === 'GET') {
   const id = url.searchParams.get('id');
   if(id) {
    if(!validUuid(id)) return fail('العمل غير موجود.',404);
    const [item] = await db.select().from(submissions).where(eq(submissions.id,id));
    if(!item || (item.status !== 'approved' && item.userId !== user?.id && !isAdmin(user))) return fail('العمل غير موجود.',404);
    return ok(item);
   }
   return ok(await db.select({id:submissions.id,title:submissions.title,author:submissions.author,category:submissions.category,kind:submissions.kind,content:submissions.content,createdAt:submissions.createdAt}).from(submissions).where(eq(submissions.status,'approved')).orderBy(desc(submissions.createdAt)).limit(150));
  }
  if(!user?.confirmedAt) return fail('سجّل الدخول بحساب مؤكّد البريد للمتابعة.',401);
  if(action === 'mine' && req.method === 'GET') {
   const ownOrders=await db.select().from(orders).where(or(eq(orders.userId,user.id),eq(orders.sellerId,user.id))).orderBy(desc(orders.createdAt));
   return ok({submissions:await db.select().from(submissions).where(eq(submissions.userId,user.id)).orderBy(desc(submissions.createdAt)),orders:ownOrders.map(o=>o.userId===user.id?o:{...o,buyerEmail:'',paymentReference:null,userId:''})});
  }
  if(action === 'content' && req.method === 'POST') {
   const body = await req.json();
   const title = String(body.title??'').trim(); const author = String(body.author??'').trim(); const content = String(body.content??'').trim();
   if(title.length<3 || title.length>140 || author.length<2 || author.length>80 || content.length<100 || content.length>80000 || !categories.includes(body.category) || !['text','book'].includes(body.kind) || body.rights !== true) return fail('راجع الحقول: العنوان 3–140 حرفًا، الاسم 2–80، والنص 100–80000 حرف، مع الإقرار بحقوق النشر.');
   const recent = await db.select({id:submissions.id}).from(submissions).where(and(eq(submissions.userId,user.id),eq(submissions.status,'pending'))).limit(11);
   if(recent.length>=10) return fail('لديك عشرة أعمال قيد المراجعة. انتظر مراجعتها قبل إرسال المزيد.',429);
   const [item] = await db.insert(submissions).values({userId:user.id,title,author,content,category:body.category,kind:body.kind,status:'pending'}).returning();
   return ok(item);
  }
  if(action === 'orders' && req.method === 'POST') {
   const body = await req.json();
   const book = books.find(b=>b.slug === body.bookId);
   let title = book?.title; let sellerId: string|null = null;
   if(!book && validUuid(body.bookId)) {
    const [item] = await db.select().from(submissions).where(and(eq(submissions.id,body.bookId),eq(submissions.status,'approved'),eq(submissions.kind,'book')));
    if(item) {title=item.title;sellerId=item.userId;}
   }
   if(!title) return fail('هذا الكتاب غير متاح للاقتناء.',404);
   const [existing] = await db.select().from(orders).where(and(eq(orders.userId,user.id),eq(orders.bookId,body.bookId))).orderBy(desc(orders.createdAt)).limit(1);
   if(existing && existing.status !== 'rejected') return ok(existing);
   const [order] = await db.insert(orders).values({userId:user.id,buyerEmail:user.email!,bookId:body.bookId,bookTitle:title,sellerId,amountMad:30,feeUsd:sellerId?1:0}).returning();
   return ok(order);
  }
  if(action === 'orders' && req.method === 'PATCH') {
   const body=await req.json();
   if(!validUuid(body.id) || typeof body.reference !== 'string' || body.reference.trim().length<5 || body.reference.length>120) return fail('أدخل معرّف معاملة PayPal الصحيح (5–120 حرفًا).');
   const [order]=await db.update(orders).set({paymentReference:body.reference.trim().toUpperCase(),status:'submitted'}).where(and(eq(orders.id,body.id),eq(orders.userId,user.id),eq(orders.status,'pending'))).returning();
   if(!order) return fail('الطلب غير متاح للتعديل.',409);
   return ok(order);
  }
  if(action === 'admin') {
   if(!isAdmin(user)) return fail('هذه المساحة متاحة لمدير المنصة المصرّح له فقط.',403);
   if(req.method === 'GET') return ok({submissions:await db.select().from(submissions).orderBy(desc(submissions.createdAt)),orders:await db.select().from(orders).orderBy(desc(orders.createdAt))});
   if(req.method === 'PATCH') {
    const body=await req.json(); if(!validUuid(body.id)) return fail('معرّف غير صحيح.');
    if(body.type === 'submission' && ['approved','rejected','pending'].includes(body.status)) {
     const [item]=await db.update(submissions).set({status:body.status}).where(eq(submissions.id,body.id)).returning(); return item ? ok(item) : fail('العمل غير موجود.',404);
    }
    if(body.type === 'order' && ['confirmed','rejected'].includes(body.status)) {
     const [order]=await db.update(orders).set({status:body.status,confirmedAt:body.status==='confirmed'?new Date():null,payoutStatus:body.status==='confirmed'?'manual_review':'not_due'}).where(and(eq(orders.id,body.id),eq(orders.status,'submitted'))).returning(); return order ? ok(order) : fail('الطلب غير موجود أو تمت مراجعته بالفعل.',409);
    }
    if(body.type === 'payout') {
     const [order]=await db.update(orders).set({payoutStatus:'settled'}).where(and(eq(orders.id,body.id),eq(orders.status,'confirmed'))).returning(); return order ? ok(order) : fail('طلب غير مؤكد.',409);
    }
    return fail('تعديل غير متاح.');
   }
  }
  return fail('المسار غير موجود.',404);
 } catch {
  return fail('تعذّر تنفيذ الطلب الآن. أعد المحاولة بعد قليل.',503);
 }
};
export const config: Config = {path:'/api/platform/:action'};
