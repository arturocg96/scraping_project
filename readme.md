# Node.js Web Scraper API

Este proyecto es una API desarrollada en Node.js que permite realizar scraping de eventos sociales y políticos de la web del Ayuntamiento de León , almacenarlos en una base de datos y exponer estos datos a través de endpoints RESTful. Está diseñado con una arquitectura modular y utiliza tecnologías modernas como Express, Axios, Cheerio y MySQL.

## Características

- **Scraping de datos:** Extrae eventos sociales y políticos de las página del Ayuntamiento de León.
- **Almacenamiento en base de datos:** Guarda los datos scrapeados en una base de datos MySQL, evitando duplicados.
- **Endpoints RESTful:** Exposición de datos mediante rutas organizadas.
- **Validación de datos:** Controla que los datos estén completos antes de almacenarlos.
- **Modularidad:** Código dividido en controladores, servicios, modelos y rutas para facilitar su mantenimiento y escalabilidad.

## Requisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- Variables de entorno configuradas en un archivo `.env`

## Variables de entorno requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos
DB_PORT=puerto_base_de_datos
PORT=3000
```

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

#### 1. Clona el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```
### 2. Instala dependencias
Asegúrate de tener Node.js y npm instalados. Luego ejecuta:
```bash
npm install
```

#### 3. Configura la base de datos
Ejecuta  el script SQL adjunto junto  al proyecto en la carpeta db. 

### 4. Inicia el servidor. 
Ejecuta el siguiente comando para iniciar la aplicación:
```bash
npm run dev
```

#### 5. Realización de pruebas
Las pruebas de los endpoints están disponibles en el archivo .rest incluido en el proyecto. Puedes usar herramientas como REST Client en Visual Studio Code para ejecutarlas.

# Uso de la API

## Endpoints Disponibles

### Scraping Completo

#### Realizar scraping de eventos y agenda
**GET** `/api/scrape`

- **Descripción:** Realiza el scraping completo de eventos y agenda desde fuentes externas, almacenando los resultados en la base de datos. También gestiona duplicados y errores durante el proceso.


### Eventos

#### Obtener todos los eventos
**GET** `/api/eventos`

- **Descripción:** Obtiene todos los eventos almacenados en la base de datos.

#### Realizar scraping y guardar eventos
**GET** `/api/eventos/scrape`

- **Descripción:** Realiza el scraping de eventos desde una fuente externa, almacena los eventos nuevos en la base de datos y detecta duplicados para evitar almacenarlos nuevamente.

---

### Agenda

#### Obtener todos los eventos de la agenda
**GET** `/api/agenda`

- **Descripción:** Obtiene todos los eventos de la agenda almacenados en la base de datos.

#### Realizar scraping y guardar agenda
**GET** `/api/agenda/scrape`

- **Descripción:** Realiza el scraping de eventos de la agenda desde una fuente externa, almacena los eventos nuevos en la base de datos y detecta duplicados para evitar almacenarlos nuevamente.

---

### Avisos

#### Obtener todos los avisos
**GET** `/api/avisos`

- **Descripción:** Obtiene todos los avisos almacenados en la base de datos.

#### Realizar scraping y guardar avisos
**GET** `/api/avisos/scrape`

- **Descripción:** Realiza el scraping de avisos desde una fuente externa, almacena los avisos nuevos en la base de datos y detecta duplicados para evitar almacenarlos nuevamente.

---

### Noticias

#### Obtener todas las noticias
**GET** `/api/noticias`

- **Descripción:** Obtiene todas las noticias almacenadas en la base de datos.

---

#### Realizar scraping y guardar noticias
**GET** `/api/noticias/scrape`

- **Descripción:** Realiza el scraping de noticias desde una fuente externa, almacena las noticias nuevas en la base de datos y detecta duplicados para evitar almacenarlas nuevamente.

---


*Este documento se irá ampliando y actualizando constantemente.
