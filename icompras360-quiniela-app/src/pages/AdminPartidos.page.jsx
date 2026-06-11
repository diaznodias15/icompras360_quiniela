// REACT
import { useEffect, useState, useMemo } from "react";
// MANTINE
import {
  Badge,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Button,
  Chip,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDebouncedCallback } from "@mantine/hooks";
import { ContainerSection } from "@components/common/ContainerSection/ContainerSection.component.jsx";
import { AdaptiveModal } from "@components/common/AdaptiveModal/AdaptiveModal.component.jsx";
import {
  getAdminPartidosLista,
  updatePartidoResultado,
} from "@services/partidos/adminPartidos.services";
import { useUserStore } from "@store/user.store";
import {
  Trophy,
  Calendar,
  MapPin,
  Save,
  Edit,
  Clock,
  Lock,
  CheckCircle,
  PlayCircle,
  Flag,
} from "lucide-react";

const ESTADOS_DISPONIBLES = [
  { value: "Programado", label: "Programado", color: "gray" },
  { value: "En progreso", label: "En progreso", color: "yellow" },
  { value: "Finalizado", label: "Finalizado", color: "green" },
];

const getEstadoColor = (estado) => {
  switch (estado) {
    case "Programado":
      return "gray";
    case "En progreso":
      return "yellow";
    case "Finalizado":
      return "green";
    default:
      return "gray";
  }
};

