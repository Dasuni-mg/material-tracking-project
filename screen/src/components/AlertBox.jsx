import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
  VStack,
} from "@chakra-ui/react";

function AlertBox(props) {
  return (
    <Alert status={props.status} w="auto">
      <AlertIcon />
      <AlertTitle me={4}>{props.title}</AlertTitle>
      <AlertDescription me={props.withCloseButton ? 8 : 0}>
        {props.description}
      </AlertDescription>
      {props.withCloseButton && (
        <CloseButton position="absolute" top={2} right={2} />
      )}
    </Alert>
  );
}

export default AlertBox;
