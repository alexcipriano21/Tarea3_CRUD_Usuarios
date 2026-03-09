"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const loadUsers = async (signal?: AbortSignal) => {
    try {
      const url = search
        ? `http://localhost:5000/users?search=${search}`
        : `http://localhost:5000/users`;

      const res = await fetch(url, { signal });
      const data = await res.json();
      setUsers(data);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error cargando usuarios:", error);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const delay = setTimeout(() => {
      loadUsers(controller.signal);
    }, 300);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [search]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editing) {
      await fetch(`http://localhost:5000/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setOpen(false);
    setEditing(null);
    setForm({
      nombre: "",
      apellidos: "",
      dni: "",
      direccion: "",
      telefono: "",
      correo: "",
    });

    loadUsers();
  };

  const handleEdit = (user: any) => {
    setEditing(user);
    setForm(user);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    });
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <Card className="w-full max-w-6xl p-6 shadow-xl rounded-2xl">
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">CRUD Usuarios</h1>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>+ Usuario</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editing ? "Editar Usuario" : "Nuevo Usuario"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                  <Input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
                  <Input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />
                  <Input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
                  <Input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
                  <Input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} />

                  <Button onClick={handleSubmit} className="w-full">
                    Guardar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Buscar por nombre, apellido o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              )}

              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.apellidos}</TableCell>
                  <TableCell>{user.dni}</TableCell>
                  <TableCell>{user.direccion}</TableCell>
                  <TableCell>{user.telefono}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(user)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}