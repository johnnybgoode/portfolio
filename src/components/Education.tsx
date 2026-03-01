import { Box } from './ui/Box';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';

export const Education = () => {
  return (
    <div>
      <Heading level={3}>Education</Heading>
      <Flex>
        <Box>Drexel University — Philadelphia, PA</Box>
        <Box>B.S. in Management Information Systems</Box> · <Box>2005-2010</Box>
        <Box></Box>
      </Flex>
    </div>
  );
};
