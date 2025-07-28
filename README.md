# PeriferiApp: Geofencing Assistant

PeriferiApp es una aplicación móvil desarrollada con React Native y TypeScript. Su objetivo principal es permitir a los usuarios crear y gestionar "geocercas" (áreas geográficas virtuales). La aplicación notifica activamente al usuario cada vez que su ubicación actual entra o sale de una de estas geocercas predefinidas.

## Características Principales

- **Autenticación de Usuarios**: Sistema de inicio de sesión seguro para gestionar los datos de cada usuario.
- **Creación de Geocercas**: Los usuarios pueden definir una geocerca especificando un punto central (latitud, longitud) y un radio.
- **Notificaciones en Tiempo Real**: La aplicación monitorea la ubicación del dispositivo y envía notificaciones push cuando el usuario cruza los límites de una geocerca (entrada/salida).
- **Listado y Detalles**: Todas las geocercas creadas se guardan y se muestran en una lista. El usuario puede ver los detalles de cada una.
- **Gestión de Favoritos**: Los usuarios pueden marcar y desmarcar geocercas como favoritas para un acceso rápido.

## Arquitectura del Proyecto: Clean Architecture

El proyecto está estructurado siguiendo los principios de **Clean Architecture**. Esta arquitectura separa el software en capas, con una regla estricta de dependencia: las capas externas dependen de las internas, pero las internas no saben nada sobre las externas. Esto hace que la lógica de negocio (el núcleo de la aplicación) sea independiente de la base de datos, la interfaz de usuario y cualquier framework externo.

```
┌──────────────────┐
│  Presentation    │  (UI: Screens, Components, Hooks)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      Domain      │  (Business Logic: Usecases, Models)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│       Data       │  (Data Sources: Repositories, API, Storage)
└──────────────────┘
```

### Capa de Dominio (`src/domain`)

Es el corazón de la aplicación. Contiene la lógica de negocio pura y no tiene dependencias de ninguna otra capa. Se divide en:

- **Models**: Define las entidades de negocio (`Geofence`, `User`). Son estructuras de datos simples.
- **Repositories (Interfaces)**: Define los contratos (`IFavoritesRepository`, `IGeofencesRepository`) que la capa de datos debe implementar. El dominio no sabe _cómo_ se obtienen los datos, solo _qué_ operaciones se pueden realizar.
- **Usecases**: Contiene las acciones específicas que un usuario puede realizar (`saveGeofence`, `addFavorite`, `isWithinGeofence`). Cada caso de uso encapsula una única pieza de lógica de negocio.

### Capa de Datos (`src/data`)

Implementa las interfaces de repositorio definidas en el dominio. Es responsable de decidir de dónde provienen los datos (API, base de datos local, etc.).

- **Repositories (Implementations)**: Implementa los contratos del dominio. Por ejemplo, `GeofencesRepository` podría obtener datos de una API remota o del `AsyncStorage` local.
- **API / Storage**: Lógica de bajo nivel para interactuar con fuentes de datos externas, como `AsyncStorage` o llamadas de red.

### Capa de Presentación (`src/presentation`)

Es la capa de la interfaz de usuario (UI). Es responsable de mostrar los datos al usuario y de capturar sus interacciones.

- **Screens**: Componentes que representan pantallas completas de la aplicación (`GeofenceListScreen`, `LoginScreen`).
- **Components**: Componentes reutilizables (`CustomButton`, `FavoriteButton`).
- **Hooks**: Hooks de React personalizados (`useGeofenceList`, `useLogin`) que conectan la UI con los casos de uso del dominio para ejecutar la lógica de negocio.

## SOLID y Buenas Prácticas

El proyecto se adhiere a los principios SOLID para crear un software robusto y mantenible:

- **(S) Principio de Responsabilidad Única**: Cada componente, hook y caso de uso tiene una única responsabilidad. Por ejemplo, el caso de uso `addFavorite` solo se encarga de la lógica para agregar un favorito, mientras que el componente `FavoriteButton` solo se encarga de su representación visual y de invocar la acción correspondiente.

- **(O) Principio de Abierto/Cerrado**: La arquitectura permite agregar nuevas funcionalidades sin modificar el código existente. Por ejemplo, para agregar una nueva fuente de datos (como Firebase), solo necesitaríamos crear una nueva implementación del repositorio en la capa de datos, sin tocar el dominio ni la presentación.

