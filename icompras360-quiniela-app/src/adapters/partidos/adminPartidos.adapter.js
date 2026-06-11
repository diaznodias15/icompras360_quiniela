/**
 * Adapter to transform admin matches list data from the API format to the application format.
 * @param {Object} response - The API response containing admin match data.
 * @returns {Array} List of adapted admin matches.
 */
export const adminPartidosAdapter = (response) => {
  const data = response?.data || [];
  return data.map((partido) => ({
    id: partido.id,
    goles_local: partido?.goles_local ?? null,
    goles_visitante: partido?.goles_visitante ?? null,
    estado: partido.estado ?? "Programado",
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
    pais: partido.pais,
  }));
};
