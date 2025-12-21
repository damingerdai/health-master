import { CreateBloodPressureForm } from '@/components/create-blood-pressure-form';

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6 justify-center items-center">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Create a new blood pressure record
          </h2>
          <div className="flex flex-1 items-center justify-center w-full max-w-2xl">
            <div className="w-full max-w-xs">
              <CreateBloodPressureForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
