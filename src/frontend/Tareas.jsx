import { useState, useEffect } from 'react';
import './Tareas.css';

const Tareas = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tareas, setTareas] = useState([]);

    const servidorUrl = 'http://localhost:5000/gustavo';

    useEffect(() => {
        obtenerTareas();
    }, []);

    function openDialog() {
        const dialog = document.getElementById('dialogContainer').showModal();
    }

    function closeDialog() {
        const dialog = document.getElementById('dialogContainer').close();
    }

    //Funcion asincrona 'GET' para obtener las tareas de la BD
    const obtenerTareas = async () => {
        try {
            const res = await fetch(servidorUrl, { method: 'GET' });
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
            const res = await fetch(servidorUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
            });

            if (res.ok) {
                setTitle("");
                setDescription("");
                closeDialog();
                // Actualiza la lista de tareas después de crear una nueva
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
            const res = await fetch(servidorUrl + `/${id}`, {
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
            <button onClick={openDialog} className='botonFlotante'>+ NUEVA TAREA</button>
            <dialog id='dialogContainer'>
                <div className="dialogContent">
                    <h2>CREAR NUEVA TAREA</h2>
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
                    <div className='dialogButtons'>
                        <button className='dialogButton' onClick={handleCrear}>GUARDAR</button>
                        <button className='dialogButton' onClick={closeDialog}>CANCELAR</button>
                    </div>
                </div>
            </dialog>

            <div id='containerList'>
                {tareas.map(tarea => (
                <div key={tarea.id} className='card'>
                    <h4>{tarea.title}</h4>
                    <p className='cardDescription'>{tarea.description}</p>
                    <p className='cardDate'>{tarea.created_at}</p>
                    <div className='cardButtons'>
                        <button className='cardButton' onClick={() => openDialog(tarea.id)}>EDITAR</button>
                        <button className='cardButton' onClick={() => eliminarTarea(tarea.id)}>ELIMINAR</button>
                    </div>
                </div>
                ))}
            </div>
        </main>
    );
}

export default Tareas;