- **(L) Principio de Sustitución de Liskov**: Las implementaciones de los repositorios en la capa de datos (`GeofencesRepository`) son sustituibles por cualquier otra implementación que cumpla con el contrato de la interfaz (`IGeofencesRepository`) sin afectar el comportamiento del dominio.

- **(I) Principio de Segregación de Interfaces**: Se definen interfaces específicas para cada necesidad. Por ejemplo, `IAuthRepository` y `IFavoritesRepository` son interfaces separadas, por lo que un cliente que solo necesita autenticación no depende de los métodos de favoritos.

- **(D) Principio de Inversión de Dependencias**: Este es el pilar de nuestra Clean Architecture. La capa de `Domain` no depende de la capa de `Data`; ambas dependen de abstracciones (las interfaces de repositorio). Esto permite que la lógica de negocio sea completamente independiente de los detalles de implementación de los datos.

## Estructura de Directorios

La estructura del proyecto refleja la separación de capas:

```
periferiapp/
├── src/
│   ├── components/      # Componentes de UI reutilizables y globales
│   ├── data/            # Implementación de repositorios y fuentes de datos
│   ├── domain/          # Lógica de negocio, modelos y casos de uso
│   ├── hooks/           # Hooks personalizados para la lógica de presentación
│   ├── presentation/    # Pantallas, componentes de UI y navegación
│   ├── store/           # Gestión de estado global (ej. Zustand)
│   ├── types/           # Definiciones de tipos globales
│   └── utils/           # Funciones de utilidad
├── tests/               # Tests unitarios y de integración
└── README.md
```

## Testing

El proyecto cuenta con una estructura de tests centralizada en la carpeta `/tests`, que replica la estructura de `/src`. Esto facilita la localización de los tests y promueve una alta cobertura de código, asegurando la calidad y el correcto funcionamiento de la lógica de negocio y los componentes de la UI.

## Cómo Empezar

1.  **Clonar el repositorio**:

    ```bash
    git clone https://github.com/tu-usuario/periferiapp.git
    cd periferiapp
    ```

2.  **Instalar dependencias**:

    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar el entorno**:

    - Si es necesario, crea un archivo `.env` con las variables de entorno requeridas.

4.  **Ejecutar en iOS**:

    ```bash
    npx react-native run-ios
    ```

5.  **Ejecutar en Android**:
    ```bash
    npx react-native run-android
    ```

---

## Tecnologías principales

- **React Native**: Framework principal para desarrollo multiplataforma.
- **TypeScript**: Tipado estático para mayor robustez y mantenibilidad.
- **React Navigation**: Navegación entre pantallas (stack y tabs).
- **Zustand**: Manejo de estado global simple y eficiente.
- **React Query**: Gestión de datos remotos, caché y sincronización.
- **AsyncStorage**: Persistencia local de datos.
- **React Native Vector Icons**: Iconografía moderna y personalizable.
- **React Hook Form**: Manejo de formularios y validaciones.
- **Jest & Testing Library**: Pruebas unitarias y de hooks.
- **ESLint & Prettier**: Linting y formateo automático de código.

---

## Arquitectura y estructura

- **Modular y escalable**: Separación clara por capas y dominios.
  - `/src/presentation`: Pantallas, componentes UI y navegación.
  - `/src/hooks`: Hooks personalizados para lógica reutilizable.
  - `/src/store`: Estado global (Zustand) para autenticación, usuarios y favoritos.
  - `/src/data/api`: Llamadas y hooks para consumo de APIs.
  - `/src/data/storage`: Persistencia local (AsyncStorage).
  - `/src/domain/models`: Tipos y modelos de negocio.
- **Principio de responsabilidad única**: Cada módulo tiene una función clara.
- **Separación de lógica de UI y datos**: La lógica de negocio y acceso a datos está desacoplada de la interfaz.
- **Uso de hooks**: Para lógica compartida, side effects y gestión de estado local/global.

---

## ¿Cómo funciona la app?

- Al abrir la aplicación, puedes visualizar una **lista de usuarios** disponibles.
- Al seleccionar un usuario, accedes a la **pantalla de detalle**, donde puedes ver información ampliada de ese usuario.
- Si deseas agregar usuarios a favoritos, primero debes **iniciar sesión** (autenticación básica).
- Una vez autenticado, puedes **agregar uno o más usuarios a tu lista de favoritos**.
- Puedes consultar tus usuarios favoritos desde la sección correspondiente en la app.

