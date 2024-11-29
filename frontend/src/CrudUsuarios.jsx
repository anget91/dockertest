import  { useState, useEffect } from "react";

const CrudUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/usuarios";

  // Obtener usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const body = JSON.stringify({ nombre, email });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) throw new Error("Error al guardar usuario");
      
      setNombre("");
      setEmail("");
      setEditingId(null);
      fetchUsuarios();
    } catch (error) {
      console.error(error.message);
    }
  };

  // Editar usuario
  const handleEdit = (usuario) => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setEditingId(usuario.id);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar usuario");

      fetchUsuarios();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>CRUD de Usuarios</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
      </form>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nombre} - {usuario.email}
            <button onClick={() => handleEdit(usuario)}>Editar</button>
            <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudUsuarios;
