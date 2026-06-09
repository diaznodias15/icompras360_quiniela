export const queryParams = (params) => {
  return Object.keys(params)
    .filter((key) => params[key] !== null && params[key] !== "") // Filtrar parámetros que no son null ni cadenas vacías
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};
