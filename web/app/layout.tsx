import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Provider } from './provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Health Master',
  description: 'A Next.js application for health management'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
        <Toaster
          className="toaster group"
          gap={12}
          toastOptions={{
            classNames: {
              toast:
                'cn-toast gap-3! rounded-2xl! border-stone-200/80! bg-[#FAF8F5]/95! p-5! font-sans! text-sm! text-stone-800! shadow-[0_12px_40px_-12px_rgba(120,113,108,0.22)]! backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[#3F6254]/40 group-data-[sonner-theme=dark]:border-stone-700/80! group-data-[sonner-theme=dark]:bg-stone-900/95! group-data-[sonner-theme=dark]:text-stone-100!',
              title: 'font-medium! leading-relaxed!',
              description:
                'text-sm! leading-relaxed! text-stone-600! opacity-100! group-data-[sonner-theme=dark]:text-stone-300!',
              content: 'gap-1!',
              icon: 'text-[#3F6254] group-data-[sonner-theme=dark]:text-emerald-300',
              success:
                '[&_[data-icon]]:text-[#3F6254] group-data-[sonner-theme=dark]:[&_[data-icon]]:text-emerald-300',
              info: '[&_[data-icon]]:text-stone-500 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-stone-300',
              warning:
                '[&_[data-icon]]:text-amber-700 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-amber-300',
              error:
                '[&_[data-icon]]:text-rose-700 group-data-[sonner-theme=dark]:[&_[data-icon]]:text-rose-300',
              actionButton:
                'h-8! rounded-full! bg-[#3F6254]! px-3! text-stone-50! hover:bg-[#345246]! focus-visible:ring-2 focus-visible:ring-[#3F6254]/40 group-data-[sonner-theme=dark]:bg-emerald-700! group-data-[sonner-theme=dark]:hover:bg-emerald-600!',
              cancelButton:
                'h-8! rounded-full! bg-stone-200/60! px-3! text-stone-600! hover:bg-stone-200! focus-visible:ring-2 focus-visible:ring-stone-400/40 group-data-[sonner-theme=dark]:bg-stone-800! group-data-[sonner-theme=dark]:text-stone-300! group-data-[sonner-theme=dark]:hover:bg-stone-700!',
              closeButton:
                'border-stone-200! bg-[#FAF8F5]! text-stone-500! hover:bg-stone-100! focus-visible:ring-2 focus-visible:ring-[#3F6254]/40 group-data-[sonner-theme=dark]:border-stone-700! group-data-[sonner-theme=dark]:bg-stone-900! group-data-[sonner-theme=dark]:text-stone-300! group-data-[sonner-theme=dark]:hover:bg-stone-800!'
            }
          }}
        />
      </body>
    </html>
  );
}
