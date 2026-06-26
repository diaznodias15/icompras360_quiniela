// REACT
import { useCallback, useState } from "react";
// MANTINE
import {
  Badge,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// LUCIDE
import { Clock, Lock, MapPin, AlertCircle, Hourglass } from "lucide-react";
// SERVICES
import { guardarPronostico } from "@services/partidos/partidos.services";
// STORE
import { useUserStore } from "@store/user.store";
// UTILITIES
import {
  canPredict,
  formatMatchDate,
  getFlagUrl,
  getPlaceholderName,
  getPlaceholderOrigin,
  isMatchLocked,
  isTeamPlaceholder,
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

const TeamDisplay = ({ team, side }) => {
  const isPlaceholder = isTeamPlaceholder(team);
  const placeholderName = getPlaceholderName(team, side);
  const placeholderOrigin = getPlaceholderOrigin(team);

  if (isPlaceholder) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="20%"
        gap="xs"
      >
        <ThemeIcon
          variant="light"
          color="gray"
          size={48}
          radius="md"
          style={{ opacity: 0.85 }}
        >
          <Hourglass size={22} />
        </ThemeIcon>
        <Text
          fw={750}
          ta="center"
          size="sm"
          c="dimmed"
          fs="italic"
          style={{
            minHeight: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {placeholderName}
        </Text>
        {placeholderOrigin && (
          <Text size="2xs" c="dimmed" ta="center" fw={600}>
            Origen: {placeholderOrigin}
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" justify="center" w="20%" gap="xs">
      {team?.codigo_iso ? (
        <img
          src={getFlagUrl(team.codigo_iso)}
          alt={team.nombre}
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
          {team?.bandera_icono || "🏳️"}
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
        {team?.nombre || (side === "visitante" ? "Equipo Visitante" : "Equipo Local")}
      </Text>
      <Badge color="gray" variant="dot">
        {team?.codigo_fifa}
      </Badge>
    </Flex>
  );
};

export const MatchesCard = ({ data = {} }) => {
  const isLocked = isMatchLocked(data.fecha_hora_utc);
  const token = useUserStore((state) => state.token);
  const estado = data.estado || "Programado";
  const isFinalizado = estado === "Finalizado";

  const localIsPlaceholder = isTeamPlaceholder(data.local);
  const visitanteIsPlaceholder = isTeamPlaceholder(data.visitante);
  const canPredictMatch = canPredict(data);
  const hasPlaceholderTeam = localIsPlaceholder || visitanteIsPlaceholder;

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
      const stringVal =
        val === "" || val === null || val === undefined ? "" : String(val);
      setPronostico((prev) => {
        if (team === "local") {
          return { ...prev, golesLocal: stringVal };
        } else {
          return { ...prev, golesVisitante: stringVal };
        }
      });
      handleSavePrediction();
    },
    [data.id],
  );

  const handleSavePrediction = useDebouncedCallback(async () => {
    if (isLocked) return;
    if (!canPredictMatch) return;
    if (pronostico.golesLocal === "" || pronostico.golesVisitante === "") {
      return;
    }
    const id = notifications.show({
      loading: true,
      title: "Guardando...",
      message: "Estamos guardando tu pronóstico",
      allowClose: false,
    });

    try {
      await guardarPronostico(
        {
          partido_id: data.id,
          goles_local: parseInt(pronostico.golesLocal, 10) || 0,
          goles_visitante: parseInt(pronostico.golesVisitante, 10) || 0,
        },
        { authToken: token },
      );
      notifications.update({
        id,
        color: "success",
        title: "Pronóstico guardado",
        message: "Tu predicción fue registrada correctamente.",
        loading: false,
        autoClose: 3000,
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
        bg={"section"}
        withBorder
        h={"100%"}
        p="lg"
        radius="md"
        shadow="sm"
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: isLocked || !canPredictMatch ? "not-allowed" : "pointer",
          opacity: isLocked || !canPredictMatch ? 0.7 : 1,
          backgroundColor:
            isLocked || !canPredictMatch
              ? "var(--mantine-color-gray-0)"
              : undefined,
        }}
        className="match-card"
        onMouseEnter={(e) => {
          if (!isLocked && canPredictMatch) {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLocked && canPredictMatch) {
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
            <Badge
              color={
                estado === "Finalizado"
                  ? "green"
                  : estado === "En progreso"
                    ? "yellow"
                    : "gray"
              }
              variant={estado === "Finalizado" ? "filled" : "light"}
              size="sm"
            >
              {estado}
            </Badge>
            {hasPlaceholderTeam && (
              <Badge
                color="orange"
                variant="light"
                size="sm"
                leftSection={<Hourglass size={10} />}
              >
                Pendiente
              </Badge>
            )}
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
            {data.fase?.id === 1 && (
              <Badge color="violet" variant="outline" size="sm">
                Grupo {data.grupo || "N/A"}
              </Badge>
            )}
          </Group>
        </Group>

        {/* Equipos y Predicción */}
        <Flex justify="space-between" align="center" py="sm" gap="xs">
          {/* Local */}
          <TeamDisplay team={data.local} side="local" />

          {/* Inputs Quiniela */}
          <Flex direction="column" align="center" gap="sm" w="50%">
            {!isLocked &&
              canPredictMatch &&
              pronostico.golesLocal === "" &&
              pronostico.golesVisitante === "" && (
                <Text size="xs" c="primary" fs="italic" mb={4}>
                  Coloca aquí tu predicción
                </Text>
              )}
            {hasPlaceholderTeam && (
              <Text size="xs" c="orange" fs="italic" mb={4} ta="center">
                Esperando confirmación de equipos
              </Text>
            )}
            <Group gap={8} justify="center" align="center">
              <TextInput
                placeholder="-"
                w={50}
                size="md"
                value={pronostico.golesLocal}
                disabled={isLocked || !canPredictMatch}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                  handlePredictionChange("local", val);
                }}
                styles={{
                  input: {
                    textAlign: "center",
                    fontWeight: "bold",
                    height: "40px",
                  },
                }}
              />
              <Text fw={800} c="dimmed">
                VS
              </Text>
              <TextInput
                placeholder="-"
                w={50}
                size="md"
                value={pronostico.golesVisitante}
                disabled={isLocked || !canPredictMatch}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                  handlePredictionChange("visitante", val);
                }}
                styles={{
                  input: {
                    textAlign: "center",
                    fontWeight: "bold",
                    height: "40px",
                  },
                }}
              />
            </Group>
          </Flex>

          {/* Visitante */}
          <TeamDisplay team={data.visitante} side="visitante" />
        </Flex>

        {/* Marcador oficial del partido */}
        {data.goles_local != null && data.goles_visitante != null && (
          <>
            <Divider
              my="sm"
              label={
                <Text
                  size="xs"
                  c={isFinalizado ? "green" : "yellow"}
                  fw={600}
                  tt="uppercase"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {!isFinalizado && <AlertCircle size={12} />}
                  {isFinalizado ? "Resultado oficial" : "Resultado temporal"}
                </Text>
              }
              labelPosition="center"
              style={{ opacity: 0.7 }}
            />
            <Flex justify="center" align="center" gap="md" mb="sm">
              <Text
                fw={900}
                size="2xl"
                c={isFinalizado ? "primary" : "yellow"}
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
                c={isFinalizado ? "primary" : "yellow"}
                style={{
                  minWidth: "36px",
                  textAlign: "center",
                  letterSpacing: "2px",
                }}
              >
                {data.goles_visitante}
              </Text>

              {/* Badge de puntos obtenidos - Solo mostrar si está finalizado */}
              {isFinalizado && puntos != null && puntos > 0 && (
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
              {isFinalizado && puntos === 0 && (
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

        {/* Footer: Fecha, Estadio y País */}
        <Flex justify="space-between" align="flex-start">
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
          {data.pais && (
            <Image
              alt={data.pais}
              src={`${import.meta.env.BASE_URL}img/${data.pais}.webp`}
              h={70}
              w={70}
              fit="contain"
            />
          )}
        </Flex>
      </Card>
    </Grid.Col>
  );
};
