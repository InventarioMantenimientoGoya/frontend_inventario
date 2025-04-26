// Importaciones
import { urlApi } from '../constants';
import { UsuarioModel } from './UsuarioModel';
import { RepuestoModel } from './RepuestoModel';

// Definir la estructura del modelo Movimiento
class MovimientoModel {
    constructor(id, Mov_tipo, Mov_cantidad, Mov_area, Mov_maquina_destino, Mov_referencia_compra, Mov_costo_unitario, Mov_costo_total, Mov_motivo, Mov_usuario, Mov_repuesto) {
        this.id = id; // Identificador único del movimiento
        this.Mov_tipo = Mov_tipo; // Tipo de movimiento (entrada, salida, etc.)
        this.Mov_cantidad = Mov_cantidad; // Cantidad de productos o repuestos movidos
        this.Mov_area = Mov_area; // Área o departamento donde se realiza el movimiento
        this.Mov_maquina_destino = Mov_maquina_destino; // Máquina o destino del movimiento
        this.Mov_referencia_compra = Mov_referencia_compra; // Referencia de compra relacionada al movimiento
        this.Mov_costo_unitario = Mov_costo_unitario; // Costo unitario del repuesto o producto
        this.Mov_costo_total = Mov_costo_total; // Costo total del movimiento
        this.Mov_motivo = Mov_motivo; // Motivo del movimiento (por ejemplo, mantenimiento, compra, etc.)
        this.Mov_usuario = Mov_usuario; // Usuario que realizó el movimiento
        this.Mov_repuesto = Mov_repuesto; // Repuesto relacionado con el movimiento
    }

    // Método estático para deserializar el objeto JSON en una instancia de MovimientoModel
    static fromJson(json) {

        // Deserializar los objetos relacionados (Usuario y Repuesto)
        const usuario = json.Mov_usuario ? UsuarioModel.fromJson(json.Mov_usuario) : null;
        const repuesto = json.Mov_repuesto ? RepuestoModel.fromJson(json.Mov_repuesto) : null;

        // Crear una nueva instancia de MovimientoModel con los datos deserializados
        return new MovimientoModel(
            json.id,
            json.Mov_tipo,
            json.Mov_cantidad,
            json.Mov_area,
            json.Mov_maquina_destino,
            json.Mov_referencia_compra,
            json.Mov_costo_unitario,
            json.Mov_costo_total,
            json.Mov_motivo,
            usuario,
            repuesto
        );
    }
}

// Función para realizar la petición a la API y obtener los movimientos
const getMovimientos = async () => {
    const url = urlApi + 'movimientos/'; // URL de la API que obtiene los movimientos

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
            throw new Error('Error al obtener los movimientos. Intente nuevamente más tarde.');
        } else {
            // Convertir el contenido a UTF-8
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(buffer); // Decodificar el contenido a UTF-8

            // Parsear el contenido como JSON
            const jsonData = JSON.parse(text);

            // Mapear la respuesta JSON para convertirla en una lista de instancias de MovimientoModel
            return jsonData.map((item) => MovimientoModel.fromJson(item));
        }

    } catch (error) {
        // Comprobamos si estamos en un entorno de desarrollo o producción
        if (process.env.NODE_ENV === 'development') {
            // Solo mostramos el error en la consola si estamos en desarrollo
            console.error('Error al cargar los movimientos:', error); // Log del error
        }

        // Lanzamos un error genérico para mostrarlo al usuario
        throw new Error('Hubo un problema al cargar los movimientos. Por favor, intente nuevamente.');
    }
}

export { MovimientoModel, getMovimientos };
