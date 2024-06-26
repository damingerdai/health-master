import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';

export default function Page() {
  return (
    <Box p={4} h="100%">
      <Breadcrumb mb="2">
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/">血压记录</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <UserBloodPressureForm />
    </Box>
  );
}
