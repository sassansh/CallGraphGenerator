import {
  Checkbox,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
} from '@chakra-ui/react';

import { Search2Icon } from '@chakra-ui/icons';
import { getElementsFromJson } from './LayoutFlow';
import { useState } from 'react';

const Toolbar = ({
  setShowTime,
  setShowNumCalls,
  setElements,
  json,
  jsonMap,
  showTime,
  showNumCalls,
  setJson,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [optionSelectedValue, setOptionSelectedValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    let jsonTemp =
      optionSelectedValue === '' ? json : jsonMap.get(optionSelectedValue);
    setElements(
      getElementsFromJson(jsonTemp, showTime, showNumCalls, event.target.value)
    );
  };

  const onShowTimeChange = (e) => {
    setShowTime(e);
    setElements(getElementsFromJson(json, e, showNumCalls, searchValue));
  };

  const onShowNumCallsChange = (e) => {
    setShowNumCalls(e);
    setElements(getElementsFromJson(json, showTime, e, searchValue));
  };

  const optionSelected = (e) => {
    setOptionSelectedValue(e.target.value);
    setJson(jsonMap.get(e.target.value));
    setElements(
      getElementsFromJson(
        jsonMap.get(e.target.value),
        showTime,
        showNumCalls,
        searchValue
      )
    );
  };

  const mapKeys = Array.from(jsonMap.keys());
  const optionList = [];
  mapKeys.forEach((option) => {
    optionList.push(
      <option key={option} value={option}>
        {option}
      </option>
    );
  });

  return (
    <Stack
      bg={'gray.100'}
      rounded={'xl'}
      p={{ base: 4, sm: 6, md: 8 }}
      spacing={{ base: 8 }}
    >
      <Stack spacing={4}>
        <Heading color={'gray.800'} lineHeight={1.1} fontSize={'xl'}>
          Filters
        </Heading>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.500" />}
          />
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            _placeholder={{ color: 'gray.500' }}
            bg="white"
            maxW="300"
            placeholder="Search by method name"
          />
        </InputGroup>
        <Checkbox
          defaultIsChecked
          onChange={(e) => onShowNumCallsChange(e.target.checked)}
        >
          Show # of Calls
        </Checkbox>
        <Checkbox
          defaultIsChecked
          onChange={(e) => onShowTimeChange(e.target.checked)}
        >
          Show Runtime
        </Checkbox>
        <Heading color={'gray.800'} lineHeight={1.1} fontSize={'xl'}>
          Parent Picker
        </Heading>
        <Select bg="white" maxW="300" onChange={optionSelected}>
          {/* <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option> */}
          {optionList}
        </Select>
      </Stack>
    </Stack>
  );
};
export default Toolbar;
