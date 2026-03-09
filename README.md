PATRONES DE DISEÑO IMPLEMENTADOS
1. Introducción
En este proyecto CRUD de usuarios se implementaron tres patrones de diseño con el objetivo de mejorar la organización del código, aplicar principios SOLID y aumentar la mantenibilidad y escalabilidad del sistema. Los patrones implementados son:

1.1 Repository
El Repository encapsula la lógica de acceso a datos y desacopla la capa de persistencia de la lógica de negocio.

Implementación en el proyecto
Se creó la carpeta:
repositories/user.repository.js

El repositorio contiene métodos como:
- getAll(search)
- create(user)
- update(id, user)
- delete(id)

El controlador no ejecuta consultas SQL directamente. En su lugar, delega la responsabilidad al repositorio.

Beneficios obtenidos:
- Separación clara de responsabilidades.
- Bajo acoplamiento entre lógica de negocio y base de datos.
- Facilidad para cambiar el motor de base de datos sin afectar otras capas.
- Código más limpio y mantenible.

1.2 Singleton
El Singleton garantiza que una clase tenga una única instancia y proporciona un punto global de acceso a ella.

Implementación en el proyecto
Se implementó en:
config/database.js

Se creó una clase Database que:
- Genera una única conexión a MySQL.
- Retorna siempre la misma instancia.
- Evita múltiples conexiones innecesarias.

Beneficios obtenidos:
- Control centralizado de la conexión a la base de datos.
- Uso eficiente de recursos.
- Prevención de múltiples instancias de conexión.

1.3 Factory 
El Factory encapsula la lógica de creación de objetos y delega esta responsabilidad a una clase especializada, evitando que el controlador instancie o construya directamente los objetos.

Implementación en el proyecto
Se creó el archivo:
factories/user.factory.js

La fábrica expone el método:
UserFactory.createUser(data)

Este método:
- Valida que todos los campos obligatorios estén presentes.
- Normaliza los datos (por ejemplo, elimina espacios y convierte el correo a minúsculas).
- Devuelve un objeto Usuario listo para ser persistido en la base de datos.

El controlador no construye manualmente el objeto ni realiza validaciones, sino que delega esta responsabilidad al Factory.

Beneficios obtenidos:
- Centralización de la lógica de creación.
- Validación previa antes de la persistencia.
- Cumplimiento del principio de responsabilidad única (SRP).
- Reducción de acoplamiento entre controlador y modelo.
- Mayor mantenibilidad del sistema.

2. Relación entre los Patrones

El flujo del sistema funciona de la siguiente manera:
- El Router recibe la petición HTTP.
- El Controller procesa la solicitud.
- El Controller utiliza la Factory para crear el objeto Usuario. 
- El Controller delega el acceso a datos al Repository.
- El Repository utiliza la conexión Singleton para interactuar con la base de datos.

Esta combinación permite:
- Separación clara de capas.
- Código modular.
- Mejor mantenibilidad.
- Escalabilidad futura.