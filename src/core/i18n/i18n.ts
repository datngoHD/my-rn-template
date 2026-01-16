/**
 * i18n Configuration
 * 
 * Internationalization setup with react-i18next.
 * Supports multiple languages and lazy loading of translations.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getTenantConfig } from '../tenant/tenant.config';

const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        done: 'Done',
      },
      errors: {
        network: 'Network error. Please check your connection.',
        timeout: 'Request timed out. Please try again.',
        unauthorized: 'Your session has expired. Please log in again.',
        forbidden: 'You do not have permission to perform this action.',
        notFound: 'The requested resource was not found.',
        serverError: 'Server error. Please try again later.',
        unknown: 'An unexpected error occurred. Please try again.',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        signUp: 'Sign Up',
      },
    },
  },
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        back: 'Atrás',
        next: 'Siguiente',
        done: 'Hecho',
      },
      errors: {
        network: 'Error de red. Por favor verifica tu conexión.',
        timeout: 'La solicitud expiró. Por favor intenta de nuevo.',
        unauthorized: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
        forbidden: 'No tienes permiso para realizar esta acción.',
        notFound: 'El recurso solicitado no fue encontrado.',
        serverError: 'Error del servidor. Por favor intenta más tarde.',
        unknown: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
      },
      auth: {
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        forgotPassword: '¿Olvidaste tu Contraseña?',
        signUp: 'Registrarse',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
    defaultNS: 'translation',
    ns: ['translation'],
  });

export default i18n;





