import axios from "axios";

// Mapas para rastrear solicitudes en curso e historial de solicitudes
const ongoingRequests = new Map();
const requestHistory = new Map();

/**
 * Realiza una solicitud HTTP con reintentos en caso de fallo, soportando carga y descarga de archivos.
 * @param {Object} params - Parámetros de configuración para la solicitud.
 * @param {string} params.url - URL de la solicitud (relativa al API base).
 * @param {string} [params.method='GET'] - Método HTTP de la solicitud.
 * @param {number} [params.maxRetries=3] - Número máximo de reintentos en caso de fallo.
 * @param {string} [params.authToken] - Token de autenticación para la solicitud.
 * @param {Object|FormData} [params.data] - Datos a enviar en la solicitud.
 * @param {function} [params.onSuccess] - Callback a ejecutar si la solicitud es exitosa.
 * @param {function} [params.onError] - Callback a ejecutar si la solicitud falla.
 * @param {boolean} [params.isDownload=false] - Indica si la solicitud es para descargar un archivo.
 * @param {boolean} [params.isAcceptDuplicates=false] - Indica si la solicitud es para descargar un archivo.
 * @param {string} [params.fileName='file'] - Nombre del archivo a descargar.
 * @returns {Promise} Promesa que se resuelve con los datos de la respuesta o se rechaza con un error.
 */
export const axiosRequest = async (params) => {
  const {
    url,
    method = "GET",
    maxRetries = 0,
    authToken,
    data,
    onSuccess,
    onError,
    isDownload = false,
    isAcceptDuplicates = false,
    fileName = "file",
    controller = null,
  } = params;

  const apiUrl = import.meta.env.VITE_API_URL;
  const requestKey = `${method}-${apiUrl}${url}`;
  const now = Date.now();

  // Evita solicitudes duplicadas en curso
  if (ongoingRequests.has(requestKey) && !isAcceptDuplicates) {
    return ongoingRequests.get(requestKey);
  }

  // Evita duplicados dentro de un intervalo de tiempo
  if (requestHistory.has(requestKey) && !isAcceptDuplicates) {
    const lastRequestTime = requestHistory.get(requestKey);
    const elapsedTime = now - lastRequestTime;
    const waitTime = Math.max(0, 5000 - elapsedTime);

    if (elapsedTime < 100) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(axiosRequest(params)), waitTime);
      });
    }
  }

  let retryCount = 0;

  const fetchData = async () => {
    try {
      // Configuración de la solicitud HTTP
      const options = {
        method,
        url: `${apiUrl}${url}`,
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          ...(data instanceof FormData && {
            "Content-Type": "multipart/form-data",
          }),
        },
        responseType: isDownload ? "blob" : "json",
        data: data && method !== "GET" ? data : undefined,
        timeout: 60000,
        signal: controller && controller.signal,
      };
      const response = await axios(options);

      // Manejo de descarga de archivos
      if (isDownload) {
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      }

      onSuccess && onSuccess(response.data);
      return response.data;
    } catch (err) {
      if (axios.isCancel(err)) return;
      // Reintenta en caso de error de conexión
      if (!err.response && retryCount < maxRetries) {
        retryCount++;
        return fetchData();
      } else {
        onError &&
          onError(
            err?.status || 0,
            err?.response?.data || "Error de conexión, por favor verifique.",
          );

        const error = new Error("Hubo un error al consultar los datos");
        error.status = err?.response?.status;
        error.data = err?.response?.data;
        throw error;
      }
    } finally {
      ongoingRequests.delete(requestKey);
      requestHistory.set(requestKey, Date.now());
    }
  };

  const requestPromise = fetchData();
  ongoingRequests.set(requestKey, requestPromise);

  return requestPromise;
};
