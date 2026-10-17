import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb';

interface AppBreadcrumbProps {
  subTitle: string;
  subTitleHref?: string;
}

export const AppBreadcrumb = ({
  subTitle,
  subTitleHref
}: AppBreadcrumbProps) => {
  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList className="text-xs text-stone-400 sm:gap-2 dark:text-stone-500">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard"
            className="text-stone-500 transition-colors hover:text-[#3F6254] dark:text-stone-400 dark:hover:text-emerald-300"
          >
            Sanctuary
          </BreadcrumbLink>
        </BreadcrumbItem>
        {subTitle && (
          <>
            <BreadcrumbSeparator className="text-stone-300 dark:text-stone-700" />
            {subTitleHref ? (
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={subTitleHref}
                  className="text-stone-500 transition-colors hover:text-[#3F6254] dark:text-stone-400 dark:hover:text-emerald-300"
                >
                  {subTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-stone-700 dark:text-stone-200">
                  {subTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
