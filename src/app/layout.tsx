import Navbar from '@/components/shared/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* নেভবার এখানে থাকতে হবে যাতে সব পেজে স্টিকিভাবে দেখায় */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}