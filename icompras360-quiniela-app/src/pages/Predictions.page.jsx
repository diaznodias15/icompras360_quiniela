// REACT
import { useMemo, useState, useEffect } from "react";
// MANTINE
import {
  Alert,
  Flex,
  Text,
  ThemeIcon,
  List,
  Grid,
  Card,
  Group,
  Image,
  Stack,
  RingProgress,
  Badge,
  Skeleton,
  NumberInput,
  Button,
  Divider,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
// COMPONENTS
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
import {
  MatchesCard,
  MatchesCardSkeleton,
} from "@components/matches/MatchesCard.component.jsx";
// SERVICES
import {
  getPartidosLista,
  guardarPronostico,
} from "@services/partidos/partidos.services";
// STORE
import { useUserStore } from "@store/user.store";
// LUCIDE
import {
  Calendar,
  Trophy,
  Info,
  Target,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Save,
  Lock,
} from "lucide-react";

const Predictions = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [predictions, setPredictions] = useState({});
  const [savingPredictions, setSavingPredictions] = useState({});

  // Obtener el token de la sesión activa
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    let active = true;
    const fetchPartidos = async () => {
      try {
        setLoading(true);
        const data = await getPartidosLista({ authToken: token });
        if (active) {
          setPartidos(data);
          setError(false);
        }
      } catch (err) {
        if (active) {
          setError(true);
          notifications.show({
            color: "danger",
            title: "Error",
            message:
              "No se pudieron cargar los partidos. Por favor, intente de nuevo.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPartidos();
    return () => {
      active = false;
    };
  }, [token]);

  const handlePredictionChange = (matchId, team, val) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: val,
      },
    }));
  };

  const savePrediction = async (matchId) => {
    const pred = predictions[matchId];
    if (pred?.local === undefined || pred?.visitante === undefined) {
      notifications.show({
        color: "yellow",
        title: "Atención",
        message:
          "Por favor, ingresa los goles para ambos equipos antes de guardar.",
      });
      return;
    }

    setSavingPredictions((prev) => ({ ...prev, [matchId]: true }));
    try {
      await guardarPronostico(
        {
          partido_id: matchId,
          goles_local: pred.local,
          goles_visitante: pred.visitante,
        },
        { authToken: token },
      );
      notifications.show({
        color: "success",
        title: "Pronóstico guardado",
        message: "Tu predicción fue registrada correctamente.",
      });
    } catch (err) {
      notifications.show({
        color: "danger",
        title: "Error al guardar",
        message:
          err?.data?.message ||
          "No se pudo guardar el pronóstico. Intenta de nuevo.",
      });
    } finally {
      setSavingPredictions((prev) => ({ ...prev, [matchId]: false }));
    }
  };

  const skeletonCards = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => (
      <MatchesCardSkeleton key={i} />
    ));
  }, []);

  const matchesCards = partidos.map((partido) => {
    return <MatchesCard key={partido.id} data={partido} />;
  });

  return (
    <Flex align={"center"} direction={"column"} w={"100%"} pb={50}>
      <ContainerSection mb={20} px={{ base: 10, md: 20 }} pt={20}>
        <Flex align={"center"} direction={"column"} w={"100%"} gap={"lg"}>
          {/* BANNER PRINCIPAL */}
          <Alert color={"green"} w={"100%"}>
            <Flex
              align={"center"}
              gap={15}
              justify={"space-between"}
              direction={{ base: "column", sm: "row" }}
              py={10}
            >
              <Flex align="center" justify={"center"} w={"100%"}>
                <Image
                  alt={`Logo de balon del mundial`}
                  fit={"contain"}
                  h={100}
                  src={`${import.meta.env.BASE_URL}img/balon-mundial.webp`}
                  visibleFrom="sm"
                  w={150}
                />
                <Flex
                  direction={"column"}
                  align={{ base: "center", sm: "flex-start" }}
                >
                  <Text
                    c={"primary"}
                    fw={850}
                    size={"2xl"}
                    style={{ letterSpacing: "1px" }}
                    ta={"center"}
                  >
                    QUINIELA MUNDIALISTA
                  </Text>
                  <Flex align={"center"} gap={5}>
                    <ThemeIcon color="gray" variant={"transparent"} size={"md"}>
                      <Calendar size={18} />
                    </ThemeIcon>
                    <Text c={"dimmed"} size="sm" fw={500}>
                      Del 11 de Junio al 19 de Julio, 2026
                    </Text>
                  </Flex>
                </Flex>
                <Image
                  alt={`Logo de balon del mundial`}
                  fit={"contain"}
                  h={100}
                  src={`${import.meta.env.BASE_URL}img/logo-default.webp`}
                  visibleFrom="sm"
                  w={150}
                />
              </Flex>
            </Flex>
          </Alert>

          {/* CUADRO DE PUNTOS ACUMULADOS Y ACIERTOS (STATS DASHBOARD) */}
          <Card
            w={"100%"}
            shadow="md"
            withBorder
            p={"xl"}
            bg={"var(--mantine-color-body)"}
          >
            <Text
              fw={700}
              size="lg"
              mb="md"
              c="primary"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              Mis puntuaciones
            </Text>

            <Grid gutter={{ base: "md", md: "xl" }} mb="lg">
              {/* PUNTOS ACUMULADOS */}
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card
                  h={"100%"}
                  shadow="xs"
                  p="md"
                  withBorder
                  bg="var(--mantine-color-primary-0)"
                  style={{
                    borderLeft: "5px solid var(--mantine-color-primary-5)",
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                        Puntos Acumulados
                      </Text>
                      <Text size="3xl" fw={900} c="primary">
                        10 Pts
                      </Text>
                    </Stack>
                    <ThemeIcon color="primary" size="lg">
                      <Trophy size={20} />
                    </ThemeIcon>
                  </Group>
                  <Text size="xs" c="dimmed" mt="sm">
                    Suma total de aciertos de resultados
                  </Text>
                </Card>
              </Grid.Col>

              {/* ACIERTOS EXACTOS */}
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card
                  h={"100%"}
                  shadow="xs"
                  p="md"
                  withBorder
                  bg="var(--mantine-color-green-0)"
                  style={{
                    borderLeft: "5px solid var(--mantine-color-success-5)",
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                        Aciertos Exactos
                      </Text>
                      <Text size="3xl" fw={900} c="success">
                        2
                      </Text>
                    </Stack>
                    <ThemeIcon color="success" size="lg">
                      <Target size={20} />
                    </ThemeIcon>
                  </Group>
                  <Text size="xs" c="dimmed" mt="sm">
                    Marcadores exactos acertados (+3 Pts c/u)
                  </Text>
                </Card>
              </Grid.Col>

              {/* ACIERTOS GANADOR */}
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card
                  shadow="xs"
                  p="md"
                  h={"100%"}
                  withBorder
                  bg="var(--mantine-color-blue-0)"
                  style={{
                    borderLeft: "5px solid var(--mantine-color-blue-5)",
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                        Resultados Simples
                      </Text>
                      <Text size="3xl" fw={900} c="blue">
                        4
                      </Text>
                    </Stack>
                    <ThemeIcon color="blue" size="lg">
                      <CheckCircle2 size={20} />
                    </ThemeIcon>
                  </Group>
                  <Text size="xs" c="dimmed" mt="sm">
                    Ganador/Empate sin marcador exacto (+1 Pt)
                  </Text>
                </Card>
              </Grid.Col>

              {/* EFECTIVIDAD */}
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card
                  h={"100%"}
                  shadow="xs"
                  p="md"
                  withBorder
                  bg="var(--mantine-color-yellow-0)"
                >
                  <Group justify="space-between" align="center">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                        Predicciones
                      </Text>
                      <Text size="lg" fw={800}>
                        6 / 10
                      </Text>
                      <Text size="xs" c="dimmed">
                        Efectividad de acierto
                      </Text>
                    </Stack>
                    <RingProgress
                      size={70}
                      roundCaps
                      thickness={6}
                      sections={[
                        {
                          value: 60,
                          color: "teal",
                        },
                      ]}
                      label={
                        <Text size="xs" fw={700} ta="center">
                          60%
                        </Text>
                      }
                    />
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>

            {/* SISTEMA DE PUNTUACIÓN INTEGRADO */}
            <Alert
              variant="light"
              color="blue"
              title="¿Cómo sumar puntos?"
              icon={<Info size={18} />}
              w={"100%"}
            >
              <List size="sm">
                <List.Item>
                  <Text component="span" fw={700} c="blue">
                    3 Puntos (Marcador Exacto):
                  </Text>{" "}
                  Por acertar el marcador exacto de goles de ambos equipos.
                </List.Item>
                <List.Item>
                  <Text component="span" fw={700} c="blue">
                    1 Punto (Acierto Simple):
                  </Text>{" "}
                  Por acertar el ganador (o empate), pero no el marcador exacto.
                </List.Item>
              </List>
            </Alert>
          </Card>

          {/* LISTA DE PARTIDOS */}
          <Flex direction="column" w="100%" gap="md" mt={10}>
            <Group justify="space-between" align="center">
              <Stack gap={2}>
                <Text fw={800} size="xl" c="primary">
                  Partidos de la Copa del Mundo 2026
                </Text>
                <Text size="sm" c="dimmed">
                  Pronostica los resultados de los próximos encuentros
                </Text>
              </Stack>
              <Badge color="blue" variant="filled" size="lg">
                {partidos.length} Partidos
              </Badge>
            </Group>

            <Divider my="xs" />

            <Grid gap="lg">
              {loading ? (
                skeletonCards
              ) : error ? (
                <Grid.Col span={12}>
                  <Alert color="danger" title="Error de conexión">
                    Hubo un problema al cargar los partidos de la base de datos.
                  </Alert>
                </Grid.Col>
              ) : partidos.length === 0 ? (
                <Grid.Col span={12}>
                  <Alert color="blue" title="Sin partidos">
                    No hay partidos disponibles en este momento.
                  </Alert>
                </Grid.Col>
              ) : (
                matchesCards
              )}
            </Grid>
          </Flex>
        </Flex>
      </ContainerSection>
    </Flex>
  );
};

export default Predictions;
