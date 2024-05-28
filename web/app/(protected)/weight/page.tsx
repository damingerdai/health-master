import { WeightManagement } from '@/components/weight-management';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';

export default function Page() {
  return (
    <Box p={4}>
      <Breadcrumb mb="2">
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/">体重管理</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <WeightManagement />
    </Box>
  );
}
