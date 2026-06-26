export const isMatchLocked = (dateString) => {
  if (!dateString) return true;
  try {
    const matchTime = new Date(dateString.replace(" ", "T") + "Z").getTime();
    const currentTime = Date.now();
    const thirtyMinutesInMs = 30 * 60 * 1000;
    return currentTime >= matchTime - thirtyMinutesInMs;
  } catch (e) {
    return true;
  }
};

export const getFlagUrl = (isoCode) => {
  if (!isoCode) return null;
  return `https://flagcdn.com/72x54/${isoCode.toLowerCase()}.webp`;
};

export const formatMatchDate = (dateString) => {
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

export const isTeamPlaceholder = (team) => {
  if (team == null) return true;
  const codigoIso = team.codigo_iso;
  return codigoIso == null || String(codigoIso).trim() === "";
};

export const getPlaceholderName = (team, side) => {
  if (!isTeamPlaceholder(team)) return null;
  return side === "visitante" ? "Equipo Visitante" : "Equipo Local";
};

export const getPlaceholderOrigin = (team) => {
  if (!isTeamPlaceholder(team)) return null;
  return String(team.placeholder).trim();
};

export const canPredict = (match) => {
  if (!match) return false;
  return !isTeamPlaceholder(match.local) && !isTeamPlaceholder(match.visitante);
};
