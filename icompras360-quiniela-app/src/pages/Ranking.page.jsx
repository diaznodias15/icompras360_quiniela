// REACT
import { Flex, Text } from "@mantine/core";
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";

const Ranking = () => {
  return (
    <Flex align={"center"} direction={"column"} w={"100%"} pb={50}>
      <ContainerSection mb={20} px={{ base: 10, md: 20 }} pt={20}>
        <Text fw={800} size="2xl" c="primary">
          Ranking
        </Text>
      </ContainerSection>
    </Flex>
  );
};

export default Ranking;
