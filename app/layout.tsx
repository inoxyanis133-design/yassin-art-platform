import type { Metadata } from 'next';
import './globals.css';
import { PlatformProvider } from '@/components/PlatformProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HelpBot } from '@/components/HelpBot';
const siteName='ياسين آرت | Yassin Art';
const siteDescription='حيث يسكن الحرف ضوء الليل. مكتبة عربية للقراءة المجانية والشعر والقصص والفن والموسيقى، ومساحة لنشر إبداعك ودعم الأدب.';
export const metadata:Metadata={metadataBase:new URL('https://yassin-art-platform.netlify.app'),title:{default:siteName,template:'%s | ياسين آرت'},description:siteDescription,openGraph:{title:siteName,siteName,description:siteDescription,locale:'ar_MA',type:'website'},twitter:{card:'summary',title:siteName,description:siteDescription}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body><PlatformProvider><a href="#main" className="skip-link">انتقل إلى المحتوى</a><Header/>{children}<Footer/><HelpBot/></PlatformProvider></body></html>;}
