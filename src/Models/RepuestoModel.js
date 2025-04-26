// Importaciones
import { urlApi } from '../constants';
import { CategoriaModel } from './CategoriaModel';

// Definir la estructura del modelo de Repuesto
class RepuestoModel {
    constructor(id, Rep_nombre, Rep_caracteristica1, Rep_caracteristica2, Rep_marca, Rep_stock_inicial, Rep_unidad_medida, Rep_ubicacion, Rep_stock_minimo, Rep_stock, Rep_costo_unitario, Rep_costo_total, Rep_observaciones, Rep_imagen, Rep_categoria) {
        this.id = id; // Identificador único del repuesto
        this.Rep_nombre = Rep_nombre; // Nombre del repuesto
        this.Rep_caracteristica1 = Rep_caracteristica1; // Característica 1 del repuesto
        this.Rep_caracteristica2 = Rep_caracteristica2; // Característica 2 del repuesto
        this.Rep_marca = Rep_marca; // Marca del repuesto
        this.Rep_stock_inicial = Rep_stock_inicial; // Stock inicial disponible
        this.Rep_unidad_medida = Rep_unidad_medida; // Unidad de medida para el repuesto
        this.Rep_ubicacion = Rep_ubicacion; // Ubicación del repuesto
        this.Rep_stock_minimo = Rep_stock_minimo; // Stock mínimo para el repuesto
        this.Rep_stock = Rep_stock; // Stock actual disponible
        this.Rep_costo_unitario = Rep_costo_unitario; // Costo unitario del repuesto
        this.Rep_costo_total = Rep_costo_total; // Costo total (stock * costo unitario)
        this.Rep_observaciones = Rep_observaciones; // Observaciones adicionales sobre el repuesto
        this.Rep_imagen = Rep_imagen; // Imagen asociada al repuesto
        this.Rep_categoria = Rep_categoria; // Categoría del repuesto (modelo de Categoria)
    }

    // Método estático para deserializar el objeto JSON en una instancia de RepuestoModel
    static fromJson(json) {
        const categoria = json.Rep_categoria ? CategoriaModel.fromJson(json.Rep_categoria) : null;

        return new RepuestoModel(
            json.id,
            json.Rep_nombre,
            json.Rep_caracteristica1,
            json.Rep_caracteristica2,
            json.Rep_marca,
            json.Rep_stock_inicial,
            json.Rep_unidad_medida,
            json.Rep_ubicacion,
            json.Rep_stock_minimo,
            json.Rep_stock,
            json.Rep_costo_unitario,
            json.Rep_costo_total,
            json.Rep_observaciones,
            json.Rep_imagen,
            categoria
        );
    }
}

// Función que hace la petición a la API para obtener los repuestos
const getRepuestos = async () => {
    const url = urlApi + 'repuestos/'; // URL de la API para obtener los repuestos

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
            throw new Error('Error al obtener los repuestos. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);

            // Mapear la respuesta JSON para convertirla en una lista de instancias de RepuestoModel
            return jsonData.map((item) => RepuestoModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar los repuestos:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar los repuestos. Por favor, intente nuevamente.');
    }
}

export { RepuestoModel, getRepuestos };
