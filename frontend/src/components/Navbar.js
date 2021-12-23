import { Avatar, Box, Flex, HStack, Tab, TabList } from '@chakra-ui/react';

import JsonFileUploader from './JsonFileUploader';

const menuItems = (
  <TabList>
    <Tab>Tool</Tab>
  </TabList>
);

export default function Nav({
  setElements,
  setJson,
  setJsonMap,
  showTime,
  setError,
}) {
  return (
    <>
      <Box bg="gray.100" px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Flex alignItems={'center'}>
              <Avatar mr={2} bg="gray.100" size={'sm'} src={'/logo192.png'} />
              <Box>CallGraphGenerator</Box>
            </Flex>
            <HStack as={'nav'} spacing={4}>
              {menuItems}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <JsonFileUploader
              setElements={setElements}
              setJson={setJson}
              setJsonMap={setJsonMap}
              showTime={showTime}
              setError={setError}
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
