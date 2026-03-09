const UserFactory = require("../factories/user.factory");

describe("UserFactory", () => {
  describe("createUser", () => {
    it("debe crear un usuario formateado correctamente cuando se proporcionan datos válidos", () => {
      const inputData = {
        nombre: "  Alexander  ",
        apellidos: "  Cipriano  ",
        dni: " 74968344 ",
        direccion: "  Calle Verdad 123  ",
        telefono: " 600123456 ",
        correo: "  ALEXANDER@EXAMPLE.COM  ",
      };
      const expectedUser = {
        nombre: "Alexander",
        apellidos: "Cipriano",
        dni: "74968344",
        direccion: "Calle Verdad 123",
        telefono: "600123456",
        correo: "alexander@example.com",
      };

      const user = UserFactory.createUser(inputData);
      expect(user).toEqual(expectedUser);
    });

    it("debe lanzar un error si falta el nombre", () => {
      const inputData = { apellidos: "Cipriano", dni: "74968344", direccion: "Calle Verdad 123", telefono: "600123456", correo: "alexander@example.com" };
      expect(() => UserFactory.createUser(inputData)).toThrow("Todos los campos son obligatorios");
    });

    it("debe lanzar un error si falta el apellido", () => {
      const inputData = { nombre: "Alexander", dni: "74968344", direccion: "Calle Verdad 123", telefono: "600123456", correo: "alexander@example.com" };
      expect(() => UserFactory.createUser(inputData)).toThrow("Todos los campos son obligatorios");
    });

    it("debe lanzar un error si falta el dni", () => {
      const inputData = { nombre: "Alexander", apellidos: "Cipriano", direccion: "Calle Verdad 123", telefono: "600123456", correo: "alexander@example.com" };
      expect(() => UserFactory.createUser(inputData)).toThrow("Todos los campos son obligatorios");
    });

    it("debe lanzar un error si falta la direccion", () => {
      const inputData = { nombre: "Alexander", apellidos: "Cipriano", dni: "74968344", telefono: "600123456", correo: "alexander@example.com" };
      expect(() => UserFactory.createUser(inputData)).toThrow("Todos los campos son obligatorios");
    });

    it("debe lanzar un error si falta el telefono", () => {
      const inputData = { nombre: "Alexander", apellidos: "Cipriano", dni: "74968344", direccion: "Calle Verdad 123", correo: "alexander@example.com" };
      expect(() => UserFactory.createUser(inputData)).toThrow("Todos los campos son obligatorios");
    });

    it("debe lanzar un error si falta el correo", () => {
      const inputData = { nombre: "Alexander", apellidos: "Cipriano", dni: "74968344", direccion: "Calle Verdad 123", telefono: "600123456" };
      expect(() => UserFactory.createUser(inputData)).toThrow("Todos los campos son obligatorios");
    });
  });
});
