export const metadata = {
  title: 'Amil Empresarial — Studio CMS',
  description: 'Content Management Studio',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
