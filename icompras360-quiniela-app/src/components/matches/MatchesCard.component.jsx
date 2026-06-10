// REACT
import { useCallback, useState } from "react";
// MANTINE
import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  NumberInput,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// LUCIDE
import { Clock, Lock, MapPin, Save } from "lucide-react";
// SERVICES
import { guardarPronostico } from "@services/partidos/partidos.services";
// STORE
import { useUserStore } from "@store/user.store";
// UTILITIES
import {
  formatMatchDate,
  getFlagUrl,
  isMatchLocked,
} from "@utilities/matchesUtilities.utility.jsx";

export const MatchesCardSkeleton = () => {
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

export const MatchesCard = ({ data = {} }) => {
  const isLocked = isMatchLocked(data.fecha_hora_utc);
  const token = useUserStore((state) => state.token);

  // STATES
  const [pronostico, setPronostico] = useState({
    golesLocal: data.pronostico?.golesLocal ?? "",
    golesVisitante: data.pronostico?.golesVisitante ?? "",
  });

  // Calcula los puntos obtenidos comparando pronóstico con el marcador oficial
  const calcPuntos = () => {
    const hayResultado =
      data.goles_local != null && data.goles_visitante != null;
    const hayPronostico =
      pronostico.golesLocal !== "" && pronostico.golesVisitante !== "";
    if (!hayResultado || !hayPronostico) return null;

    const rLocal = Number(data.goles_local);
    const rVisitante = Number(data.goles_visitante);
    const pLocal = Number(pronostico.golesLocal);
    const pVisitante = Number(pronostico.golesVisitante);

    // +3: marcador exacto
    if (pLocal === rLocal && pVisitante === rVisitante) return 3;

    // Ganador real
    const ganadorReal =
      rLocal > rVisitante
        ? "local"
        : rVisitante > rLocal
          ? "visitante"
          : "empate";
    // Ganador pronosticado
    const ganadorPred =
      pLocal > pVisitante
        ? "local"
        : pVisitante > pLocal
          ? "visitante"
          : "empate";

    // +1: acertó el ganador o el empate
    if (ganadorReal === ganadorPred) return 1;

    return 0;
  };

  const puntos = calcPuntos();

  // FUNCTIONS

  const handlePredictionChange = useCallback(
    (team, val) => {
      setPronostico((prev) => {
        if (team === "local") {
          return { ...prev, golesLocal: val };
        } else {
          return { ...prev, golesVisitante: val };
        }
      });
      handleSavePrediction();
    },
    [data.id],
  );

  const handleSavePrediction = useDebouncedCallback(async () => {
    if (isLocked) return;
    if (pronostico.golesLocal == "" || pronostico.golesVisitante == "") {
      return;
    }
    const id = notifications.show({
      loading: true,
      title: "Guardando...",
      message: "Estamos guardando tu pronóstico",
      autoClose: false,
      allowClose: false,
    });

    try {
      await guardarPronostico(
        {
          partido_id: data.id,
          goles_local: pronostico.golesLocal,
          goles_visitante: pronostico.golesVisitante,
        },
        { authToken: token },
      );
      notifications.update({
        id,
        color: "success",
        title: "Pronóstico guardado",
        message: "Tu predicción fue registrada correctamente.",
        loading: false,
      });
    } catch (err) {
      console.log(err);
      notifications.update({
        id,
        color: "danger",
        title: "Error al guardar",
        message:
          err?.data?.message ||
          "No se pudo guardar el pronóstico. Intenta de nuevo.",
        loading: false,
      });
    }
  }, 1000);

  return (
    <Grid.Col span={{ base: 12, md: 6 }}>
      <Card
        withBorder
        p="lg"
        radius="md"
        shadow="sm"
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: isLocked ? "not-allowed" : "pointer",
          opacity: isLocked ? 0.85 : 1,
          backgroundColor: isLocked ? "var(--mantine-color-gray-0)" : undefined,
        }}
        className="match-card"
        onMouseEnter={(e) => {
          if (!isLocked) {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLocked) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
          }
        }}
      >
        {/* Header: Fase y Grupo */}
        <Group justify="space-between" mb="md">
          <Badge color="blue" variant="light" size="sm">
            {data.fase?.nombre || "Fase de Grupos"}
          </Badge>
          <Group gap={6}>
            {isLocked && (
              <Badge
                color="red"
                variant="filled"
                size="sm"
                leftSection={<Lock size={10} />}
              >
                Bloqueado
              </Badge>
            )}
            <Badge color="violet" variant="outline" size="sm">
              Grupo {data.grupo || "N/A"}
            </Badge>
          </Group>
        </Group>

        {/* Equipos y Predicción */}
        <Flex justify="space-between" align="center" py="sm" gap="xs">
          {/* Local */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            w="20%"
            gap="xs"
          >
            {data.local?.codigo_iso ? (
              <img
                src={getFlagUrl(data.local.codigo_iso)}
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

          {/* Inputs Quiniela */}
          <Flex direction="column" align="center" gap="sm" w="50%">
            <Group gap={8} justify="center" align="center">
              <NumberInput
                placeholder="-"
                w={50}
                min={0}
                max={99}
                size="md"
                hideControls
                value={pronostico.golesLocal}
                disabled={isLocked}
                onChange={(val) => handlePredictionChange("local", val)}
                styles={{
                  input: {
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
              />
              <Text fw={800} c="dimmed">
                VS
              </Text>
              <NumberInput
                placeholder="-"
                w={50}
                min={0}
                max={99}
                size="md"
                hideControls
                value={pronostico.golesVisitante}
                disabled={isLocked}
                onChange={(val) => handlePredictionChange("visitante", val)}
                styles={{
                  input: {
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                }}
              />
            </Group>
          </Flex>

          {/* Visitante */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            w="20%"
            gap="xs"
          >
            {data.visitante?.codigo_iso ? (
              <img
                src={getFlagUrl(data.visitante.codigo_iso)}
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

        {/* Marcador oficial del partido */}
        {data.goles_local != null && data.goles_visitante != null && (
          <>
            <Divider
              my="sm"
              label={
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                  Resultado oficial
                </Text>
              }
              labelPosition="center"
              style={{ opacity: 0.7 }}
            />
            <Flex justify="center" align="center" gap="md" mb="sm">
              <Text
                fw={900}
                size="2xl"
                c="primary"
                style={{
                  minWidth: "36px",
                  textAlign: "center",
                  letterSpacing: "2px",
                }}
              >
                {data.goles_local}
              </Text>
              <Text fw={700} c="dimmed" size="lg">
                -
              </Text>
              <Text
                fw={900}
                size="2xl"
                c="primary"
                style={{
                  minWidth: "36px",
                  textAlign: "center",
                  letterSpacing: "2px",
                }}
              >
                {data.goles_visitante}
              </Text>

              {/* Badge de puntos obtenidos */}
              {puntos != null && puntos > 0 && (
                <Badge
                  color={puntos === 3 ? "success" : "blue"}
                  variant="filled"
                  size="lg"
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    letterSpacing: "0.5px",
                  }}
                >
                  +{puntos}
                </Badge>
              )}
              {puntos === 0 && (
                <Badge
                  color="red"
                  variant="light"
                  size="lg"
                  style={{ fontSize: "14px", fontWeight: 700 }}
                >
                  +0
                </Badge>
              )}
            </Flex>
          </>
        )}

        <Divider my="md" style={{ opacity: 0.6 }} />

        {/* Footer: Fecha y Estadio */}
        <Stack gap={6}>
          <Group gap={6}>
            <Clock size={14} className="text-dimmed" />
            <Text size="xs" c="dimmed" fw={600}>
              {formatMatchDate(data.fecha_hora_utc)} (Hora Local)
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
      </Card>
    </Grid.Col>
  );
};
