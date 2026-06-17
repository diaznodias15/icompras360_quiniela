export const rankingAdapter = (response) => {
  const data = response?.data || response;
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    puntos_acumulados: item.puntos_acumulados ?? 0,
    puntos_posibles: item.puntos_posibles ?? 0,
    aciertos_exactos: item.aciertos_exactos ?? 0,
    aciertos_simples: item.aciertos_simples ?? 0,
    porcentaje_prediccion: item.porcentaje_prediccion ?? "0.00",
    eficiencia: item.eficiencia ?? 0,
    posicion: item.posicion ?? 0,
    pronosticos_count: item.pronosticos_count ?? 0,
  }));
};