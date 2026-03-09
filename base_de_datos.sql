CREATE DATABASE crud_v2;
USE crud_v2;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(15) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL
);

DELIMITER //

CREATE PROCEDURE GetUsers()
BEGIN
    SELECT id, nombre, apellidos, dni, direccion, telefono, correo
    FROM users;
END //

CREATE PROCEDURE InsertUser(
    IN p_nombre VARCHAR(50),
    IN p_apellidos VARCHAR(100),
    IN p_dni VARCHAR(15),
    IN p_direccion VARCHAR(150),
    IN p_telefono VARCHAR(20),
    IN p_correo VARCHAR(100)
)
BEGIN
    INSERT INTO users(nombre, apellidos, dni, direccion, telefono, correo)
    VALUES(p_nombre, p_apellidos, p_dni, p_direccion, p_telefono, p_correo);
END //

CREATE PROCEDURE UpdateUser(
    IN p_id INT,
    IN p_nombre VARCHAR(50),
    IN p_apellidos VARCHAR(100),
    IN p_dni VARCHAR(15),
    IN p_direccion VARCHAR(150),
    IN p_telefono VARCHAR(20),
    IN p_correo VARCHAR(100)
)
BEGIN
    UPDATE users
    SET nombre = p_nombre,
        apellidos = p_apellidos,
        dni = p_dni,
        direccion = p_direccion,
        telefono = p_telefono,
        correo = p_correo
    WHERE id = p_id;
END //

CREATE PROCEDURE DeleteUser(IN p_id INT)
BEGIN
    DELETE FROM users WHERE id = p_id;
END //

DELIMITER ;