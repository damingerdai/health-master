// import {
//   Box,
//   Button,
//   Flex,
//   Text,
//   Icon,
//   NumberInput,
//   NumberInputStepper,
//   NumberDecrementStepper,
//   NumberInputField,
//   NumberIncrementStepper,
// } from '@chakra-ui/react';
// import { isNaN } from 'lodash';
// import * as React from 'react';
// import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
//
// interface PaginatorProps {
//   align?: 'left' | 'right';
//   page: number;
//   total: number;
//   pageChange?: (page: number) => void;
//   styles?: React.CSSProperties;
// }
//
// export const Paginator: React.FC<PaginatorProps> = props => {
//   const { align, page, total, pageChange, styles } = props;
//   const doPageChange = (p: number, callback?: (p: number) => void) => {
//     let newPage = p;
//     if (p < 1) {
//       newPage = 1;
//     } else if (p > total) {
//       newPage = total;
//     }
//
//     if (callback) {
//       callback(newPage);
//     }
//   };
//
//   return (
//     <Flex py="14px" justifyContent={align ?? 'right'} sx={{ ...styles }}>
//       <Flex>
//         <Button
//           colorScheme="gray"
//           leftIcon={<Icon as={MdChevronLeft} />}
//           aria-label="previous page"
//           isDisabled={page === 1}
//           onClick={() => doPageChange(page - 1, pageChange)}
//           bgColor="transparent"
//         >
//           上一页
//         </Button>
//         <Box pr={1} pl=".4rem" minW='76px' maxW='88px'>
//           <NumberInput
//             bg="white"
//             step={1}
//             value={page}
//             min={1}
//             max={total}
//             onChange={(_vs: string, vn: number) => {
//               if (isNaN(vn)) {
//                 return;
//               }
//               doPageChange(vn, pageChange);
//             }}
//           >
//             <NumberInputField readOnly disabled />
//             <NumberInputStepper>
//               <NumberIncrementStepper />
//               <NumberDecrementStepper />
//             </NumberInputStepper>
//           </NumberInput>
//         </Box>
//         <Button
//           colorScheme="gray"
//           rightIcon={<Icon as={MdChevronRight}></Icon>}
//           aria-label="next page"
//           isDisabled={page == total}
//           onClick={() => doPageChange(page + 1, pageChange)}
//           bgColor="transparent"
//         >
//           下一页
//         </Button>
//         {total > 0 && (
//           <Box lineHeight={10} pr=".4rem" fontWeight='semibold'>
//             <Text as="span" px={1}>{`总计 ${total} 页`}</Text>
//           </Box>
//         )}
//       </Flex>
//     </Flex>
//   );
// };