const getEstadoIcon = (estado) => {
  switch (estado) {
    case "Programado":
      return <Clock size={14} />;
    case "En progreso":
      return <PlayCircle size={14} />;
    case "Finalizado":
      return <CheckCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

export const AdminPartidosCardSkeleton = () => {
  return (
    <Grid.Col span={{ base: 12, md: 6 }}>
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
  );
};

export const AdminPartidosCard = ({ data = {}, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localGoles, setLocalGoles] = useState(data.goles_local ?? "");
  const [visitanteGoles, setVisitanteGoles] = useState(
    data.goles_visitante ?? "",
  );
  const [estado, setEstado] = useState(data.estado ?? "Programado");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useDebouncedCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await onUpdate({
        partido_id: data.id,
        goles_local: localGoles === "" ? null : parseInt(localGoles, 10),
        goles_visitante:
          visitanteGoles === "" ? null : parseInt(visitanteGoles, 10),
        estado: estado,
      });
      setIsEditing(false);
    } catch (err) {
      notifications.show({
        color: "danger",
        title: "Error",
        message: "No se pudo actualizar el partido.",
      });
    } finally {
      setIsSaving(false);
    }
  }, 500);

  return (
    <Grid.Col span={{ base: 12, md: 6 }}>
      <Card
        bg={"section"}
        withBorder
        h={"100%"}
        p="lg"
        radius="md"
        shadow="sm"
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <Group justify="space-between" mb="md">
          <Badge color="blue" variant="light" size="sm">
            {data.fase?.nombre || "Fase de Grupos"}
          </Badge>
          <Group gap={6}>
            <Badge
              color={getEstadoColor(estado)}
              variant="filled"
              size="sm"
              leftSection={getEstadoIcon(estado)}
            >
              {estado}
            </Badge>
            <Badge color="violet" variant="outline" size="sm">
              Grupo {data.grupo || "N/A"}
            </Badge>
          </Group>
        </Group>

        <Flex justify="space-between" align="center" py="sm" gap="xs">
          <Flex
            direction="column"
            align="center"
            justify="center"
            w="20%"
            gap="xs"
          >
            {data.local?.codigo_iso ? (
              <img
                src={`https://flagcdn.com/w40/${data.local.codigo_iso.toLowerCase()}.png`}
                alt={data.local.nombre}
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
                {data.local?.bandera_icono || "🏳️"}
              </Text>
            )}
            <Text
              fw={750}
              ta="center"
              size="sm"
              style={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {data.local?.nombre || "Equipo Local"}
            </Text>
            <Badge color="gray" variant="dot">
              {data.local?.codigo_fifa}
            </Badge>
          </Flex>

          <Flex direction="column" align="center" gap="sm" w="50%">
            {isEditing ? (
              <Group gap={8} justify="center" align="center">
                <NumberInput
                  placeholder="-"
                  w={50}
                  size="md"
                  value={localGoles}
                  hideControls={true}
                  min={0}
                  max={99}
                  onChange={(val) => setLocalGoles(val)}
                  styles={{
                    input: {
                      textAlign: "center",
                      fontWeight: "bold",
                      height: "40px",
                    },
                  }}
                />
                <Text fw={700} c="dimmed" size="lg">
                  VS
                </Text>
                <NumberInput
                  placeholder="-"
                  w={50}
                  size="md"
                  value={visitanteGoles}
                  hideControls={true}
                  min={0}
                  max={99}
                  onChange={(val) => setVisitanteGoles(val)}
                  styles={{
                    input: {
                      textAlign: "center",
                      fontWeight: "bold",
                      height: "40px",
                    },
                  }}
                />
              </Group>
            ) : (
              <Group gap={8} justify="center" align="center">
                <Text
                  fw={800}
                  size="2xl"
                  c={data.goles_local != null ? "primary" : "dimmed"}
                  style={{
                    minWidth: "40px",
                    textAlign: "center",
                    letterSpacing: "2px",
                  }}
                >
                  {data.goles_local != null ? data.goles_local : "-"}
                </Text>
                <Text fw={700} c="dimmed" size="lg">
                  -
                </Text>
                <Text
                  fw={800}
                  size="2xl"
                  c={data.goles_visitante != null ? "primary" : "dimmed"}
                  style={{
                    minWidth: "40px",
                    textAlign: "center",
                    letterSpacing: "2px",
                  }}
                >
                  {data.goles_visitante != null ? data.goles_visitante : "-"}
                </Text>
              </Group>
            )}

            {isEditing && (
              <Select
                size="xs"
                data={ESTADOS_DISPONIBLES}
                value={estado}
                onChange={setEstado}
                style={{ width: "100%" }}
              />
            )}
          </Flex>

          <Flex
            direction="column"
            align="center"
            justify="center"
            w="20%"
            gap="xs"
          >
            {data.visitante?.codigo_iso ? (
              <img
                src={`https://flagcdn.com/w40/${data.visitante.codigo_iso.toLowerCase()}.png`}
                alt={data.visitante.nombre}
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
                {data.visitante?.bandera_icono || "🏳️"}
              </Text>
            )}
            <Text
              fw={750}
              ta="center"
              size="sm"
              style={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {data.visitante?.nombre || "Equipo Visitante"}
            </Text>
            <Badge color="gray" variant="dot">
              {data.visitante?.codigo_fifa}
            </Badge>
          </Flex>
        </Flex>

        <Divider my="md" style={{ opacity: 0.6 }} />

        <Flex justify="space-between" align="flex-start">
          <Stack gap={6}>
            <Group gap={6}>
              <Clock size={14} className="text-dimmed" />
              <Text size="xs" c="dimmed" fw={600}>
                {new Date(data.fecha_hora_utc).toLocaleString("es-ES")}
              </Text>
            </Group>
            <Group gap={6} align="flex-start" wrap="nowrap">
              <MapPin
                size={14}
                className="text-dimmed"
                style={{ marginTop: "2px" }}
              />
              <Text
                size="xs"
                c="dimmed"
                fw={500}
                style={{ wordBreak: "break-word" }}
              >
                {data.estadio_completo || "Estadio por confirmar"}
              </Text>
            </Group>
          </Stack>

          <Button
            variant={isEditing ? "filled" : "light"}
            color={isEditing ? "green" : "blue"}
            size="xs"
            leftSection={isEditing ? <Save size={14} /> : <Edit size={14} />}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            loading={isSaving}
          >
            {isEditing ? "Guardar" : "Editar"}
          </Button>
        </Flex>
      </Card>
    </Grid.Col>
  );
};

const AdminPartidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [faseSeleccionada, setFaseSeleccionada] = useState("all");

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    const fetchPartidos = async () => {
      try {
        setLoading(true);
        const data = await getAdminPartidosLista({ authToken: token });
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
            message: "No se pudieron cargar los partidos.",
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

  const handleUpdate = async (updateData) => {
    const id = notifications.show({
      loading: true,
      title: "Guardando...",
      message: "Actualizando resultado del partido",
      allowClose: false,
    });

    try {
      await updatePartidoResultado(updateData, { authToken: token });
      notifications.update({
        id,
        color: "success",
        title: "Actualizado",
        message: "El resultado del partido fue actualizado correctamente.",
        loading: false,
        autoClose: 3000,
      });

      setPartidos((prev) =>
        prev.map((p) =>
          p.id === updateData.partido_id
            ? {
                ...p,
                goles_local: updateData.goles_local,
                goles_visitante: updateData.goles_visitante,
                estado: updateData.estado,
              }
            : p,
        ),
      );
    } catch (err) {
      notifications.update({
        id,
        color: "danger",
        title: "Error",
        message: err?.data?.message || "No se pudo actualizar el partido.",
        loading: false,
      });
      throw err;
    }
  };

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
      (partido) => String(partido.fase?.id) === faseSeleccionada,
    );
  }, [partidos, faseSeleccionada]);

  const skeletonCards = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => (
      <AdminPartidosCardSkeleton key={i} />
    ));
  }, []);

  const partidoCards = useMemo(() => {
    return partidosFiltrados.map((partido) => (
      <AdminPartidosCard
        key={partido.id}
        data={partido}
        onUpdate={handleUpdate}
      />
    ));
  }, [partidosFiltrados, handleUpdate]);

  return (
    <Flex align={"center"} direction={"column"} w={"100%"} pb={50}>
      <ContainerSection mb={20} px={{ base: 10, md: 20 }} pt={20}>
        <Stack gap="md" w={"100%"}>
          <Card shadow="md" withBorder p="lg" bg={"section"}>
            <Flex align={"center"} justify={"space-between"} mb="md">
              <Group gap="xs">
                <ThemeIcon color="red" size="lg" variant="filled" radius="md">
                  <Trophy size={20} />
                </ThemeIcon>
                <Text fw={800} size="xl" c="primary">
                  Administración de Partidos
                </Text>
              </Group>
              <Badge color="red" variant="filled" size="lg">
                {partidosFiltrados.length} Partidos
              </Badge>
            </Flex>

            {fases.length > 0 && (
              <Chip.Group
                multiple={false}
                value={faseSeleccionada}
                onChange={setFaseSeleccionada}
                mb="md"
              >
                <Flex gap="xs" wrap="wrap">
                  <Chip color="red" variant="filled" value="all">
                    Todos
                  </Chip>
                  {fases.map((fase, index) => {
                    const colors = ["#E31B23", "#0049AC", "#00A859"];
                    const color = colors[index % colors.length];
                    return (
                      <Chip key={fase.id} variant="filled" value={fase.id}>
                        {fase.nombre}
                      </Chip>
                    );
                  })}
                </Flex>
              </Chip.Group>
            )}

            <Grid gap="lg">
              {loading ? (
                skeletonCards
              ) : error ? (
                <Grid.Col span={12}>
                  <Text c="danger" ta="center" fw={600}>
                    Error al cargar los partidos
                  </Text>
                </Grid.Col>
              ) : partidosFiltrados.length === 0 ? (
                <Grid.Col span={12}>
                  <Text c="dimmed" ta="center">
                    No hay partidos disponibles
                  </Text>
                </Grid.Col>
              ) : (
                partidoCards
              )}
            </Grid>
          </Card>
        </Stack>
      </ContainerSection>
    </Flex>
  );
};

export default AdminPartidos;
