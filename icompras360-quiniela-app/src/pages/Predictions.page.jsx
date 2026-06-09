// REACT
import { useState, useEffect } from "react";
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
  Stack,
  RingProgress,
  Badge,
  Skeleton,
  NumberInput,
  Button,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
// COMPONENTS
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
// SERVICES
import { getPartidosLista } from "@services/partidos/partidos.services";
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
} from "lucide-react";

const Predictions = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [predictions, setPredictions] = useState({});

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
            message: "No se pudieron cargar los partidos. Por favor, intente de nuevo.",
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

  const formatMatchDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString.replace(" ", "T") + "Z");
      return date.toLocaleString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return dateString;
    }
  };

  const getFlagUrl = (isoCode) => {
    if (!isoCode) return null;
    return `https://flagcdn.com/72x54/${isoCode.toLowerCase()}.webp`;
  };

  const handlePredictionChange = (matchId, team, val) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: val,
      },
    }));
  };

  const savePrediction = (matchId) => {
    const pred = predictions[matchId];
    if (pred?.local === undefined || pred?.visitante === undefined) {
      notifications.show({
        color: "yellow",
        title: "Atención",
        message: "Por favor, ingresa los goles para ambos equipos antes de guardar.",
      });
      return;
    }

    notifications.show({
      color: "success",
      title: "Predicción Guardada",
      message: `Predicción para el partido ID ${matchId}: ${pred.local} - ${pred.visitante}`,
    });
  };

  return (
    <Flex align={"center"} direction={"column"} w={"100%"} pb={50}>
      <ContainerSection mb={20} px={{ base: 10, md: 20 }} pt={20}>
        <Flex align={"center"} direction={"column"} w={"100%"} gap={"lg"}>
          {/* BANNER PRINCIPAL */}
          <Alert color={"yellow"} w={"100%"}>
            <Flex
              align={"center"}
              gap={15}
              justify={"center"}
              direction={{ base: "column", sm: "row" }}
              py={10}
            >
              <ThemeIcon color="yellow" variant={"transparent"} size={60}>
                <Trophy size={60} />
              </ThemeIcon>
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
                  QUINIELA ICOMPRAS360 2026
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
              <Sparkles size={20} /> Mi Rendimiento en la Quiniela
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
              <List size="sm" withPadding>
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

            {loading ? (
              <Grid gutter="md">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid.Col key={i} span={{ base: 12, md: 6 }}>
                    <Card withBorder p="xl" radius="md">
                      <Skeleton height={20} width="30%" radius="xl" mb="md" />
                      <Flex justify="space-between" align="center" my="lg">
                        <Skeleton height={40} circle />
                        <Skeleton height={30} width="40%" />
                        <Skeleton height={40} circle />
                      </Flex>
                      <Skeleton height={15} width="60%" radius="xl" mt="md" />
                      <Skeleton height={15} width="50%" radius="xl" mt="xs" />
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : error ? (
              <Alert color="danger" title="Error de conexión">
                Hubo un problema al cargar los partidos de la base de datos.
              </Alert>
            ) : partidos.length === 0 ? (
              <Alert color="blue" title="Sin partidos">
                No hay partidos disponibles en este momento.
              </Alert>
            ) : (
              <Grid gutter="lg">
                {partidos.map((partido) => {
                  const currentPred = predictions[partido.id] || {};
                  return (
                    <Grid.Col key={partido.id} span={{ base: 12, md: 6 }}>
                      <Card
                        withBorder
                        p="lg"
                        radius="md"
                        shadow="sm"
                        style={{
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          cursor: "pointer",
                        }}
                        className="match-card"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
                        }}
                      >
                        {/* Header: Fase y Grupo */}
                        <Group justify="space-between" mb="md">
                          <Badge color="blue" variant="light" size="sm">
                            {partido.fase?.nombre || "Fase de Grupos"}
                          </Badge>
                          <Badge color="violet" variant="outline" size="sm">
                            Grupo {partido.grupo || "N/A"}
                          </Badge>
                        </Group>

                        {/* Equipos y Predicción */}
                        <Flex justify="space-between" align="center" py="sm" gap="xs">
                          {/* Local */}
                          <Flex direction="column" align="center" justify="center" w="35%" gap="xs">
                            {partido.local?.codigo_iso ? (
                              <img
                                src={getFlagUrl(partido.local.codigo_iso)}
                                alt={partido.local.nombre}
                                style={{
                                  width: "48px",
                                  height: "36px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                                  border: "1px solid rgba(0,0,0,0.1)",
                                }}
                              />
                            ) : (
                              <Text size="3xl" style={{ lineHeight: 1 }}>
                                {partido.local?.bandera_icono || "🏳️"}
                              </Text>
                            )}
                            <Text fw={750} ta="center" size="sm" style={{ minHeight: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {partido.local?.nombre || "Equipo Local"}
                            </Text>
                            <Badge color="gray" variant="dot">
                              {partido.local?.codigo_fifa}
                            </Badge>
                          </Flex>

                          {/* Inputs Quiniela */}
                          <Flex direction="column" align="center" gap="sm" w="30%">
                            <Group gap={8} justify="center" align="center">
                              <NumberInput
                                placeholder="-"
                                w={50}
                                min={0}
                                max={99}
                                size="sm"
                                hideControls
                                value={currentPred.local}
                                onChange={(val) => handlePredictionChange(partido.id, "local", val)}
                                styles={{ input: { textAlign: "center", fontWeight: "bold" } }}
                              />
                              <Text fw={800} c="dimmed">
                                VS
                              </Text>
                              <NumberInput
                                placeholder="-"
                                w={50}
                                min={0}
                                max={99}
                                size="sm"
                                hideControls
                                value={currentPred.visitante}
                                onChange={(val) => handlePredictionChange(partido.id, "visitante", val)}
                                styles={{ input: { textAlign: "center", fontWeight: "bold" } }}
                              />
                            </Group>
                            <Button
                              variant="light"
                              color="blue"
                              size="xs"
                              leftSection={<Save size={14} />}
                              onClick={() => savePrediction(partido.id)}
                            >
                              Guardar
                            </Button>
                          </Flex>

                          {/* Visitante */}
                          <Flex direction="column" align="center" justify="center" w="35%" gap="xs">
                            {partido.visitante?.codigo_iso ? (
                              <img
                                src={getFlagUrl(partido.visitante.codigo_iso)}
                                alt={partido.visitante.nombre}
                                style={{
                                  width: "48px",
                                  height: "36px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                                  border: "1px solid rgba(0,0,0,0.1)",
                                }}
                              />
                            ) : (
                              <Text size="3xl" style={{ lineHeight: 1 }}>
                                {partido.visitante?.bandera_icono || "🏳️"}
                              </Text>
                            )}
                            <Text fw={750} ta="center" size="sm" style={{ minHeight: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {partido.visitante?.nombre || "Equipo Visitante"}
                            </Text>
                            <Badge color="gray" variant="dot">
                              {partido.visitante?.codigo_fifa}
                            </Badge>
                          </Flex>
                        </Flex>

                        <Divider my="md" style={{ opacity: 0.6 }} />

                        {/* Footer: Fecha y Estadio */}
                        <Stack gap={6}>
                          <Group gap={6}>
                            <Clock size={14} className="text-dimmed" />
                            <Text size="xs" c="dimmed" fw={600}>
                              {formatMatchDate(partido.fecha_hora_utc)} (Hora Local)
                            </Text>
                          </Group>
                          <Group gap={6} align="flex-start" wrap="nowrap">
                            <MapPin size={14} className="text-dimmed" style={{ marginTop: "2px" }} />
                            <Text size="xs" c="dimmed" fw={500} style={{ wordBreak: "break-word" }}>
                              {partido.estadio_completo || "Estadio por confirmar"}
                            </Text>
                          </Group>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  );
                })}
              </Grid>
            )}
          </Flex>
        </Flex>
      </ContainerSection>
    </Flex>
  );
};

export default Predictions;

