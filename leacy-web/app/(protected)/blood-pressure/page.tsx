import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import { Box } from '@chakra-ui/react';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb';

export default function Page() {
  return (
    <Box p={4} h="100%">
      <BreadcrumbRoot mb="2">
        <BreadcrumbCurrentLink>血压记录</BreadcrumbCurrentLink>
      </BreadcrumbRoot>

      <UserBloodPressureForm />
    </Box>
  );
}
