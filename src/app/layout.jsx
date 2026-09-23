import '../styles/globals.css';

export const metadata = {
  title: 'AeroAqua v2 Telemetry Dashboard',
  description: 'Adaptive IoT Telemetry & Aquaculture Management Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-darkbg text-gray-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}