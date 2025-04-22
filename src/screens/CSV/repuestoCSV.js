// Importaciones Necesarias 
import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Pressable, Alert, Platform, ScrollView, Modal, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS, COLORS } from '../../styles/globalStyles';
import Papa from "papaparse";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { getCategorias } from './../../Models/CategoriaModel.js';
import { urlApi } from './../../constants.js';
import { useNavigation } from '@react-navigation/native';

// Vista para subir repuestos mediante un archivo excel CSV
const RepuestoCSV = () => {

    const navigation = useNavigation();

    const [archivoImportado, setArchivoImportado] = useState(false); // Estado para controlar si se importo el archivo, se inicializa en falso
    const [datosCorrectos, setDatosCorrectos] = useState([]); // Estado para controlar los registros correctos del archivo importado
    const [datosErroneos, setDatosErroneos] = useState([]); // Estado para controlar los registros erroneos del archivo importado
    const [categoriasDB, setCategoriasDB] = useState([]); // Estado para controlar las categorías recibidas desde la base de datos
    const [isModalCargaVisible, setIsModalCargaVisible] = useState(true); // Estado para controlar la visibilidad del modal de carga de datos, inicializa en verdadero
    const [isModalProgresoVisible, setIsModalProgresoVisible] = useState(false); //Estado para controlar la visibilidad del modal del progreso de subida de datos, inicializa en falso
    const [isModalExcelVisible, setIsModalExcelVisible] = useState(false); // Estado para controlar la visibilidad del modal de importación erronea del CSV, inicializa en falso
    const [isModalEncabezadoVisible, setIsModalEncabezadoVisible] = useState(false); // Estado para controlar la visibilidad del modal de validación de encabezados, inicializa en falso
    const [isModalCaracterVisible, setIsModalCaracterVisible] = useState(false); // Estado para controlar la visibilidad del modal de validación de campos númericos, inicializa en falso
    const [isModalRespuestaVisible, setIsModalRespuestaVisible] = useState(false); // Estado para controlar la visibilidad del modal de validación de respuesta del servidor, inicializa en falso
    const [isModalSolicitudVisible, setIsModalSolicitudVisible] = useState(false); // Estado para controlar la visibilidad del modal de validación del proceso de solicitud de subida de datos, inicializa en falso
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Estado para controlar si los datos recibidos de la base de datos se han cargado, inicializa en falso

    useEffect(() => {
        // Se define una función asincrónica para cargar las categorías desde la API
        const fetchData = async () => {
            try {
                // Se intenta obtener los datos de categorías
                const categoriasData = await getCategorias();

                // Si se reciben datos válidos (categorías no vacías)
                if (categoriasData && categoriasData.length > 0) {
                    setCategoriasDB(categoriasData); // Se almacenan los datos en el estado de categorías
                    setIsDataLoaded(true); // Se marca que los datos se han cargado correctamente
                    setIsModalCargaVisible(false); // Se oculta el modal de carga porque los datos ya están listos
                } else {
                    setIsDataLoaded(false); // Si no se obtienen categorías, se mantiene el modal visible y se marca que no hay datos
                    setIsModalCargaVisible(true); // El modal se mantiene visible
                }
            } catch (error) {
                // Si ocurre un error (por ejemplo, problemas de conexión con el servidor),
                // se muestra el modal de error de carga
                setIsModalCargaVisible(true);
            }
        };

        // Se llama a la función fetchData inmediatamente para cargar los datos cuando el componente se monta
        fetchData();

        // Se configura un intervalo para que la función fetchData se ejecute cada 5 segundos
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        // Se limpia el intervalo cuando el componente se desmonte para evitar posibles fugas de memoria
        return () => clearInterval(intervalId);
    }, []); // El efecto solo se ejecuta una vez, cuando el componente se monta

    // Este segundo useEffect se ejecuta cuando el estado `isDataLoaded` cambia
    useEffect(() => {
        // Si los datos ya han sido cargados, se cierra el modal de carga
        if (isDataLoaded) {
            setIsModalCargaVisible(false); // Se oculta el modal de carga
        }
    }, [isDataLoaded]); // Este efecto depende del estado `isDataLoaded`, se ejecuta cada vez que cambia

    // Encabezados que tendrán las tablas de datos correctos y datos erroneos, a su vez son los campos que se subirán a la base de datos
    const tableHead = [
        "Categoría", "Nombre", "Carácteristica 1", "Carácteristica 2", "Marca", "Stock Inicial",
        "Unidad Medida", "Ubicación", "Stock Mínimo", "Stock", "Costo Unitario", "Costo Total", "Observaciones"
    ];

    // Medidas de ancho que tendrán las celdas tanto en los encabezados como en las filas
    const widthArr = [100, 120, 290, 290, 100, 100, 130, 120, 100, 130, 130, 130, 604];

    const importCSV = async () => {
        try {
            let fileContent = "";

            // Si la plataforma es web, se crea un input para seleccionar el archivo CSV
            if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "file"; // Se define el tipo de archivo a aceptar
                input.accept = ".csv"; // Solo archivos .csv
                input.onchange = async (event) => {
                    const file = event.target.files[0]; // Se obtiene el archivo seleccionado
                    if (!file) return; // Si no se selecciona ningún archivo, se sale de la función

                    // Si el archivo no es un CSV, se muestra un modal de error
                    if (!file.name.endsWith(".csv")) {
                        setIsModalExcelVisible(true);
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = ({ target }) => processCSV(target.result); // Se procesa el archivo CSV una vez cargado
                    reader.readAsText(file); // Se lee el contenido del archivo como texto
                };
                input.click(); // Se dispara el click para abrir el explorador de archivos
            } else {
                // Si no es web, se utiliza DocumentPicker para dispositivos móviles
                const res = await DocumentPicker.getDocumentAsync({
                    type: "text/csv", // Solo se permiten archivos .csv
                });

                // Si se cancela la selección, se sale de la función
                if (res.type === "cancel") return;

                // Si el archivo no es un CSV, se muestra un modal de error
                if (!res.name.endsWith(".csv")) {
                    setIsModalExcelVisible(true);
                    return;
                }

                // Se lee el archivo CSV desde el sistema de archivos en plataformas móviles
                fileContent = await FileSystem.readAsStringAsync(res.uri, { encoding: FileSystem.EncodingType.UTF8 });
                processCSV(fileContent); // Se procesa el contenido del archivo CSV
            }
        } catch (error) {
            // Si ocurre un error en el proceso de importación, se muestra un modal de error
            setIsModalExcelVisible(true);
        }
    };

    // Función para procesar el contenido del archivo CSV
    const processCSV = (fileContent) => {
        // Se parsea el contenido del CSV, usando 'Papa.parse' para convertirlo a un objeto de datos
        const parsedData = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

        // Se obtienen los encabezados del archivo CSV
        const csvHeaders = Object.keys(parsedData.data[0]);
        // Se verifica si los encabezados del archivo CSV coinciden con los esperados
        const encabezadosCoinciden = tableHead.every((header, index) => header === csvHeaders[index]);

        // Si los encabezados no coinciden, se muestra un modal de error
        if (!encabezadosCoinciden) {
            setIsModalEncabezadoVisible(true);
            return;
        }

        const datosCorrectos = []; // Para almacenar las filas que contienen datos correctos
        const datosIncorrectos = []; // Para almacenar las filas con datos incorrectos

        // Se recorre cada fila del archivo CSV
        parsedData.data.forEach((fila) => {
            // Se verifica si la categoría existe en la base de datos
            const categoriaExiste = categoriasDB.some((categoria) => categoria.Cat_nombre === fila["Categoría"]);
            // Se verifica si la fila tiene todos los datos requeridos
            const datosCompletos =
                fila["Categoría"] && fila["Nombre"] && fila["Carácteristica 1"] &&
                fila["Stock Inicial"] && fila["Unidad Medida"] &&
                fila["Ubicación"] && fila["Stock Mínimo"] && fila['Stock'] && fila["Observaciones"];

            // Si la categoría existe y todos los datos son completos, se agregan a 'datosCorrectos'
            if (categoriaExiste && datosCompletos) {
                datosCorrectos.push(fila);
            } else {
                // Si no, se agregan a 'datosIncorrectos'
                datosIncorrectos.push(fila);
            }
        });

        // Se actualizan los estados con los datos correctos e incorrectos
        setDatosCorrectos(datosCorrectos);
        setDatosErroneos(datosIncorrectos);
        // Se marca que el archivo ha sido importado exitosamente
        setArchivoImportado(true);
    };

    const GuardarRepuestosCSV = async () => {

        // Se muestra el modal de progreso para indicar que el proceso de guardado está en curso
        setIsModalProgresoVisible(true);

        const url = urlApi + 'repuestos/'; // Se define la URL de la API donde se enviarán los datos

        const body = []; // Arreglo que almacenará los repuestos que serán enviados

        // Función para verificar si un valor es un número válido (sin letras)
        const esNumeroValido = (valor) => {
            return !/[a-zA-Z]/.test(valor); // Si el valor contiene letras, se considera no válido
        };

        // Se recorre cada repuesto de los datos correctos para validar y preparar la información
        datosCorrectos.map((repuesto) => {

            // Se validan los campos numéricos, y si alguno no es válido, se muestra un modal de error
            if (
                !esNumeroValido(repuesto["Stock Inicial"]) ||
                !esNumeroValido(repuesto["Stock Mínimo"]) ||
                !esNumeroValido(repuesto["Stock"]) ||
                (repuesto['Costo Unitario'] && !esNumeroValido(repuesto['Costo Unitario'])) ||
                (repuesto['Costo Total'] && !esNumeroValido(repuesto['Costo Total']))
            ) {
                // Si algún campo es inválido, se cierra el modal de progreso y se muestra el modal de error
                setIsModalProgresoVisible(false);
                setIsModalCaracterVisible(true);
                return;
            }

            // Se busca la categoría correspondiente al repuesto en la base de datos
            const categoriaEncontrada = categoriasDB.find((categoria) => categoria.Cat_nombre === repuesto["Categoría"]);

            // Si se encuentra la categoría, se obtiene su ID; si no, se asigna null
            let codigoCategoria = categoriaEncontrada ? categoriaEncontrada.id : null;

            // Se crea un objeto con los datos del repuesto a enviar, asegurándose de convertir los valores numéricos
            const repuestoBody = {
                "Rep_nombre": repuesto["Nombre"],
                "Rep_caracteristica1": repuesto["Carácteristica 1"],
                "Rep_caracteristica2": repuesto["Carácteristica 2"] ? repuesto["Carácteristica 2"] : undefined,
                "Rep_marca": repuesto["Marca"],
                "Rep_stock_inicial": parseFloat(repuesto["Stock Inicial"]),
                "Rep_unidad_medida": repuesto["Unidad Medida"],
                "Rep_ubicacion": repuesto["Ubicación"],
                "Rep_stock_minimo": parseFloat(repuesto["Stock Mínimo"]),
                "Rep_stock": parseFloat(repuesto["Stock"]),
                "Rep_costo_unitario": repuesto['Costo Unitario'] ? Number(repuesto['Costo Unitario']) : undefined,
                "Rep_costo_total": repuesto['Costo Total'] ? Number(repuesto['Costo Total']) : undefined,
                "Rep_observaciones": repuesto["Observaciones"],
                "Rep_categoria": codigoCategoria
            };

            // Se eliminan las propiedades con valores undefined del objeto repuestoBody
            Object.keys(repuestoBody).forEach(key => {
                if (repuestoBody[key] === undefined) {
                    delete repuestoBody[key];
                }
            });

            // Se agrega el repuesto a la lista de repuestos que serán enviados
            body.push(repuestoBody);
        });

        try {
            // Se envían los datos a la API utilizando la petición POST
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Se especifica que se enviarán datos en formato JSON
                },
                body: JSON.stringify(body), // Se convierte el arreglo de repuestos a JSON
            });

            // Si la respuesta no es 201 (creación exitosa), se muestra un modal de error
            if (response.status !== 201) {

                if (process.env.NODE_ENV === 'development') {
                    console.error(`Error: La respuesta no fue 201, código de estado: ${response.status}`);
                }
                setIsModalProgresoVisible(false); // Se oculta el modal de progreso
                setIsModalRespuestaVisible(true); // Se muestra el modal de respuesta con el error
            } else {
                // Si la respuesta es exitosa, se muestra un mensaje de éxito y se redirige a la pantalla de inicio
                setIsModalProgresoVisible(false); // Se oculta el modal de progreso
                Alert.alert("¡Registro de repuestos exitoso!", "Los datos se han registrado correctamente.");
                navigation.goBack(); // Retrocede a la pantalla anterior
            }

        } catch (error) {
            // Si ocurre un error al hacer la solicitud, se muestra un mensaje de error
            if (process.env.NODE_ENV === 'development') {
                console.error('Error al hacer la solicitud: ' + error.message);
            }
            setIsModalProgresoVisible(false); // Se oculta el modal de progreso
            setIsModalSolicitudVisible(true); // Se muestra el modal de solicitud con el error
        }
    };

    // Interfaz de usuario
    return (
        // Imagen Contenedora
        <ImageBackground
            source={require('../../../assets/img/Img_2.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            {/* Fondo difuminado azul */}
            <View style={styles.overlay} />

            {/* Modal de carga de datos */}
            <Modal
                visible={isModalCargaVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡No se cargaron los datos!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>No se pudieron cargar los datos. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal de indicador de progreso */}
            <Modal
                visible={isModalProgresoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡Los registros están siendo cargados!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>Por favor, espere un momento mientras se cargan los registros al sistema.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal de verificación de importación de archivo CSV */}
            <Modal
                visible={isModalExcelVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡No se cargó el archivo CSV!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>No se pudo cargar el archivo CSV o el formato no es el correcto. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalExcelVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de verificación de encabezados */}
            <Modal
                visible={isModalEncabezadoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡Los encabezados no coinciden!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>Los encabezados no coinciden con los establecidos. Por favor, revise su archivo CSV.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalEncabezadoVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de verificación de carácteres númericos */}
            <Modal
                visible={isModalCaracterVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡Los caracteres no coinciden!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>Hay caracteres de tipo texto donde deberían estar caracteres numéricos. Por favor, revise su archivo CSV.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalCaracterVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de verificación de respuesta del servidor */}
            <Modal
                visible={isModalRespuestaVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡La respuesta no fue exitosa!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>La respuesta no fue exitosa. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalRespuestaVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de verificación del proceso de solicitud */}
            <Modal
                visible={isModalSolicitudVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡La solicitud ha fallado!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>La solicitud ha fallado. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalSolicitudVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Botón de Volver */}
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#1F2C73" style={styles.iconoFlecha} />
            </Pressable>

            {/* Contenedor Principal */}
            <View style={styles.centeredContainer}>
                <View style={styles.card}>
                    {/* Título Principal */}
                    <Text style={styles.title}>Subir Repuesto</Text>

                    {/* Ternario que verifica si el archivo se importo */}
                    {/* Si el archivo se importo, presenta el contendeor donde se ubican las tablas con registros correctos e incorrectos */}
                    {archivoImportado ? (
                        <View style={{ flexShrink: 1, alignItems: 'center', width: '100%' }}>
                            <ScrollView vertical showsVerticalScrollIndicator={true} style={styles.verticalScroll}>
                                <View style={styles.tableContainer}>
                                    {/* Tabla con registros correctos */}
                                    <Text style={styles.tableTitle}>Registros Correctos</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
                                        <View style={{ minWidth: 1000 }}>
                                            {/* Encabezado de la tabla */}
                                            <View style={[styles.row, styles.header]}>
                                                {tableHead.map((header, index) => (
                                                    <Text
                                                        key={index}
                                                        style={[styles.text, styles.headerText, { width: widthArr[index] }]}
                                                    >
                                                        {header}
                                                    </Text>
                                                ))}
                                            </View>
                                            {/* Cuerpo de la tabla */}
                                            <ScrollView style={styles.dataWrapper} nestedScrollEnabled={true}>
                                                {datosCorrectos.map((rowData, index) => (
                                                    <View key={index} style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}>
                                                        {tableHead.map((header, idx) => (
                                                            <Text key={idx} style={[styles.text, { width: widthArr[idx], paddingVertical: 10 }]}>
                                                                {rowData[header]}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </ScrollView>

                                    {/* Tabla con registros erroneos */}
                                    <Text style={[styles.tableTitle, { marginTop: 20 }]}>Registros con Errores</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
                                        <View style={{ minWidth: 1000 }}>
                                            {/* Encabezado de la tabla */}
                                            <View style={[styles.row, styles.header]}>
                                                {tableHead.map((header, index) => (
                                                    <Text
                                                        key={index}
                                                        style={[styles.text, styles.headerText, { width: widthArr[index] }]}
                                                    >
                                                        {header}
                                                    </Text>
                                                ))}
                                            </View>
                                            {/* Cuerpo de la tabla */}
                                            <ScrollView style={styles.dataWrapper} nestedScrollEnabled={true}>
                                                {datosErroneos.map((rowData, index) => (
                                                    <View key={index} style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}>
                                                        {tableHead.map((header, idx) => (
                                                            <Text key={idx} style={[styles.text, { width: widthArr[idx], paddingVertical: 10 }]}>
                                                                {rowData[header]}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </ScrollView>
                                </View>
                            </ScrollView>
                            {/* Botón para subir los registros a la base de datos */}
                            <Pressable style={styles.subirButton} onPress={GuardarRepuestosCSV}>
                                <Text style={styles.subirButtonText}>Subir Información</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            {/* Si no se importa el archivo presentar una sección la cual indica al usuario el procedimiento de importación */}
                            <Text style={styles.description}>
                                Por favor, seleccione y cargue un archivo <Text style={FONTS.boldText}>CSV</Text> en formato <Text style={FONTS.boldText}>UTF-8</Text> para importar los repuestos correctamente.
                            </Text>
                            {/* Botón para importar el archivo CSV Excel */}
                            <Pressable
                                style={styles.importButton}
                                onPress={importCSV}
                            >
                                <Text style={styles.importButtonText}>Importar Archivo</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    // Background de la vista
    background: { flex: 1, width: '100%', height: '100%' },
    // Fondo azul semitransparente
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.primary, opacity: 0.5 },
    // Botón de back
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 10,
    },
    iconoFlecha: { left: 5 },
    // Contenedor Principal
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 15, padding: 25, paddingHorizontal: 15, alignItems: 'center', width: '85%' },
    // Título Principal
    title: { fontSize: 26, fontFamily: 'Poppins-Bold', color: COLORS.secondary, marginBottom: 10, textAlign: 'center' },
    // Descripción paso de importación
    description: { fontSize: 16, fontFamily: 'Poppins-Regular', color: 'black', textAlign: 'center', marginBottom: 20 },
    // Botón Importación
    importButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: 250,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    importButtonText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: COLORS.primary },
    // Tablas
    tableContainer: { marginTop: 20, width: '100%', paddingHorizontal: 10, alignItems: 'center', overflow: 'hidden' },
    tableTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: COLORS.secondary, marginBottom: 10 },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    header: {
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    headerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 5,
    },
    // Scroll Tablas
    horizontalScroll: { width: '100%', overflow: 'hidden', flexGrow: 0 },
    verticalScroll: { width: '100%', maxHeight: 400 },
    dataWrapper: {
        maxHeight: 300,
        overflow: 'scroll',
        paddingBottom: 10,
    },
    // Texto Filas
    text: {
        textAlign: 'center',
        fontWeight: '400',
        paddingVertical: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
    // Botón de subir
    subirButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: 250,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    subirButtonText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: COLORS.primary },
    // Modal
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 400, // ✅ se adapta a pantallas pequeñas
        width: '90%', // ✅ ocupa un 90% pero nunca más que 400
        overflow: 'hidden',
    },
    titleModal: {
        fontSize: 26, fontFamily: 'Poppins-Bold', color: COLORS.secondary, marginBottom: 10, textAlign: 'center',
    },
    descriptionModal: {
        fontSize: 16, fontFamily: 'Poppins-Regular', color: 'black', textAlign: 'center', marginBottom: 20, width: '100%',
    },
    logoModal: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    buttonModal: {
        backgroundColor: COLORS.quaternary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: 'auto',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '100%',
    },
    buttonModalText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: 'white' },
});

export default RepuestoCSV;
