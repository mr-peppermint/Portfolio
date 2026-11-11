export const metadata = {
  title: 'Portfolio',
  description: 'Certificates, GitHub projects and Codeforces profile.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
