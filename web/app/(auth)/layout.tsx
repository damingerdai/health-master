import Image from 'next/image';
import { GalleryVerticalEnd } from 'lucide-react';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Health Master
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://picsum.photos/1000/1500?random=2" 
          alt="Health Master Background"
          fill  
          priority  
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          sizes="(max-width: 1024px) 0vw, 50vw"  
        />
      </div>
    </div>
  );
}
