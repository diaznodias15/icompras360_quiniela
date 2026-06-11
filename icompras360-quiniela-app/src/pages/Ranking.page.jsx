// REACT
import { useEffect, useState } from "react";
import {
  Table,
  Badge,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Flex,
  Box,
  Avatar,
  ThemeIcon,
  Progress,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
import { getRanking } from "@services/users/ranking.services";
import { useUserStore } from "@store/user.store";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";

const Ranking = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const data = await getRanking({ authToken: token });
        if (active) {
          setRankingData(data);
          setError(false);
        }
      } catch (err) {
        if (active) {
          setError(true);
          notifications.show({
            color: "danger",
            title: "Error",
            message: "No se pudo cargar el ranking.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRanking();
    return () => {
      active = false;
    };
  }, [token]);

  const getPositionIcon = (position) => {
    if (position === 1) return <Trophy size={20} color="#FFD700" />;
    if (position === 2) return <Medal size={20} color="#C0C0C0" />;
    if (position === 3) return <Award size={20} color="#CD7F32" />;
    return null;
  };

  const getPositionBgColor = (position) => {
    if (position === 1) return "#FFF8E1";
    if (position === 2) return "#F5F5F5";
    if (position === 3) return "#FFF3E0";
    return "transparent";
  };

  const skeletonRows = Array.from({ length: 10 }).map((_, i) => (
    <Table.Tr key={i}>
      <Table.Td><Skeleton height={20} width={30} /></Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Skeleton circle height={40} />
          <Stack gap={4}>
            <Skeleton height={14} width={150} />
            <Skeleton height={10} width={200} />
          </Stack>
        </Group>
      </Table.Td>
      <Table.Td><Skeleton height={20} width={60} /></Table.Td>
      <Table.Td><Skeleton height={20} width={40} /></Table.Td>
      <Table.Td><Skeleton height={20} width={40} /></Table.Td>
      <Table.Td><Skeleton height={20} width={50} /></Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex align={"center"} direction={"column"} w={"100%"} pb={50}>
      <ContainerSection mb={20} px={{ base: 10, md: 20 }} pt={20}>
        <Stack gap="md" w={"100%"}>
          <Card shadow="md" withBorder p="lg" bg={"section"}>
            <Flex align={"center"} justify={"space-between"} mb="md">
              <Group gap="xs">
                <ThemeIcon color="red" size="lg" variant="filled" radius="md">
                  <TrendingUp size={20} />
                </ThemeIcon>
                <Text fw={800} size="xl" c="primary">
                  Ranking General
                </Text>
              </Group>
              <Badge color="red" variant="filled" size="lg">
                {rankingData.length} Participantes
              </Badge>
            </Flex>

            <Box style={{ overflowX: "auto" }}>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ textAlign: "center" }}>Pos.</Table.Th>
                    <Table.Th>Participante</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Puntos</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Exactos</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Simples</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Efectividad</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    skeletonRows
                  ) : error ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text c="danger" ta="center" fw={600}>
                          Error al cargar el ranking
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : rankingData.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text c="dimmed" ta="center">
                          No hay participantes en el ranking
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    rankingData.map((user) => (
                      <Table.Tr
                        key={user.id}
                        bg={getPositionBgColor(user.posicion)}
                      >
                        <Table.Td style={{ textAlign: "center" }}>
                          <Group gap="xs" justify="center">
                            {getPositionIcon(user.posicion)}
                            <Text fw={700} size="lg">
                              {user.posicion}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar color="red" radius="xl" size="md">
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Stack gap={2}>
                              <Text fw={600} size="sm" lineClamp={1}>
                                {user.name}
                              </Text>
                              <Text c="dimmed" size="xs" lineClamp={1}>
                                {user.email}
                              </Text>
                            </Stack>
                          </Group>
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          <Badge color="red" variant="filled" size="lg">
                            {user.puntos_acumulados} pts
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          <Text fw={600} c="blue">
                            {user.aciertos_exactos}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          <Text fw={600} c="green">
                            {user.aciertos_simples}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          <Stack gap={4} align="center">
                            <Text fw={700} size="sm">
                              {user.porcentaje_prediccion}%
                            </Text>
                            <Progress
                              value={parseFloat(user.porcentaje_prediccion)}
                              color={parseFloat(user.porcentaje_prediccion) >= 50 ? "teal" : "red"}
                              size="sm"
                              w={60}
                            />
                          </Stack>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Box>
          </Card>
        </Stack>
      </ContainerSection>
    </Flex>
  );
};

export default Ranking;
