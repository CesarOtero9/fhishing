exports.install = function() {
    // Ruta para servir el Dashboard
    ROUTE('/dashboard', function() {
        this.layout('');
        this.view('dashboard');
    });

    // Servir archivos estáticos desde /public/
    ROUTE('/public/*', 'public');

    // Ruta para obtener los datos y mostrarlos en el dashboard
    ROUTE('GET /api/datos', obtener_datos);

    ROUTE('DELETE /api/clear-emails', clear_emails);
};

// Obtener los datos para mostrarlos en el dashboard
async function obtener_datos() {
    let self = this;

    try {
        let datos = await NOSQL('emails').find().promise();
        
        if (!Array.isArray(datos)) {
            datos = [];
        }

        // 🔹 Asegurarnos de que cada objeto tiene `email`, `abierto` y `click`
        datos = datos.map(item => ({
            email: item.email || 'desconocido@example.com',
            abierto: item.abierto || false,
            click: item.click || false
        }));

        self.json(datos);
    } catch (error) {
        self.status = 500;
        self.json({ error: 'Error al obtener los datos' });
    }
}

// Función para eliminar todos los registros de emails
async function clear_emails() {
    let self = this;
    try {
        await NOSQL('emails').remove();
        self.json({ success: true, message: 'Todos los emails fueron eliminados' });
    } catch (error) {
        self.status = 500;
        self.json({ success: false, error: 'Error al eliminar los emails' });
    }
}