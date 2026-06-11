/**
 * Adapter to transform user predictions data from the API format to the application format.
 * Same structure as partidosAdapter since the endpoint returns the same format.
 * @param {Object} response - The API response containing user predictions data.
 * @returns {Array} List of adapted predictions (matches with user's predictions).
 */
export const userPredictionsAdapter = (response) => {
  const data = response?.data || [];
  return data.map((partido) => ({
    id: partido.id,
    estado: partido.estado ?? "Programado",
    goles_local: partido?.goles_local,
    goles_visitante: partido?.goles_visitante,
    fase: {
      id: partido.fase?.id,
      nombre: partido.fase?.nombre,
    },
    grupo: partido.grupo,
    fecha_hora_utc: partido.fecha_hora_utc,
    estadio_completo: partido.estadio_completo,
    local: {
      id: partido.local?.id,
      nombre: partido.local?.nombre,
      codigo_fifa: partido.local?.codigo_fifa,
      codigo_iso: partido.local?.codigo_iso,
      bandera_icono: partido.local?.bandera_icono,
      placeholder: partido.local?.placeholder,
    },
    visitante: {
      id: partido.visitante?.id,
      nombre: partido.visitante?.nombre,
      codigo_fifa: partido.visitante?.codigo_fifa,
      codigo_iso: partido.visitante?.codigo_iso,
      bandera_icono: partido.visitante?.bandera_icono,
      placeholder: partido.visitante?.placeholder,
    },
    pronostico: {
      golesLocal: partido.mi_pronostico?.goles_local ?? "",
      golesVisitante: partido.mi_pronostico?.goles_visitante ?? "",
    },
    pais: partido.pais,
  }));
};