---

## Buenas prácticas y principios aplicados

- **Clean Code**: Uso de nombres descriptivos y consistentes para variables, funciones, interfaces y carpetas. Las funciones son pequeñas, legibles y cumplen una sola responsabilidad.

- **DRY (Don't Repeat Yourself)**: Lógica reutilizable extraída en hooks personalizados (`/src/hooks`) y utilidades. Ejemplo: hooks para manejo de usuarios y favoritos.

- **KISS (Keep It Simple, Stupid)**: Soluciones simples y directas, evitando complejidad innecesaria en la lógica y la estructura de componentes.

- **Principios SOLID**:

  - **S**: Cada clase, función o módulo tiene una única responsabilidad (ejemplo: `User.ts` solo define el modelo de usuario).
  - **O**: El código es fácilmente extensible sin modificar lo existente, gracias al uso de interfaces y tipado fuerte (`IUserRepository`, `IFavoritesRepository`).
  - **L**: Las implementaciones pueden ser intercambiadas sin romper la funcionalidad, usando interfaces y patrones de inyección de dependencias.
  - **I**: Se crean interfaces específicas para cada caso de uso, evitando dependencias innecesarias.
  - **D**: Las dependencias se abstraen mediante interfaces, facilitando pruebas y cambios futuros.

- **Uso intensivo de TypeScript**: Tipado estricto en modelos, props y hooks. Se definen interfaces y tipos en `/src/domain/models` y `/src/domain/repositories`.

- **Separación de capas**:

  - **Presentación**: Pantallas y componentes UI en `/src/presentation`.
  - **Dominio**: Modelos y contratos de negocio en `/src/domain`.
  - **Datos**: Acceso a APIs y persistencia local en `/src/data`.

- **Manejo centralizado de estado**: Zustand para stores globales, React Query para datos remotos y caché, y AsyncStorage para persistencia local.

- **Manejo de errores**: Validaciones y mensajes claros en formularios y respuestas de API. Se capturan y muestran errores amigables al usuario.

- **Pruebas unitarias y de integración**: Uso de Jest y Testing Library para asegurar la calidad de hooks, stores y lógica de almacenamiento.

- **Formateo y linting automáticos**: Configuración de ESLint y Prettier para mantener el código limpio y consistente en todo el proyecto.

- **Convenciones de nombres y organización**:

  - Archivos y carpetas en inglés y con nombres descriptivos.
  - Imports organizados por bloques (librerías externas, módulos internos, estilos, etc.).
  - Componentes y hooks nombrados con prefijo `use` cuando corresponde.

- **Control de versiones**: `.gitignore` bien configurado para excluir archivos temporales, dependencias y archivos sensibles.

- **Accesibilidad y usabilidad**: Uso de componentes accesibles y buenas prácticas de UI para mejorar la experiencia de usuario.

- **Escalabilidad y mantenibilidad**: Estructura modular, separación por dominios y uso de interfaces para facilitar el crecimiento del proyecto y la incorporación de nuevas funcionalidades.

---

## Dependencias principales

- `react-native`
- `react`
- `@react-navigation/native` y stacks/tabs
- `@tanstack/react-query`
- `zustand`
- `@react-native-async-storage/async-storage`
- `react-native-vector-icons`
- `react-hook-form`

## Pruebas

- **Jest** para pruebas unitarias.
- **@testing-library/react-native** para pruebas de hooks y componentes.
- Cobertura de pruebas para lógica de autenticación, favoritos y hooks personalizados.

---

## Ejecución y despliegue

### Android

```sh
npm run android
```

### iOS

```sh
npm run ios
```

### Generar APK de producción

```sh
cd android
./gradlew assembleRelease
```

El APK estará en `android/app/build/outputs/apk/release/app-release.apk`

---

## Estructura de carpetas

```text
periferiapp/
├── android/
├── ios/
├── src/
│   ├── presentation/
│   ├── hooks/
│   ├── store/
│   ├── data/
│   │   ├── api/
│   │   ├── storage/
│   ├── domain/
│   │   └── models/
├── App.js / App.tsx
├── package.json
├── README.md
└── ...
```

---

## Recursos y enlaces útiles

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Query](https://tanstack.com/query/v5/docs/react-native/overview)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---
