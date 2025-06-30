import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { BackIcon } from "../Icons";

function TitlePanel(props) {
  return (
    <Flex p={4} justify="space-between" align="end" borderTopWidth="1px">
      <Box>
        {props.onBackButtonClick && (
          <Button
            leftIcon={<BackIcon />}
            variant="link"
            size="sm"
            onClick={props.onBackButtonClick}
          >
            {props.backButtonLabel}
          </Button>
        )}
        <Heading mt={2} size="lg">
          {props.title}
        </Heading>
      </Box>
    </Flex>
  );
}

export default TitlePanel;
