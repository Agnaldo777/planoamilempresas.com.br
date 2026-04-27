import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyQuoteCTA } from '@/components/layout/StickyQuoteCTA';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyQuoteCTA />
    </>
  );
}
