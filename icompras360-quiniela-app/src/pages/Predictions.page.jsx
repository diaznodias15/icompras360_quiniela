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
  Divider,
  Skeleton,
  Chip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
// COMPONENTS
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
import {
  MatchesCard,
  MatchesCardSkeleton,
} from "@components/matches/MatchesCard.component.jsx";
// SERVICES
import { getPartidosLista } from "@services/partidos/partidos.services";
import { getEstadisticasUsuario } from "@services/users/estadisticas.services";
// STORE
import { useUserStore } from "@store/user.store";
// LUCIDE
import { Calendar, Trophy, Info, Target, CheckCircle2 } from "lucide-react";

const Predictions = () => {
  const [partidos, setPartidos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [faseSeleccionada, setFaseSeleccionada] = useState("all");

  const token = useUserStore((state) => state.token);

  const fases = useMemo(() => {
    const fasesMap = new Map();
    partidos.forEach((partido) => {
      if (partido.fase?.id != null && partido.fase?.nombre) {
        fasesMap.set(String(partido.fase.id), partido.fase.nombre);
      }
    });
    return Array.from(fasesMap, ([id, nombre]) => ({ id, nombre }));
  }, [partidos]);

  const partidosFiltrados = useMemo(() => {
    if (faseSeleccionada === "all") return partidos;
    return partidos.filter((partido) => String(partido.fase.id) === faseSeleccionada);
  }, [partidos, faseSeleccionada]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [partidosData, estadisticasData] = await Promise.all([
          getPartidosLista({ authToken: token }),
          getEstadisticasUsuario({ authToken: token }),
        ]);
        if (active) {
          setPartidos(partidosData);
          setEstadisticas(estadisticasData);
          setError(false);
        }
      } catch (err) {
        if (active) {
          setError(true);
          notifications.show({
            color: "danger",
            title: "Error",
            message: "No se pudieron cargar los datos. Por favor, intente de nuevo.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [token]);

  const skeletonCards = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => (
      <MatchesCardSkeleton key={i} />
    ));
  }, []);

  const matchesCards = partidosFiltrados.map((partido) => {
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
                      {loading || !estadisticas ? (
                        <Skeleton height={36} width={60} />
                      ) : (
                        <Text size="3xl" fw={900} c="primary">
                          {estadisticas.puntos_acumulados} Pts
                        </Text>
                      )}
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
                      {loading || !estadisticas ? (
                        <Skeleton height={36} width={40} />
                      ) : (
                        <Text size="3xl" fw={900} c="success">
                          {estadisticas.aciertos_exactos}
                        </Text>
                      )}
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
                      {loading || !estadisticas ? (
                        <Skeleton height={36} width={40} />
                      ) : (
                        <Text size="3xl" fw={900} c="blue">
                          {estadisticas.aciertos_simples}
                        </Text>
                      )}
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
                      {loading || !estadisticas ? (
                        <Skeleton height={24} width={80} />
                      ) : (
                        <Text size="lg" fw={800}>
                          {estadisticas.porcentaje_prediccion}%
                        </Text>
                      )}
                      <Text size="xs" c="dimmed">
                        Efectividad de acierto
                      </Text>
                    </Stack>
                    {loading || !estadisticas ? (
                      <Skeleton circle height={70} />
                    ) : (
                      <RingProgress
                        size={70}
                        roundCaps
                        thickness={6}
                        sections={[
                          {
                            value: estadisticas.porcentaje_prediccion,
                            color: "teal",
                          },
                        ]}
                        label={
                          <Text size="xs" fw={700} ta="center">
                            {estadisticas.porcentaje_prediccion}%
                          </Text>
                        }
                      />
                    )}
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
                {partidosFiltrados.length} Partidos
              </Badge>
            </Group>

            {fases.length > 0 && (
              <Chip.Group multiple={false} value={faseSeleccionada} onChange={setFaseSeleccionada}>
                <Flex gap="xs" wrap="wrap">
                  <Chip color="blue" variant="filled" value="all">
                    Todos
                  </Chip>
                  {fases.map((fase) => (
                    <Chip key={fase.id} color="blue" variant="filled" value={fase.id}>
                      {fase.nombre}
                    </Chip>
                  ))}
                </Flex>
              </Chip.Group>
            )}

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
              ) : partidosFiltrados.length === 0 ? (
                <Grid.Col span={12}>
                  <Alert color="blue" title="Sin partidos">
                    No hay partidos disponibles en esta fase.
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
