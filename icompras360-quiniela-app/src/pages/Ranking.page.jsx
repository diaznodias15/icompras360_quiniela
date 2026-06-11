// REACT
import { useEffect, useState, useMemo } from "react";
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
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
import { AdaptiveModal } from "@components/common/AdaptiveModal/AdaptiveModal.component.jsx";
import {
  UserPredictionsCardSkeleton,
  UserPredictionsModalContent,
} from "@components/common/UserPredictionsModal/UserPredictionsModal.component";
import { getRanking } from "@services/users/ranking.services";
import { getUserPredictions } from "@services/users/userPredictions.services";
import { useUserStore } from "@store/user.store";
import { Trophy, Medal, Award, TrendingUp, Eye } from "lucide-react";

const Ranking = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPredictions, setUserPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [errorPredictions, setErrorPredictions] = useState(false);
  const [faseSeleccionada, setFaseSeleccionada] = useState("all");

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

  const handleViewPredictions = async (user) => {
    setSelectedUser(user);
    setFaseSeleccionada("all");
    openModal();

    let active = true;
    setLoadingPredictions(true);
    setErrorPredictions(false);

    try {
      const data = await getUserPredictions({
        userId: user.id,
        authToken: token,
      });
      if (active) {
        setUserPredictions(data);
        setErrorPredictions(false);
      }
    } catch (err) {
      if (active) {
        setErrorPredictions(true);
        notifications.show({
          color: "danger",
          title: "Error",
          message: `No se pudieron cargar las predicciones de ${user.name}.`,
        });
      }
    } finally {
      if (active) {
        setLoadingPredictions(false);
      }
    }

    return () => {
      active = false;
    };
  };

  const fases = useMemo(() => {
    const fasesMap = new Map();
    userPredictions.forEach((partido) => {
      if (partido.fase?.id != null && partido.fase?.nombre) {
        fasesMap.set(String(partido.fase.id), partido.fase.nombre);
      }
    });
    return Array.from(fasesMap, ([id, nombre]) => ({ id, nombre }));
  }, [userPredictions]);

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
      <Table.Td><Skeleton height={20} width={60} /></Table.Td>
      <Table.Td><Skeleton height={30} width={80} /></Table.Td>
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
                    <Table.Th style={{ textAlign: "center" }}>Pronósticos</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    skeletonRows
                  ) : error ? (
                    <Table.Tr>
                      <Table.Td colSpan={8}>
                        <Text c="danger" ta="center" fw={600}>
                          Error al cargar el ranking
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : rankingData.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={8}>
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
                        <Table.Td style={{ textAlign: "center" }}>
                          <Badge color="violet" variant="light" size="lg">
                            {user.pronosticos_count}
                          </Badge>
                        </Table.Td>
                        <Table.Td style={{ textAlign: "center" }}>
                          <Button
                            variant="subtle"
                            color="blue"
                            size="sm"
                            leftSection={<Eye size={16} />}
                            onClick={() => handleViewPredictions(user)}
                          >
                            Ver
                          </Button>
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

      <AdaptiveModal
        opened={modalOpened}
        onClose={closeModal}
        size="xl"
        title={
          <Flex align={"center"} gap={"xs"}>
            <Eye size={24} color="#E31B23" />
            <Text fw={700} size="lg">
              Pronósticos de {selectedUser?.name}
            </Text>
          </Flex>
        }
        zIndex={1100}
      >
        <UserPredictionsModalContent
          userData={selectedUser}
          predictions={userPredictions}
          loading={loadingPredictions}
          error={errorPredictions}
          faseSeleccionada={faseSeleccionada}
          onFaseChange={setFaseSeleccionada}
          fases={fases}
        />
      </AdaptiveModal>
    </Flex>
  );
};

export default Ranking;
