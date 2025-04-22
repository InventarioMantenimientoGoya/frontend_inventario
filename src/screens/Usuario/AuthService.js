import { urlApi } from '../../../constants';
import { UsuarioModel } from '../../Models/UsuarioModel'; // Asegúrate de que la ruta sea correcta

export default class AuthService {
  static async login(email, password) {
    try {
      const response = await fetch(`${urlApi}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      const token = data.token;
      const usuario = UsuarioModel.fromJson(data.usuario);

      return { token, usuario };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(token) {
    try {
      const response = await fetch(`${urlApi}logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al cerrar sesión');
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

