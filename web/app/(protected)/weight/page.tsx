import { WeightManagement } from '@/components/weight-management';
import { BreadcrumbRoot } from '@chakra-ui/breadcrumb';
import { Box, BreadcrumbCurrentLink } from '@chakra-ui/react';

export default function Page() {
  return (
    <Box p={4}>
      <BreadcrumbRoot mb="2">
        <BreadcrumbCurrentLink>体重管理</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      <WeightManagement />
    </Box>
  );
}
