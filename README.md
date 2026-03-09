## Pruebas Unitarias (Backend)

Para asegurar la calidad, estabilidad y el correcto funcionamiento de estos patrones de diseño, se implementó una suite de pruebas unitarias automatizadas utilizando **Jest** y **Supertest**.

## 3.1 Tecnologías utilizadas
- **Jest**: Framework principal para ejecutar las pruebas, aserciones y reportes.
- **Supertest**: Librería para simular peticiones HTTP reales (GET, POST, PUT, DELETE) contra la API sin levantar el servidor.
- **Cross-env**: Gestor para inyectar variables de entorno de forma multiplataforma durante la ejecución segura de las pruebas.

## 3.2 Cobertura de las Pruebas
Las pruebas están diseñadas aislando las diferentes capas arquitectónicas:
1.  **Factory (`tests/user.factory.test.js`)**: Valida que la estructura de los datos sea correcta y se normalice la información entrante.
2.  **Repository (`tests/user.repository.test.js`)**: Aísla la base de datos real utilizando simulaciones (*mocks*) para verificar que se gestionen correctamente las excepciones y flujos de MySQL.
3.  **Controller (`tests/user.controller.test.js`)**: Simula el enrutamiento HTTP para asegurar que los *endpoints* respondan siempre con los códigos de estado exactos (200, 400, 500).

## 3.3 ¿Cómo ejecutar las pruebas?

Para correr toda la suite de pruebas unitarias en el backend, sigue estos pasos:

1.  Abre una terminal y navega hasta el directorio del backend:
    ```bash
    cd backend
    ```
2.  Asegúrate de tener instaladas todas las dependencias (si aún no lo has hecho):
    ```bash
    npm install
    ```
3.  Ejecuta el script de pruebas:
    ```bash
    npm test
    ```

El script aislará automáticamente el entorno de desarrollo y te mostrará en consola el resumen y estado (Pass/Fail) de cada una de las pruebas diseñadas para el Factory, Repository y Controller.