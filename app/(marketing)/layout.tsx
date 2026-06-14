import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyQuoteCTALoader } from '@/components/layout/StickyQuoteCTALoader';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyQuoteCTALoader />
    </>
  );
}
