export async function api<T = any>(path: string, options?: RequestInit): Promise<T> {
 const res=await fetch(`/api/platform/${path}`,{...options,headers:{'Content-Type':'application/json',...options?.headers},cache:'no-store'});
 let data;try {data=await res.json();}catch{throw new Error('تعذّر الاتصال بالمنصة. حاول مجددًا.');}
 if(!res.ok) throw new Error(data.error || 'تعذّر إكمال الطلب.'); return data;
}
export type Submission = {id:string;userId:string;title:string;author:string;category:string;content:string;kind:string;status:string;createdAt:string};
export type Order = {id:string;userId:string;bookTitle:string;bookId:string;sellerId:string|null;amountMad:number;feeUsd:number;status:string;paymentReference:string|null;payoutStatus:string;buyerEmail:string;createdAt:string};
export type SessionUser = {id:string;email:string;name?:string;admin:boolean;confirmed:boolean};
export const statusLabels: Record<string,string>={pending:'قيد الانتظار',submitted:'بانتظار التحقق من الدفع',confirmed:'تم تأكيد الدفع',approved:'منشور',rejected:'غير مقبول',manual_review:'بانتظار التسوية اليدوية',settled:'تمت التسوية',not_due:'غير مستحق'};
