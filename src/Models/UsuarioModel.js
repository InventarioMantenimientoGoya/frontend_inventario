// Importaciones
import { urlApi } from '../../constants';

// Definir la estructura del modelo de Usuario
class UsuarioModel {
    constructor(id, Usu_nombres, Usu_apellidos, Usu_email, Usu_telefono, Usu_cargo, Usu_area, Usu_rol, Usu_foto, Usu_estado, Usu_en_linea, Usu_fecha_registro, Usu_contrasena) {
        this.id = id; // Identificador único del usuario
        this.Usu_nombres = Usu_nombres; // Nombres del usuario
        this.Usu_apellidos = Usu_apellidos; // Apellidos del usuario
        this.Usu_email = Usu_email; // Correo electrónico del usuario
        this.Usu_telefono = Usu_telefono; // Teléfono del usuario
        this.Usu_cargo = Usu_cargo; // Cargo del usuario dentro de la organización
        this.Usu_area = Usu_area; // Área o departamento del usuario
        this.Usu_rol = Usu_rol; // Rol o nivel de acceso del usuario
        this.Usu_foto = Usu_foto; // Foto del usuario
        this.Usu_estado = Usu_estado; // Estado del usuario (activo, inactivo, etc.)
        this.Usu_en_linea = Usu_en_linea; // Estado de conexión del usuario (en línea o desconectado)
        this.Usu_fecha_registro = Usu_fecha_registro; // Fecha de registro del usuario
        this.Usu_contrasena = Usu_contrasena; // Contraseña del usuario (encriptada)
    }

    // Método estático para deserializar el objeto JSON en una instancia de UsuarioModel
    static fromJson(json) {
        return new UsuarioModel(
            json.id,
            json.Usu_nombres,
            json.Usu_apellidos,
            json.Usu_email,
            json.Usu_telefono,
            json.Usu_cargo,
            json.Usu_area,
            json.Usu_rol,
            json.Usu_foto,
            json.Usu_estado,
            json.Usu_en_linea,
            json.Usu_fecha_registro,
            json.Usu_contrasena
        );
    }
}

// Función para realizar la petición a la API y obtener los usuarios
const getUsuarios = async () => {
    const url = urlApi + 'usuarios/'; // URL de la API que obtiene los usuarios

    try {
        const response = await fetch(url, {
            method: 'GET',  // o 'POST', según corresponda
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Verificar que la respuesta de la API sea exitosa (status 200)
        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzar un error con un mensaje genérico
            throw new Error('Error al obtener los usuarios. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);

            // Mapear la respuesta JSON para convertirla en una lista de instancias de UsuarioModel
            return jsonData.map((item) => UsuarioModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar los usuarios:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar los usuarios. Por favor, intente nuevamente.');
    }
}

export { UsuarioModel, getUsuarios };
