const mockDb = {
    query: jest.fn(),
};

jest.mock("../config/database", () => ({
    getConnection: () => mockDb,
}));

const UserRepository = require("../repositories/user.repository");

describe("UserRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("debe retornar todos los usuarios si no hay termino de busqueda", async () => {
            const mockResults = [[{ id: 1, nombre: "Alexander" }, { id: 2, nombre: "Ana" }]];
            mockDb.query.mockImplementation((query, callback) => {
                expect(query).toBe("CALL GetUsers()");
                callback(null, mockResults);
            });
            const users = await UserRepository.getAll();
            expect(users).toEqual(mockResults[0]);
        });
        it("debe retornar los usuarios filtrados si hay termino de busqueda", async () => {
            const search = "Alexander";
            const mockResults = [{ id: 1, nombre: "Alexander Cipriano" }];
            mockDb.query.mockImplementation((query, params, callback) => {
                expect(query).toContain("SELECT * FROM users WHERE nombre LIKE ?");
                expect(params).toEqual([`%${search}%`, `%${search}%`, `%${search}%`]);
                callback(null, mockResults);
            });
            const users = await UserRepository.getAll(search);
            expect(users).toEqual(mockResults);
        });
        it("debe rechazar la promesa si ocurre un error en la base de datos", async () => {
            mockDb.query.mockImplementation((query, callback) => {
                callback(new Error("Database error"), null);
            });
            await expect(UserRepository.getAll()).rejects.toThrow("Database error");
        });
        it("debe rechazar la promesa si la busqueda falla", async () => {
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("Search error"), null);
            });
            await expect(UserRepository.getAll("error")).rejects.toThrow("Search error");
        });
    });

    describe("create", () => {
        it("debe insertar un usuario y retornar mensaje de exito", async () => {
            const user = { nombre: "A", apellidos: "B", dni: "C", direccion: "D", telefono: "E", correo: "F" };
            mockDb.query.mockImplementation((query, params, callback) => {
                expect(query).toBe("CALL InsertUser(?, ?, ?, ?, ?, ?)");
                expect(params).toEqual(["A", "B", "C", "D", "E", "F"]);
                callback(null, { insertId: 1 });
            });
            const result = await UserRepository.create(user);
            expect(result).toEqual({ message: "Usuario creado" });
        });
        it("debe fallar si hay error en base de datos al crear", async () => {
            const user = { nombre: "A", apellidos: "B", dni: "C", direccion: "D", telefono: "E", correo: "F" };
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("DB Error"));
            });
            await expect(UserRepository.create(user)).rejects.toThrow("DB Error");
        });
        it("debe fallar si faltan permisos para crear usuario", async () => {
            const user = { nombre: "A", apellidos: "B", dni: "C", direccion: "D", telefono: "E", correo: "F" };
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("Access denied"));
            });
            await expect(UserRepository.create(user)).rejects.toThrow("Access denied");
        });
    });

    describe("update", () => {
        it("debe actualizar un usuario y retornar mensaje de exito", async () => {
            const id = 1;
            const user = { nombre: "A", apellidos: "B", dni: "C", direccion: "D", telefono: "E", correo: "F" };
            mockDb.query.mockImplementation((query, params, callback) => {
                expect(query).toBe("CALL UpdateUser(?, ?, ?, ?, ?, ?, ?)");
                expect(params).toEqual([id, "A", "B", "C", "D", "E", "F"]);
                callback(null, { affectedRows: 1 });
            });
            const result = await UserRepository.update(id, user);
            expect(result).toEqual({ message: "Usuario actualizado" });
        });
        it("debe fallar si el id para actualizar no existe o BD falla", async () => {
            const user = { nombre: "A" };
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("Update UpdateUser rejected"));
            });
            await expect(UserRepository.update(999, user)).rejects.toThrow("Update UpdateUser rejected");
        });
        it("debe fallar por un error de sintaxis en los params al actualizar", async () => {
            const user = { nombre: null };
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("Params error"));
            });
            await expect(UserRepository.update(1, user)).rejects.toThrow("Params error");
        });
    });

    describe("delete", () => {
        it("debe eliminar un usuario por id y retornar mensaje de exito", async () => {
            const id = 1;
            mockDb.query.mockImplementation((query, params, callback) => {
                expect(query).toBe("CALL DeleteUser(?)");
                expect(params).toEqual([id]);
                callback(null, { affectedRows: 1 });
            });
            const result = await UserRepository.delete(id);
            expect(result).toEqual({ message: "Usuario eliminado" });
        });
        it("debe fallar si la BD rechaza borrar al usuario", async () => {
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("Cannot delete active user"));
            });
            await expect(UserRepository.delete(1)).rejects.toThrow("Cannot delete active user");
        });
        it("debe fallar si el ID proporcionado para eliminar es nulo/inválido en BD", async () => {
            mockDb.query.mockImplementation((query, params, callback) => {
                callback(new Error("Invalid ID syntax"));
            });
            await expect(UserRepository.delete(null)).rejects.toThrow("Invalid ID syntax");
        });
    });
});
