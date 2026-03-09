const request = require("supertest");
const express = require("express");

const mockUserRepository = {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
jest.mock("../repositories/user.repository", () => mockUserRepository);

const mockUserFactory = {
    createUser: jest.fn(),
};
jest.mock("../factories/user.factory", () => mockUserFactory);

const userController = require("../controllers/user.controller");

const app = express();
app.use(express.json());
app.get("/api/users", userController.getUsers);
app.post("/api/users", userController.createUser);
app.put("/api/users/:id", userController.updateUser);
app.delete("/api/users/:id", userController.deleteUser);

describe("UserController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/users", () => {
        it("debe retornar los usuarios con status 200", async () => {
            const mockUsers = [{ id: 1, nombre: "Alexander" }, { id: 2, nombre: "Maria" }];
            mockUserRepository.getAll.mockResolvedValue(mockUsers);
            const response = await request(app).get("/api/users");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(mockUserRepository.getAll).toHaveBeenCalledWith(undefined);
        });
        it("debe manejar errores y retornar status 500", async () => {
            mockUserRepository.getAll.mockRejectedValue(new Error("Database error"));
            const response = await request(app).get("/api/users");
            expect(response.status).toBe(500);
        });
        it("debe manejar errores logicos y devolver status 500 en GET", async () => {
            mockUserRepository.getAll.mockImplementation(() => {
                throw new Error("Logic unexpected failure");
            });

            const response = await request(app).get("/api/users?search=x");
            expect(response.status).toBe(500);
        });
    });

    describe("POST /api/users", () => {
        it("debe crear un usuario y retornar el resultado con status 200", async () => {
            const inputUser = { nombre: "Alexander" };
            const factUser = { nombre: "Alexander", apellidos: "Cipriano", ...inputUser };
            const expectedResult = { message: "Usuario creado" };
            mockUserFactory.createUser.mockReturnValue(factUser);
            mockUserRepository.create.mockResolvedValue(expectedResult);
            const response = await request(app).post("/api/users").send(inputUser);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedResult);
            expect(mockUserFactory.createUser).toHaveBeenCalledWith(inputUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith(factUser);
        });
        it("debe retornar status 400 si falta validacion del factory", async () => {
            const inputUser = { nombre: "Alexander" };
            mockUserFactory.createUser.mockImplementation(() => {
                throw new Error("Todos los campos son obligatorios");
            });
            const response = await request(app).post("/api/users").send(inputUser);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Todos los campos son obligatorios" });
        });
        it("debe retornar status 400 si el repositorio falla al insertar", async () => {
            const inputUser = { nombre: "Alexander Extra" };
            mockUserFactory.createUser.mockReturnValue(inputUser);
            mockUserRepository.create.mockRejectedValue(new Error("Error de restricción unica DNI"));
            const response = await request(app).post("/api/users").send(inputUser);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Error de restricción unica DNI" });
        });
    });

    describe("PUT /api/users/:id", () => {
        it("debe actualizar un usuario y retornar status 200", async () => {
            const inputUser = { nombre: "Alexander Editado" };
            const expectedResult = { message: "Usuario actualizado" };
            mockUserRepository.update.mockResolvedValue(expectedResult);
            const response = await request(app).put("/api/users/1").send(inputUser);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedResult);
            expect(mockUserRepository.update).toHaveBeenCalledWith("1", inputUser);
        });
        it("debe fallar con status 500 si hay error en la base de datos", async () => {
            mockUserRepository.update.mockRejectedValue(new Error("Update failed"));
            const response = await request(app).put("/api/users/1").send({});
            expect(response.status).toBe(500);
        });
        it("debe fallar con status 500 por error interno en variables PUT", async () => {
            mockUserRepository.update.mockImplementation(() => {
                throw new Error("Internal memory limit");
            });
            const response = await request(app).put("/api/users/8").send({ correo: "x@x" });
            expect(response.status).toBe(500);
        });
    });

    describe("DELETE /api/users/:id", () => {
        it("debe eliminar un usuario y retornar status 200", async () => {
            const expectedResult = { message: "Usuario eliminado" };
            mockUserRepository.delete.mockResolvedValue(expectedResult);
            const response = await request(app).delete("/api/users/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedResult);
            expect(mockUserRepository.delete).toHaveBeenCalledWith("1");
        });
        it("debe dar error 500 al intentar eliminar una relacion vinculada DB", async () => {
            mockUserRepository.delete.mockRejectedValue(new Error("Foreign key constraint"));
            const response = await request(app).delete("/api/users/5");
            expect(response.status).toBe(500);
        });
        it("debe dar error 500 ante fallo inesperado de sistema al eliminar", async () => {
            mockUserRepository.delete.mockImplementation(() => {
                throw new Error("Unexpected critical error");
            });
            const response = await request(app).delete("/api/users/999");
            expect(response.status).toBe(500);
        });
    });
});
