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
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {subTitle && (
          <>
            <BreadcrumbSeparator />
            {subTitleHref ? (
              <BreadcrumbItem>
                <BreadcrumbLink href={subTitleHref}>{subTitle}</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{subTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
