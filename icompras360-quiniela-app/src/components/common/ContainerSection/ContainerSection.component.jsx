// MANTINE
import { Flex } from "@mantine/core";

export const ContainerSection = ({ children, ...props }) => {
  return (
    <Flex
      direction={"column"}
      gap={"lg"}
      maw={1400}
      px={10}
      w={"100%"}
      {...props}
    >
      {children}
    </Flex>
  );
};
