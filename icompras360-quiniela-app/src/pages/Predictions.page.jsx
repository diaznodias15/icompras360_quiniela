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
  ScrollArea,
  Badge,
  Divider,
  Skeleton,
  Chip,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// COMPONENTS
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
import { AdaptiveModal } from "@components/common/AdaptiveModal/AdaptiveModal.component.jsx";
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
import {
  Calendar,
  Trophy,
  Info,
  Target,
  CheckCircle2,
  Crown,
  Gift,
} from "lucide-react";

const Predictions = () => {
  const [partidos, setPartidos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [faseSeleccionada, setFaseSeleccionada] = useState("all");
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      openModal();
    }, 1000);
    return () => clearTimeout(timer);
  }, [openModal]);

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
    return partidos.filter(
      (partido) => String(partido.fase.id) === faseSeleccionada,
    );
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
            message:
              "No se pudieron cargar los datos. Por favor, intente de nuevo.",
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
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Flex align={"center"} direction={"column"} w={"100%"} pb={50}>
        <ContainerSection mb={20} px={{ base: 10, md: 20 }} pt={20}>
          <Flex align={"center"} direction={"column"} w={"100%"} gap={"lg"}>
            <Flex w={"100%"} justify={"flex-end"}>
              <ActionIcon
                variant="filled"
                size="lg"
                radius="md"
                style={{ backgroundColor: "#E31B23" }}
                onClick={openModal}
              >
                <Trophy size={20} />
              </ActionIcon>
            </Flex>

            {/* BANNER PRINCIPAL */}
            <Alert
              w={"100%"}
              style={{
                background:
                  "linear-gradient(135deg, #E31B23 0%, #0049AC 50%, #00A859 100%)",
                border: "none",
              }}
            >
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
                    style={{ animation: "spin 8s linear infinite" }}
                  />
                  <Flex
                    direction={"column"}
                    align={{ base: "center", sm: "flex-start" }}
                  >
                    <Text
                      c={"white"}
                      fw={850}
                      size={"2xl"}
                      style={{ letterSpacing: "1px" }}
                      ta={"center"}
                    >
                      QUINIELA MUNDIALISTA
                    </Text>
                    <Flex align={"center"} gap={5}>
                      <ThemeIcon
                        color="white"
                        variant={"transparent"}
                        size={"md"}
                      >
                        <Calendar size={18} />
                      </ThemeIcon>
                      <Text c={"white"} size="sm" fw={500}>
                        Del 11 de Junio al 19 de Julio, 2026
                      </Text>
                    </Flex>
                  </Flex>
                  <Image
                    alt={`Logo de balon del mundial`}
                    fit={"contain"}
                    h={100}
                    src={`${import.meta.env.BASE_URL}img/logo-icompras-white.webp`}
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

              <Grid columns={20} gutter={{ base: "md", md: "xl" }} grow mb="lg">
                {/* PUNTOS ACUMULADOS */}
                <Grid.Col span={{ base: 20, sm: 5, md: 4 }}>
                  <Card
                    h={"100%"}
                    shadow="xs"
                    p="md"
                    withBorder
                    style={{
                      background: "#FDEAEA",
                      borderLeft: "5px solid #E31B23",
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
                          <Text size="3xl" fw={900} c="#E31B23">
                            {estadisticas.puntos_acumulados} Pts
                          </Text>
                        )}
                      </Stack>
                      <ThemeIcon color="#E31B23" size="lg">
                        <Trophy size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xs" c="dimmed" mt="sm">
                      Suma total de aciertos de resultados
                    </Text>
                  </Card>
                </Grid.Col>

                {/* ACIERTOS EXACTOS */}
                <Grid.Col span={{ base: 20, sm: 5, md: 4 }}>
                  <Card
                    h={"100%"}
                    shadow="xs"
                    p="md"
                    withBorder
                    style={{
                      background: "#E8F0FA",
                      borderLeft: "5px solid #0049AC",
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
                          <Text size="3xl" fw={900} c="#0049AC">
                            {estadisticas.aciertos_exactos}
                          </Text>
                        )}
                      </Stack>
                      <ThemeIcon color="#0049AC" size="lg">
                        <Target size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xs" c="dimmed" mt="sm">
                      Marcadores exactos acertados (+3 Pts c/u)
                    </Text>
                  </Card>
                </Grid.Col>

                {/* ACIERTOS GANADOR */}
                <Grid.Col span={{ base: 20, sm: 5, md: 4 }}>
                  <Card
                    shadow="xs"
                    p="md"
                    h={"100%"}
                    withBorder
                    style={{
                      background: "#E8F5EA",
                      borderLeft: "5px solid #00A859",
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
                          <Text size="3xl" fw={900} c="#00A859">
                            {estadisticas.aciertos_simples}
                          </Text>
                        )}
                      </Stack>
                      <ThemeIcon color="#00A859" size="lg">
                        <CheckCircle2 size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xs" c="dimmed" mt="sm">
                      Ganador/Empate sin marcador exacto (+1 Pt)
                    </Text>
                  </Card>
                </Grid.Col>

                {/* EFECTIVIDAD */}
                <Grid.Col span={{ base: 20, sm: 5, md: 4 }}>
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

                {/* POSICIÓN */}
                <Grid.Col span={{ base: 20, sm: 5, md: 4 }}>
                  <Card
                    h={"100%"}
                    shadow="xs"
                    p="md"
                    withBorder
                    style={{
                      background:
                        "linear-gradient(135deg, #FDEAEA 0%, #E8F0FA 50%, #E8F5EA 100%)",
                      borderLeft: "5px solid #E31B23",
                    }}
                  >
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                          Posición
                        </Text>
                        {loading || !estadisticas ? (
                          <Skeleton height={36} width={60} />
                        ) : (
                          <Text size="3xl" fw={900} c="#E31B23">
                            {estadisticas.posicion} de{" "}
                            {estadisticas.total_participantes}
                          </Text>
                        )}
                      </Stack>
                      <ThemeIcon
                        size="lg"
                        style={{
                          background:
                            "linear-gradient(135deg, #E31B23 0%, #0049AC 50%, #00A859 100%)",
                        }}
                      >
                        <Crown size={20} color="white" />
                      </ThemeIcon>
                    </Group>
                    <Text size="xs" c="dimmed" mt="sm">
                      Ranking entre todos los participantes
                    </Text>
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
                    Por acertar el ganador (o empate), pero no el marcador
                    exacto.
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
                <Chip.Group
                  multiple={false}
                  value={faseSeleccionada}
                  onChange={setFaseSeleccionada}
                >
                  <Flex gap="xs" wrap="wrap">
                    <Chip color="red" variant="filled" value="all">
                      Todos
                    </Chip>
                    {fases.map((fase, index) => {
                      const colors = ["#E31B23", "#0049AC", "#00A859"];
                      const color = colors[index % colors.length];
                      return (
                        <Chip
                          color={color}
                          key={fase.id}
                          variant="filled"
                          value={fase.id}
                        >
                          {fase.nombre}
                        </Chip>
                      );
                    })}
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
                      Hubo un problema al cargar los partidos de la base de
                      datos.
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

      <AdaptiveModal
        opened={modalOpened}
        onClose={closeModal}
        size={"md"}
        title={
          <Flex align={"center"} gap={"xs"}>
            <Crown size={24} color="#E31B23" />
            <Text fw={700} size="lg">
              Premiación
            </Text>
          </Flex>
        }
        zIndex={1100}
      >
        <Stack gap="md">
          <Alert
            variant="light"
            color="blue"
            title="Top 1"
            icon={<Crown size={20} />}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text fw={600} size="lg" c="#0049AC">
                  3 Meses Gratis
                </Text>
                <Text size="sm" c="dimmed">
                  Suscripción gratuita para una farmacia
                </Text>
              </Stack>
              <Image
                alt="Canadá"
                src={`${import.meta.env.BASE_URL}img/usa.webp`}
                h={100}
                w={70}
                fit="contain"
              />
            </Group>
          </Alert>

          <Alert
            variant="light"
            color="red"
            title="Top 2"
            icon={<Gift size={20} />}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text fw={600} size="lg" c="#E31B23">
                  2 Meses Gratis
                </Text>
                <Text size="sm" c="dimmed">
                  Suscripción gratuita para una farmacia
                </Text>
              </Stack>
              <Image
                alt="USA"
                src={`${import.meta.env.BASE_URL}img/canada.webp`}
                h={100}
                w={70}
                fit="contain"
              />
            </Group>
          </Alert>

          <Alert
            variant="light"
            color="green"
            title="Top 3"
            icon={<Trophy size={20} />}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text fw={600} size="lg" c="#00A859">
                  1 Mes Gratis
                </Text>
                <Text size="sm" c="dimmed">
                  Suscripción gratuita para una farmacia
                </Text>
              </Stack>
              <Image
                alt="México"
                src={`${import.meta.env.BASE_URL}img/mexico.webp`}
                h={100}
                w={70}
                fit="contain"
              />
            </Group>
          </Alert>
        </Stack>
      </AdaptiveModal>
    </>
  );
};

export default Predictions;
