import { CreateTemperatureForm } from '@/components/create-temperature-form';
import { Thermometer } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <div className="w-full max-w-[450px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
            <Thermometer className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Log Temperature</h1>
          <p className="text-muted-foreground">
            Monitor your body temperature for better health tracking
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
          <CreateTemperatureForm />
        </div>
      </div>
    </div>
  );
}
