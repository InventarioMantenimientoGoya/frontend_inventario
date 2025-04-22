// Importaciones
import { urlApi } from '../constants';

// Definir la estructura del modelo Mensaje
class MensajeModel {
    constructor(id, Men_contenido, Men_fecha_enviado, Men_fecha_leido, Men_tipo, Men_imagen, Men_eliminar_emisor, Men_eliminar_receptor, Men_usuario_emisor, Men_usuario_receptor) {
        this.id = id; // Identificador único del mensaje
        this.Men_contenido = Men_contenido; // Contenido del mensaje
        this.Men_fecha_enviado = Men_fecha_enviado; // Fecha en que se envió el mensaje
        this.Men_fecha_leido = Men_fecha_leido; // Fecha en que el mensaje fue leído
        this.Men_tipo = Men_tipo; // Tipo de mensaje (texto, imagen, etc.)
        this.Men_imagen = Men_imagen; // Imagen asociada al mensaje (si aplica)
        this.Men_eliminar_emisor = Men_eliminar_emisor; // Indica si el emisor ha solicitado eliminar el mensaje
        this.Men_eliminar_receptor = Men_eliminar_receptor; // Indica si el receptor ha solicitado eliminar el mensaje
        this.Men_usuario_emisor = Men_usuario_emisor; // Usuario que envió el mensaje
        this.Men_usuario_receptor = Men_usuario_receptor; // Usuario que recibió el mensaje
    }

    // Método estático para deserializar el objeto JSON en una instancia de MensajeModel
    static fromJson(json) {
        return new MensajeModel(
            json.id,
            json.Men_contenido,
            json.Men_fecha_enviado,
            json.Men_fecha_leido,
            json.Men_tipo,
            json.Men_imagen,
            json.Men_eliminar_emisor,
            json.Men_eliminar_receptor,
            json.Men_usuario_emisor,
            json.Men_usuario_receptor
        );
    }
}

// Función que hace la petición a la API y obtiene los mensajes
const getMensajes = async () => {
    const url = urlApi + 'mensajes/'; // URL de la API que obtiene los mensajes

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
            throw new Error('Error al obtener los mensajes. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);

            // Mapear la respuesta JSON para convertirla en una lista de instancias de MensajeModel
            return jsonData.map((item) => MensajeModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar los mensajes:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar los mensajes. Por favor, intente nuevamente.');
    }
}

export { MensajeModel, getMensajes };
