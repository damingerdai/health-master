import { AuthProvider } from '@/components/auth-provider';
import { Layout } from '@/components/layout';
import { ProtectRoute } from '@/components/protect-route';
import {
  Box, Card, CardBody, CardHeader, Flex, Text,
} from '@chakra-ui/react';
import * as React from 'react';

const Dashboard: React.FC = () => {
  const cards = [
    {
      title: '体重管理',
      name: '体重',
    },
    {
      title: '血压管理',
      name: '血压',
    },
    {
      title: '心率管理',
      name: '心率',
    },
    {
      title: '习惯打卡',
      name: '打卡',
    },
  ];

  return (
    <Layout>
      <AuthProvider>
        <Box pb={8}>
          <Flex flexWrap="wrap">
            {cards.map((card) => (
              <Box
                key={card.name}
                p={2}
                width={{
                  base: '100%',
                  sm: '50%',
                  md: '50%',
                  lg: '33%',
                  xl: '25%',
                }}
              >
                <Card>
                  <CardHeader>{card.title}</CardHeader>
                  <CardBody>
                    <Text>{card.name}</Text>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Flex>
        </Box>
      </AuthProvider>
    </Layout>
  );
};

export default ProtectRoute(Dashboard);
