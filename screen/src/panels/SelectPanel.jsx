import { Fragment, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { BackIcon } from "../Icons";
import AlertBox from "../components/AlertBox";

export class SelectPanelError extends Error {
  constructor(title, message) {
    super(message);
    this.title = title;
  }
}

function SelectPanel(props) {
  const [selectIndex, setTealineIndex] = useState("");
  const [selectError, setTealineError] = useState(null);
  const onSelectChange = (event) => {
    if (event.target.value !== "") setTealineError(null);
    setTealineIndex(event.target.value);
  };

  const onStartClick = () => {
    if (selectIndex === "") return setTealineError(props.selectErrorHint);
    props.onStartClick && props.onStartClick(props.selectList[selectIndex]);
  };

  return (
    <Flex h="100%" px={12} flexDir="column" justify="center" align="start">
      <Button leftIcon={<BackIcon />} variant="link">
        Go back to main menu
      </Button>
      <Heading mt={6} size="2xl">
        {props.title}
      </Heading>
      <Text mt={4} fontSize="xl">
        {props.subtitle}
      </Text>
      <HStack mt={4} spacing={4} align="start">
        {props.panelState === null || props.panelState.status === "busy" ? (
          <Spinner size="xl" />
        ) : props.panelState.status === "ready" ? (
          <Fragment>
            <FormControl w="auto" isInvalid={selectError}>
              <Select
                size="lg"
                placeholder={props.selectHint}
                value={selectIndex}
                onChange={onSelectChange}
              >
                {props.selectList.map((item, index) => (
                  <option key={index} value={index}>
                    {props.selectItem ? props.selectItem(item) : index}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{selectError}</FormErrorMessage>
            </FormControl>
            <Button size="lg" onClick={onStartClick}>
              Start
            </Button>
          </Fragment>
        ) : (
          <AlertBox
            status="error"
            title={props.panelState.error.title}
            description={props.panelState.error.message}
          />
        )}
      </HStack>
    </Flex>
  );
}

export default SelectPanel;
