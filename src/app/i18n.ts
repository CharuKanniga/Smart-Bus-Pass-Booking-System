import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Smart Bus Pass Booking System',
          login: 'Login',
          register: 'Register',
          email: 'Email',
          password: 'Password',
          name: 'Name',
          phone: 'Phone Number',
          selectRole: 'Select Role',
          user: 'User',
          admin: 'Admin',
          busOperator: 'Bus Operator',
          dashboard: 'Dashboard',
          applyPass: 'Apply for Pass',
          myPasses: 'My Passes',
          liveTracking: 'Live Tracking',
          logout: 'Logout',
          darkMode: 'Dark Mode',
        }
      },
      es: {
        translation: {
          welcome: 'Bienvenido al Sistema de Reserva de Pases de Autobús Inteligente',
          login: 'Iniciar sesión',
          register: 'Registrarse',
          email: 'Correo electrónico',
          password: 'Contraseña',
          name: 'Nombre',
          phone: 'Número de teléfono',
          selectRole: 'Seleccionar rol',
          user: 'Usuario',
          admin: 'Administrador',
          busOperator: 'Operador de autobús',
          dashboard: 'Panel',
          applyPass: 'Solicitar pase',
          myPasses: 'Mis pases',
          liveTracking: 'Seguimiento en vivo',
          logout: 'Cerrar sesión',
          darkMode: 'Modo oscuro',
        }
      },
      hi: {
        translation: {
          welcome: 'स्मार्ट बस पास बुकिंग सिस्टम में आपका स्वागत है',
          login: 'लॉगिन',
          register: 'पंजीकरण',
          email: 'ईमेल',
          password: 'पासवर्ड',
          name: 'नाम',
          phone: 'फोन नंबर',
          selectRole: 'भूमिका चुनें',
          user: 'उपयोगकर्ता',
          admin: 'व्यवस्थापक',
          busOperator: 'बस संचालक',
          dashboard: 'डैशबोर्ड',
          applyPass: 'पास के लिए आवेदन करें',
          myPasses: 'मेरे पास',
          liveTracking: 'लाइव ट्रैकिंग',
          logout: 'लॉगआउट',
          darkMode: 'डार्क मोड',
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
