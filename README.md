# PeriferiApp

Aplicación móvil desarrollada con **React Native**, orientada a la gestión y visualización de información de usuarios, favoritos y detalles, siguiendo buenas prácticas de arquitectura y desarrollo de software moderno.

---

## Tecnologías principales

- **React Native 0.80.1**: Framework principal para desarrollo multiplataforma.
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
