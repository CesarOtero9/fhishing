exports.install = function() {
    ROUTE('GET /track-opened/{email}', track_opened);
    ROUTE('GET /track-click/{email}', track_click);
};

async function track_opened() {
    let self = this;
    let email = self.params.email || 'desconocido@example.com';

    console.log(`Se abrió el correo de: ${email}`);

    await NOSQL('emails').modify({ abierto: true }).where('email', email);


    self.response.setHeader('Content-Type', 'image/gif');
    self.response.end(Buffer.alloc(35));  
}

async function track_click() {
    let self = this;
    let email = self.params.email || 'desconocido@example.com';

    console.log(`✅ Se hizo click en el correo de: ${email}`);

    await NOSQL('emails').modify({ click: true }).where('email', email);

    self.view('index');
}

