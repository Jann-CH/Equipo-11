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
 * Registra un nuevo usuario.
 */
export const registerService = async (userData) => {

  const { data } = await api.post(
    "/auth/register",
    userData
  );

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

export const updateUserDataService = async (userData) => {
  const { data } = await api.put('/auth/update', userData);
  return data; 
}

export const updateUserCompanyService = async (companyData) => {

  const { data } = await api.put('/auth/updateCompany', companyData);
  return data;

}

export const updateUserLogoService = async (formData) => {
  const { data } = await api.patch('/auth/updateLogo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}