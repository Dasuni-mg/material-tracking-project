import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function DataPanel(props) {
  const [title, ...rows] = props.table;
  return (
    <Flex w="100%" h="100%" flex={1} flexDir="column">
      <Table variant="simple">
        <Thead position="sticky" top={0}>
          <Tr>
            {title.map((column, index) => (
              <Th key={index} isNumeric={column.numeric}>
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <Tr key={index}>
              {row.map((column, index) => (
                <Td key={index} isNumeric={title[index].numeric}>
                  {column}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt="auto" p={4} borderTopWidth="1px" alignItems="center">
        <Box flex={1}>
          <Heading size="md">{props.title}</Heading>
          <Text mt={1} fontSize="sm">
            {props.summary}
          </Text>
        </Box>
        {props.hideButton && (
          <Button
            isDisabled={props.disabled}
            size="lg"
            onClick={props.onButtonClick}
          >
            {props.disabled ? props.disableText : props.enableText}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

export default DataPanel;
