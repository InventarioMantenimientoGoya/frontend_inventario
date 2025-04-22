// Importaciones
import { urlApi } from '../constants';

// Definir la estructura del modelo de Categoria
class CategoriaModel {
    constructor(id, Cat_nombre, Cat_foto) {
        this.id = id; // Identificador único de la categoría
        this.Cat_nombre = Cat_nombre; // Nombre de la categoría
        this.Cat_foto = Cat_foto; // Foto asociada a la categoría
    }

    // Método estático para deserializar el objeto JSON en una instancia de Categoria
    static fromJson(json) {
        return new CategoriaModel(json.id, json.Cat_nombre, json.Cat_foto);
    }
}

// Función para realizar la petición a la API y obtener las categorías
const getCategorias = async () => {
    const url = urlApi + 'categorias/'; // URL de la API que obtiene las categorías

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
            throw new Error('Error al obtener las categorías. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);


            // Mapear la respuesta JSON para convertirla en una lista de instancias de Categoria
            return jsonData.map((item) => CategoriaModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar las categorías:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar las categorías. Por favor, intente nuevamente.');
    }
}

export { CategoriaModel, getCategorias };