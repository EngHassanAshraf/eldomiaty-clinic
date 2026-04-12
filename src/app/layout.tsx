import type { Metadata } from "next";
import "./globals.css";
import SchemaOrg from "@/components/SchemaOrg";
import { LocaleProvider } from "@/lib/LocaleContext";
import LocaleWrapper from "@/components/LocaleWrapper";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "دكتور محمد الدمياطى - اشطر دكتور نساء وتوليد وحقن مجهرى",
  description:
    "عيادة دكتور محمد الدمياطى - استشارى أمراض النساء والتوليد والحقن المجهرى والمناظير بطب القصر العينى جامعة القاهرة. حجز مواعيد في التجمع الخامس، المهندسين، مدينة نصر، مدينتى.",
  keywords:
    "دكتور محمد الدمياطى, حقن مجهرى, ولادة بدون الم, نساء وتوليد, اطفال انابيب, تلقيح صناعى, منظار رحم, التجمع الخامس, المهندسين, مدينة نصر",
  openGraph: {
    title: "دكتور محمد الدمياطى - اشطر دكتور نساء وتوليد",
    description: "استشارى أمراض النساء والتوليد والحقن المجهرى",
    locale: "ar_EG",
    type: "website",
    url: "https://www.eldomiaty-clinic.com",
  },
  other: {
    "facebook-domain-verification": "xa02iv91mjo5zf10kvd45x3vqis2vf",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon-transparence-bg.jpg" type="image/jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <SchemaOrg />
        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','502846864259282');fbq('track','PageView');`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <Toaster position="top-center" />
          <LocaleProvider>
            <LocaleWrapper>
              {children}
            </LocaleWrapper>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
