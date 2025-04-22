import { urlApi } from "../../../constants";

async function encriptarPassword(password) {
    const url = urlApi + 'encriptar/'; // URL del endpoint de encriptación
    const data = { password: password }; // Los datos que enviamos (la contraseña)

    try {
        const response = await fetch(url, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Tipo de contenido JSON
            },
            body: JSON.stringify(data), // Convertir los datos en formato JSON
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const result = await response.json(); // Parseamos la respuesta JSON

        return result.hashed_password; // Devuelve el resultado, que incluirá el `hashed_password`

    } catch (error) {
        console.error('Error:', error);
        return { error: error.message }; // Si ocurre algún error, lo manejamos aquí
    }
}

async function verificarPassword(password, hashedPassword) {
    const url = urlApi + 'verificar/'; // URL del endpoint de verificación
    const data = { password: password, hashed_password: hashedPassword }; // Los datos que enviamos

    try {
        const response = await fetch(url, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Tipo de contenido JSON
            },
            body: JSON.stringify(data), // Convertir los datos en formato JSON
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const result = await response.json(); // Parseamos la respuesta JSON

        // Retornar solo el valor de `es_valida` (true o false)
        return result.es_valida;

    } catch (error) {
        console.error('Error:', error);
        return false; // Si ocurre algún error, devolvemos false
    }
}


export { encriptarPassword,  verificarPassword };

