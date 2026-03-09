class UserFactory {
  static createUser(data) {
    const { nombre, apellidos, dni, direccion, telefono, correo } = data;

    if (!nombre || !apellidos || !dni || !direccion || !telefono || !correo) {
      throw new Error("Todos los campos son obligatorios");
    }

    return {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      correo: correo.toLowerCase().trim(),
    };
  }
}

module.exports = UserFactory;