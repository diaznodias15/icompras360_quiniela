export const isPasswordValid = (password, strongPassword = true) => {
  // 1. Validar que exista (Evita caídas por null/undefined)
  if (!password || typeof password !== "string" || password.trim() === "") {
    return "La contraseña es requerida";
  }

  // Nota: No usamos .trim() en la contraseña real porque los espacios
  // pueden ser parte de una contraseña segura (ej: "Mi perro es azul 2026!")
  const length = password.length;

  // 2. Validación de longitud mínima y máxima general
  if (length < 8 || length > 40) {
    return "La contraseña debe tener entre 8 y 40 caracteres";
  }

  // 3. Validación estricta (Si está activada)
  if (strongPassword) {
    // Regex corregido para asegurar que la longitud (8-40) coincida con los límites del if
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$/;

    if (!strongPasswordRegex.test(password)) {
      return "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)";
    }
  }

  // Si pasa los filtros
  return null;
};

export const isUsernameOrEmailValid = (username) => {
  let message = "";

  if (
    username.length === 0 ||
    username === null ||
    username.length < 3 ||
    username.length > 40
  ) {
    message = "El usuario debe tener entre 3 y 40 caracteres";
  }

  if (message.length > 0) {
    return message;
  }
};

export const isConfirmPasswordValid = (password, confirmPassword) => {
  // 1. Validar que el campo no esté vacío (maneja null, undefined y espacios)
  if (
    !confirmPassword ||
    typeof confirmPassword !== "string" ||
    confirmPassword.trim() === ""
  ) {
    return "La confirmación de la contraseña es requerida";
  }

  // 2. Limpiar espacios en los extremos para evitar falsos negativos
  const cleanedPassword = typeof password === "string" ? password.trim() : "";
  const cleanedConfirm = confirmPassword.trim();

  // 3. Comparar las contraseñas
  if (cleanedPassword !== cleanedConfirm) {
    return "Las contraseñas no coinciden";
  }

  // Si todo está bien, mantiene la consistencia devolviendo null
  return null;
};

export const isEmailValid = (email) => {
  // 1. Validación de existencia y tipo (Evita caídas por null/undefined)
  if (!email || typeof email !== "string" || email.trim() === "") {
    return "El email es obligatorio";
  }

  const cleanedEmail = email.trim();

  // 2. Validación de longitud (Estándar para correos)
  if (cleanedEmail.length < 5 || cleanedEmail.length > 254) {
    return "El email debe tener entre 5 y 254 caracteres";
  }

  // 3. Validación de estructura (Regex)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanedEmail)) {
    return "El formato del email es inválido";
  }

  // Si pasa todas las validaciones
  return null;
};

export const isNameValid = (name) => {
  // 1. Validar que exista y no sea solo espacios
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "El nombre es requerido";
  }

  const cleanedName = name.trim();

  // 2. Validar longitud
  if (cleanedName.length < 3 || cleanedName.length > 100) {
    return "El nombre debe tener entre 3 y 100 caracteres";
  }

  // 3. Validar caracteres permitidos (letras y acentos)
  const validCharsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  if (!validCharsRegex.test(cleanedName)) {
    return "El nombre contiene caracteres inválidos";
  }

  // 4. Validar estructura (Al menos nombre y un apellido)
  const formatRegex = /^\S+\s+\S+/;
  if (!formatRegex.test(cleanedName)) {
    return "El nombre no es válido. Debe tener al menos un nombre y un apellido.";
  }

  // Si todo pasa, puedes retornar null o true (asumiendo que no hay error)
  return null;
};

export const isUsernameValid = (username) => {
  let message = "";

  if (
    username.length === 0 ||
    username === null ||
    username.length < 3 ||
    username.length > 40
  ) {
    message = "El usuario debe tener entre 3 y 40 caracteres";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    message = "El usuario solo puede contener letras, números y guiones bajos";
  }

  if (message.length > 0) {
    return message;
  }
  return true;
};

