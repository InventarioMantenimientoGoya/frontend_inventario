// Importaciones
import { urlApi } from '../constants';
import { HerramientaModel } from './HerramientaModel';

// Definir la estructura del modelo Prestamo
class PrestamoModel {
    constructor(id, Pre_cantidad, Pre_area, Pre_maquina, Pre_motivo_prestamo, Pre_estado, Pre_fecha_devolucion, Pre_usuario_solicita, Pre_usuario_prestamo, Pre_herramienta) {
        this.id = id; // Identificador único del préstamo
        this.Pre_cantidad = Pre_cantidad; // Cantidad de herramientas prestadas
        this.Pre_area = Pre_area; // Área de trabajo donde se realiza el préstamo
        this.Pre_maquina = Pre_maquina; // Máquina asociada al préstamo
        this.Pre_motivo_prestamo = Pre_motivo_prestamo; // Motivo del préstamo
        this.Pre_estado = Pre_estado; // Estado del préstamo (ej. pendiente, realizado)
        this.Pre_fecha_devolucion = Pre_fecha_devolucion; // Fecha de devolución de las herramientas prestadas
        this.Pre_usuario_solicita = Pre_usuario_solicita; // Usuario que solicita el préstamo
        this.Pre_usuario_prestamo = Pre_usuario_prestamo; // Usuario que realiza el préstamo
        this.Pre_herramienta = Pre_herramienta; // Herramienta asociada al préstamo
    }

    // Método estático para deserializar el objeto JSON en una instancia de PrestamoModel
    static fromJson(json) {

        // Deserializar el objeto Herramienta relacionado
        const herramienta = json.Pre_herramienta ? HerramientaModel.fromJson(json.Pre_herramienta) : null;

        // Crear y devolver una nueva instancia de PrestamoModel
        return new PrestamoModel(
            json.id,
            json.Pre_cantidad,
            json.Pre_area,
            json.Pre_maquina,
            json.Pre_motivo_prestamo,
            json.Pre_estado,
            json.Pre_fecha_devolucion,
            json.Pre_usuario_solicita,
            json.Pre_usuario_prestamo,
            herramienta
        );
    }
}

// Función que hace la petición a la API y obtiene los préstamos
const getPrestamos = async () => {
    const url = urlApi + 'prestamos/'; // URL de la API que obtiene los préstamos

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
            throw new Error('Error al obtener los prestamos. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);

            // Mapear la respuesta JSON para convertirla en una lista de instancias de PrestamoModel
            return jsonData.map((item) => PrestamoModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar los prestamos:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar los prestamos. Por favor, intente nuevamente.');
    }
}

export { PrestamoModel, getPrestamos };
