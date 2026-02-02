import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-[#f8fafc] dark:bg-zinc-950 min-h-screen animate-in fade-in duration-500">
      {/* 1. 模拟顶部返回按钮 */}
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 md:px-0">
        <div className="flex items-center gap-2 opacity-50">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <main className="flex flex-1 items-start justify-center p-4 md:p-10">
        <div className="w-full max-w-xl">
          {/* 2. 模拟标题和图标区域 */}
          <div className="mb-8 flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-14 w-14 rounded-2xl" /> {/* 图标占位 */}
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="h-8 w-48" /> {/* 主标题 */}
              <Skeleton className="h-4 w-64" /> {/* 副标题 */}
            </div>
          </div>

          {/* 3. 模拟表单大卡片 (3xl) */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-10 dark:bg-zinc-900">
            <div className="mx-auto max-w-sm space-y-8">
              
              {/* 模拟血压数值输入区 (两列) */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-20" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>

              {/* 模拟心率输入区 */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>

              {/* 模拟日期时间区 (两列) */}
              <div className="grid grid-cols-2 gap-4 border-t pt-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              {/* 模拟提交按钮 */}
              <Skeleton className="h-12 w-full rounded-md shadow-sm" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}