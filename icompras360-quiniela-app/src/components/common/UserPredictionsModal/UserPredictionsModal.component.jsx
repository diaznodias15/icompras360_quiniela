// REACT
import { useMemo, useState } from "react";
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
  Chip,
} from "@mantine/core";
// LUCIDE
import { Clock, MapPin, Eye, Lock } from "lucide-react";
// UTILITIES
import {
  formatMatchDate,
  getFlagUrl,
  isMatchLocked,
} from "@utilities/matchesUtilities.utility.jsx";

export const UserPredictionsCardSkeleton = () => {
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

export const UserPredictionsCard = ({ data = {}, isReadOnly = false }) => {
  const isLocked = isMatchLocked(data.fecha_hora_utc);

  const pronostico = {
    golesLocal: data.pronostico?.golesLocal ?? "",
    golesVisitante: data.pronostico?.golesVisitante ?? "",
  };

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

    if (pLocal === rLocal && pVisitante === rVisitante) return 3;

    const ganadorReal =
      rLocal > rVisitante
        ? "local"
        : rVisitante > rLocal
          ? "visitante"
          : "empate";
    const ganadorPred =
      pLocal > pVisitante
        ? "local"
        : pVisitante > pLocal
          ? "visitante"
          : "empate";

    if (ganadorReal === ganadorPred) return 1;

    return 0;
  };

  const puntos = calcPuntos();

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
          opacity: isLocked ? 0.85 : 1,
          backgroundColor: isLocked
            ? "var(--mantine-color-gray-0)"
            : undefined,
        }}
      >
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

          <Flex direction="column" align="center" gap="sm" w="50%">
            <Group gap={8} justify="center" align="center">
              <Text
                fw={800}
                size="xl"
                c={pronostico.golesLocal !== "" ? "primary" : "dimmed"}
                style={{
                  minWidth: "40px",
                  textAlign: "center",
                  letterSpacing: "2px",
                }}
              >
                {pronostico.golesLocal !== ""
                  ? pronostico.golesLocal
                  : "-"}
              </Text>
              <Text fw={700} c="dimmed" size="lg">
                VS
              </Text>
              <Text
                fw={800}
                size="xl"
                c={pronostico.golesVisitante !== "" ? "primary" : "dimmed"}
                style={{
                  minWidth: "40px",
                  textAlign: "center",
                  letterSpacing: "2px",
                }}
              >
                {pronostico.golesVisitante !== ""
                  ? pronostico.golesVisitante
                  : "-"}
              </Text>
            </Group>
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

export const UserPredictionsModalContent = ({
  userData,
  predictions,
  loading,
  error,
  faseSeleccionada,
  onFaseChange,
  fases,
}) => {
  const skeletonCards = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => (
      <UserPredictionsCardSkeleton key={i} />
    ));
  }, []);

  const predictionsCards = useMemo(() => {
    return predictions.map((partido) => (
      <UserPredictionsCard key={partido.id} data={partido} isReadOnly={true} />
    ));
  }, [predictions]);

  const filteredPredictions = useMemo(() => {
    if (faseSeleccionada === "all") return predictions;
    return predictions.filter(
      (partido) => String(partido.fase?.id) === faseSeleccionada
    );
  }, [predictions, faseSeleccionada]);

  return (
    <Stack gap="md" w="100%">
      <Card bg={"section"} withBorder p="md">
        <Group gap="md">
          <Badge color="red" variant="filled" size="lg">
            {userData.name}
          </Badge>
          <Text size="sm" c="dimmed">
            {userData.email}
          </Text>
        </Group>
      </Card>

      {fases.length > 0 && (
        <Chip.Group
          multiple={false}
          value={faseSeleccionada}
          onChange={onFaseChange}
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
              Error al cargar las predicciones
            </Text>
          </Grid.Col>
        ) : filteredPredictions.length === 0 ? (
          <Grid.Col span={12}>
            <Text c="dimmed" ta="center">
              No hay predicciones para esta fase
            </Text>
          </Grid.Col>
        ) : (
          filteredPredictions.map((partido) => (
            <UserPredictionsCard
              key={partido.id}
              data={partido}
              isReadOnly={true}
            />
          ))
        )}
      </Grid>
    </Stack>
  );
};