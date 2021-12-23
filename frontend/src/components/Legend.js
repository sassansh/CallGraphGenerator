import { Box, Image } from '@chakra-ui/react';

import legendImage from '../assets/legend.png';

function Legend() {
  return (
    <>
      <Box boxSize="sm">
        <Image src={legendImage} alt="Legend" width="250" mt={2} />
      </Box>
    </>
  );
}

export default Legend;
