// src/app/layout.js
import './globals.css';
import ProviderWrapper from '../app/ProviderWrapper';

export const metadata = {
  title: 'Product Management App',
  description: 'Manage products with ease',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}
