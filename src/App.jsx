import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    obtenerTareas();
  }, []);

  //Funcion asincrona 'GET' para obtener las tareas de la BD
  const obtenerTareas = async () => {
    try {
      const res = await fetch('http://localhost:5000/gustavo', { method: 'GET' });
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      alert("Error al obtener tareas");
    }
  };

  //Funcion asincrona 'POST' para crea una nueva tarea en la BD
  const handleCrear = async () => {
    if (!title.trim()) {
      alert("El título es requerido");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/gustavo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        obtenerTareas();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al crear");
      }
    } catch (err) {
      alert("Error en la conexión");
    }
  };

  //Funcion asincrona 'DELETE' para eliminar una tareas de la BD
  const eliminarTarea = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/gustavo/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        obtenerTareas(); // actualiza lista después de eliminar
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al eliminar");
      }
    } catch (err) {
      alert("Error en la conexión");
    }
  };

  return (
    <main className='main'>
      <div id='container'>
        <h2>Crear Nueva Tarea</h2>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button id='crearTarea' onClick={handleCrear}>Crear Tarea</button>
      </div>

      <div id='containerList'>
        {tareas.map(tarea => (
          <div key={tarea.id} className='card'>
            <h4>{tarea.title}</h4>
            <p className='cardDescription'>{tarea.description}</p>
            <p className='cardDate'>{tarea.created_at}</p>
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;