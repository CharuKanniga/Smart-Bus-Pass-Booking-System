import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './styles.css';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </I18nextProvider>
    </ThemeProvider>
  );
}
