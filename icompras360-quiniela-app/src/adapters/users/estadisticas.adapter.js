export const estadisticasAdapter = (response) => {
  const data = response?.data || response;
  return {
    puntos_acumulados: data?.puntos_acumulados ?? 0,
    aciertos_exactos: data?.aciertos_exactos ?? 0,
    aciertos_simples: data?.aciertos_simples ?? 0,
    porcentaje_prediccion: data?.porcentaje_prediccion ?? 0,
  };
};