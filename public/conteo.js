document.addEventListener("DOMContentLoaded", async function () {
    await actualizarDashboard();
    setInterval(actualizarDashboard, 5000);s
});


async function sendEmail() {
    let emailInput = document.getElementById('email-input').value.trim(); 

    // Validación estricta del email con regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput)) {
        alert("Por favor ingresa un correo válido.");
        return;
    }

    try {
        let response = await fetch('/new-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput })
        });

        let result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (result.success) {
            alert('Correo enviado exitosamente.');
            actualizarDashboard();
        } else {
            alert('Error al enviar el correo.');
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        alert('No se pudo conectar con el servidor.');
    }
}


document.getElementById("send-email-btn").addEventListener("click", sendEmail);


async function actualizarDashboard() {
    try {
        let respuesta = await fetch('http://localhost:4444/api/datos'); 
        let datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            console.error("Los datos recibidos no son un array:", datos);
            return;
        }

        let tabla = document.getElementById("emails-list");
        let totalEmails = document.getElementById("total-emails");
        tabla.innerHTML = ""; 

        datos.forEach(email => {
            let fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${email.email}</td>
                <td>${email.abierto ? 'Sí' : 'No'}</td>
                <td>${email.click ? 'Sí' : 'No'}</td>
            `;

            tabla.appendChild(fila);
        });

        totalEmails.textContent = datos.length;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}


document.addEventListener("DOMContentLoaded", actualizarDashboard);



document.getElementById("clear-emails").addEventListener("click", async function() {
    if (!confirm("¿Estás seguro de que quieres eliminar todos los correos?")) return;

    try {
        let response = await fetch("/api/clear-emails", { method: "DELETE" });
        let result = await response.json();

        if (result.success) {
            alert("Todos los correos han sido eliminados.");
            actualizarDashboard();  
        } else {
            alert("Hubo un error al limpiar los correos.");
        }
    } catch (error) {
        console.error("Error al limpiar correos:", error);
        alert("No se pudo conectar con el servidor.");
    }
});
