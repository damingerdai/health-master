import { ProtectRoute } from "@/components/protect-route";
import { Siderbar } from "@/components/sidebar";
import { Box } from "@chakra-ui/react";
import * as React from "react";

const Dashboard: React.FC = () => {
  return (
    <Box as="main" pb={8}>
      <Siderbar>
        this is dashboard view
      </Siderbar>
    </Box>
  );
};

export default ProtectRoute(Dashboard);
