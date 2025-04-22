import { urlApi } from "../../../constants";

const suspenderUsuario = async (usuarioId) => {
    const url = `${urlApi}usuarios/${usuarioId}/`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Usu_estado: false }), // Actualiza el estado
        });

        if (!response.ok) {
            throw new Error(`Error al suspender: ${response.statusText}`);
        }

        const data = await response.json();
        return data;  // Devuelve los datos si la solicitud es exitosa
    } catch (error) {
        console.error("Error en suspender usuario:", error);
        return null;  // Si hay un error, se devuelve null
    }
};

const correoUsuarioSuspendido = async (correo, estado) => {
    try {
        // Datos a enviar al servidor
        const data = {
            subject: "Notificación de estado de usuario",
            message: estado ? "Activo" : "Inactivo",
            recipient_list: correo, // El correo del usuario
        };

        // Realizamos la solicitud POST a la vista 'send_estado' de Django
        const response = await fetch(`${urlApi}send_estado/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Verificamos si la respuesta del servidor fue exitosa
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Hubo un problema al enviar el correo');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Hubo un error al intentar enviar el correo');
    }
};

const correoUsuarioCodigo = async (correo, codigo) => {   
    try {
        // Datos a enviar al servidor
        const data = {
            subject: "Código de validación para su cuenta",
            message: codigo,
            recipient_list: correo, // El correo del usuario
        };

        // Realizamos la solicitud POST a la vista 'send_estado' de Django
        const response = await fetch(`${urlApi}send_code/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Verificamos si la respuesta del servidor fue exitosa
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Hubo un problema al enviar el correo');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Hubo un error al intentar enviar el correo');
    }
};

const correoRestablecer = async (correo, link) => {
    try {
        // Datos a enviar al servidor
        const data = {
            subject: "Restablecimiento de contraseña",
            message: link,
            recipient_list: [correo], // El correo del usuario (debe estar en un array)
        };

        // Realizamos la solicitud POST a la vista 'send_contrasena' de Django
        const response = await fetch(`${urlApi}send_contrasena/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Verificamos si la respuesta del servidor fue exitosa
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Hubo un problema al enviar el correo');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Hubo un error al intentar enviar el correo');
    }
};


// Aquí almacenaremos los códigos generados previamente (puedes guardarlos en una base de datos)
const generados = new Set();

// Función para generar un código aleatorio único de 6 dígitos
const generarCodigo = () => {
    let codigo;
    do {
        // Generar un código aleatorio de 6 dígitos
        codigo = Math.floor(100000 + Math.random() * 900000).toString();
    } while (generados.has(codigo)); // Verificar que el código no se haya generado antes

    // Guardamos el código generado para que no se repita
    generados.add(codigo);

    return codigo;
};


export { suspenderUsuario, correoUsuarioSuspendido, correoUsuarioCodigo, generarCodigo, correoRestablecer };
