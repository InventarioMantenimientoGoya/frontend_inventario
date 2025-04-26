    // Importaciones
import { urlApi } from '../constants';
import { CategoriaModel } from './CategoriaModel';

// Definir la estructura del modelo Herramienta
class HerramientaModel {
    constructor(id, Her_nombre, Her_caracteristica1, Her_caracteristica2, Her_marca, Her_stock_inicial, Her_unidad_medida, Her_ubicacion, Her_stock_minimo, Her_stock, Her_costo_unitario, Her_costo_total, Her_observaciones, Her_imagen, Her_categoria) {
        this.id = id; // Identificador único de la herramienta
        this.Her_nombre = Her_nombre; // Nombre de la herramienta
        this.Her_caracteristica1 = Her_caracteristica1; // Característica 1 de la herramienta
        this.Her_caracteristica2 = Her_caracteristica2; // Característica 2 de la herramienta
        this.Her_marca = Her_marca; // Marca de la herramienta
        this.Her_stock_inicial = Her_stock_inicial; // Stock inicial de la herramienta
        this.Her_unidad_medida = Her_unidad_medida; // Unidad de medida de la herramienta
        this.Her_ubicacion = Her_ubicacion; // Ubicación de la herramienta
        this.Her_stock_minimo = Her_stock_minimo; // Stock mínimo de la herramienta
        this.Her_stock = Her_stock; // Stock actual de la herramienta
        this.Her_costo_unitario = Her_costo_unitario; // Costo unitario de la herramienta
        this.Her_costo_total = Her_costo_total; // Costo total de las herramientas en stock
        this.Her_observaciones = Her_observaciones; // Observaciones sobre la herramienta
        this.Her_imagen = Her_imagen; // Imagen de la herramienta
        this.Her_categoria = Her_categoria; // Categoría de la herramienta
    }

    // Método estático para deserializar el objeto JSON en una instancia de HerramientaModel
    static fromJson(json) {

        // Deserializar el objeto Categoria relacionado
        const categoria = json.Her_categoria ? CategoriaModel.fromJson(json.Her_categoria) : null;

        // Crear y devolver una nueva instancia de HerramientaModel
        return new HerramientaModel(
            json.id,
            json.Her_nombre,
            json.Her_caracteristica1,
            json.Her_caracteristica2,
            json.Her_marca,
            json.Her_stock_inicial,
            json.Her_unidad_medida,
            json.Her_ubicacion,
            json.Her_stock_minimo,
            json.Her_stock,
            json.Her_costo_unitario,
            json.Her_costo_total,
            json.Her_observaciones,
            json.Her_imagen,
            categoria
        );
    }
}

// Función que hace la petición a la API y obtiene las herramientas
const getHerramientas = async () => {
    const url = urlApi + 'herramientas/'; // URL de la API que obtiene las herramientas

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
            throw new Error('Error al obtener las herramientas. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);

            // Mapear la respuesta JSON para convertirla en una lista de instancias de HerramientaModel
            return jsonData.map((item) => HerramientaModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar las herramientas:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar las herramientas. Por favor, intente nuevamente.');
    }
}

export { HerramientaModel, getHerramientas };