export const isPINValid = (pin) => {
  // 1. Validar que exista y convertirlo a string por seguridad si llega como número
  if (pin === null || pin === undefined) {
    return "El PIN es requerido";
  }

  const stringPin = String(pin).trim();

  // 2. Validar que no esté vacío tras la limpieza
  if (stringPin === "") {
    return "El PIN es requerido";
  }

  // 3. Validar que sean exactamente 6 dígitos numéricos
  const pinRegex = /^\d{6}$/; // Solo acepta exactamente 6 números del 0 al 9
  if (!pinRegex.test(stringPin)) {
    return "El PIN debe tener exactamente 6 dígitos numéricos";
  }

  // Si todo está correcto, mantenemos la consistencia con el resto del sistema
  return null;
};

export const isRIFValid = (rif) => {
  if (!rif) {
    return "El RIF es requerido";
  }
  if (rif.length < 5) {
    return "El RIF debe tener al menos 5 caracteres";
  }
  if (/^[A-Za-z][0-9]+$/.test(rif) === false) {
    return "El formato del RIF es incorrecto";
  }
};

export const isCompanyNameValid = (name) => {
  // 1. Validar que exista, sea un string y no esté vacío (maneja null, undefined y espacios)
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "El nombre de la empresa es requerido";
  }

  const cleanedName = name.trim();

  // 2. Validar longitud (Las empresas pueden tener nombres cortos o largos/legales)
  if (cleanedName.length < 2 || cleanedName.length > 100) {
    return "El nombre de la empresa debe tener entre 2 y 100 caracteres";
  }

  // 3. Validar caracteres permitidos (Letras, números, acentos y signos comunes como .,&-)
  const companyNameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,&-]+$/;
  if (!companyNameRegex.test(cleanedName)) {
    return "El nombre de la empresa contiene caracteres no válidos";
  }

  // Si todo está correcto, mantenemos la consistencia
  return null;
};

export const isAddressValid = (address) => {
  // 1. Validar que exista y no sean solo espacios (maneja null, undefined, etc.)
  if (!address || typeof address !== "string" || address.trim() === "") {
    return "La dirección es requerida";
  }

  const cleanedAddress = address.trim();

  // 2. Validar longitud (Las direcciones suelen requerir un mínimo de detalle y pueden ser largas)
  if (cleanedAddress.length < 5 || cleanedAddress.length > 150) {
    return "La dirección debe tener entre 5 y 150 caracteres";
  }

  // 3. Validar caracteres permitidos (Se añaden / ° ( ) _ para cubrir formatos reales)
  const addressRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,#\-\/°()_]+$/;
  if (!addressRegex.test(cleanedAddress)) {
    return "La dirección contiene caracteres inválidos";
  }

  // Si pasa todas las reglas, mantenemos la consistencia
  return null;
};

export const isContactNameValid = (contactName) => {
  // 1. Validar que exista y no sea un string vacío (maneja null, undefined y espacios)
  if (
    !contactName ||
    typeof contactName !== "string" ||
    contactName.trim() === ""
  ) {
    return "El nombre del contacto es requerido";
  }

  const cleanedName = contactName.trim();

  // 2. Validar longitud mínima
  if (cleanedName.length < 3) {
    return "El nombre del contacto debe tener al menos 3 caracteres";
  }

  // 3. Validar longitud máxima
  if (cleanedName.length > 100) {
    return "El nombre del contacto debe tener máximo 100 caracteres";
  }

  // 4. Validar caracteres permitidos (Se incluyen acentos, Ñ y ü)
  const validCharsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  if (!validCharsRegex.test(cleanedName)) {
    return "El nombre del contacto solo puede contener letras";
  }

  // Si todo está correcto, mantenemos la consistencia
  return null;
};

export const isContactPhoneValid = (contactPhone) => {
  if (!contactPhone) {
    return "El teléfono del contacto es requerido";
  }
  if (contactPhone.length < 17) {
    return "El teléfono del contacto debe tener al menos 11 caracteres";
  }
  if (contactPhone.length > 18) {
    return "El teléfono del contacto debe tener máximo 13 caracteres";
  }
};

export const isIDValid = (id) => {
  if (!id) {
    return "El ID es requerido";
  }
};
