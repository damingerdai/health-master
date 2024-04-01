'use client';

import {
  Box, Card, CardBody, CardHeader, Text,
} from '@chakra-ui/react';
import * as React from 'react';

export default function Dashboard() {
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
    // <Layout>
    //   <AuthProvider>
    //     <Box pb={8}>
    //       <Flex flexWrap="wrap">
    //         {cards.map((card) => (
    //           <Box
    //             key={card.name}
    //             p={2}
    //             width={{
    //               base: '100%',
    //               sm: '50%',
    //               md: '50%',
    //               lg: '33%',
    //               xl: '25%',
    //             }}
    //           >
    //             <Card>
    //               <CardHeader>{card.title}</CardHeader>
    //               <CardBody>
    //                 <Text>{card.name}</Text>
    //               </CardBody>
    //             </Card>
    //           </Box>
    //         ))}
    //       </Flex>
    //     </Box>
    //   </AuthProvider>
    // </Layout>
    <Box>
      <Text>Dashboard</Text>
      {
        cards.map((card) => (
          <Card key={card.name}>
            <CardHeader>{card.title}</CardHeader>
            <CardBody>
              <Text>{card.name}</Text>
            </CardBody>
          </Card>
        ))
      }
    </Box>
  );
}
