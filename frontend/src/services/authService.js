import api from '@/lib/axios';

/**
 * ==================================================
 * authService.js — Servicios de autenticación
 * ==================================================
 **/

/**
 * Inicia sesión con email y contraseña.
 * El backend establece la cookie auth_token automáticamente.
 * @returns {{ success: boolean, user: object }}
 */
export const loginService = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  // NO se guarda nada en localStorage.
  // La cookie HttpOnly es gestionada por el navegador.
  return data;
};

/**
 * Cierra la sesión del usuario.
 * El backend elimina la cookie auth_token.
 */
export const logoutService = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

/**
 * Obtiene los datos del usuario autenticado.
 * @returns {{ success: boolean, user: object }}
 */
export const getMeService = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};                