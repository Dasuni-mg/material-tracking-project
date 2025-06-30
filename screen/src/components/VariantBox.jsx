import { Box, useStyleConfig } from "@chakra-ui/react";

function VariantBox(props) {
  const { variant, ...rest } = props;
  const styles = useStyleConfig("VariantBox", { variant });

  return <Box __css={styles} {...rest} />;
}

export default VariantBox;
