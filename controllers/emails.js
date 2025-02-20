/*
exports.install = function() {
  ROUTE('POST /new-email', send_email);
}

async function send_email(){
  let self = this;
  let obj = {
    email: 'cesarotero316@aragon.unam.mx',
    subject: 'Revisión de Falla en el SIAE - Actualización de Calificaciones',
    route: 'mails/siae',
    from: CONF.mail_address_from
  };
  MAIL(obj.email, obj.subject, obj.route, obj, (err, res) => {
    if (err) console.error(err);
    self.success();
  }).from(obj.from)
}
*/

exports.install = function() {
  ROUTE('POST /new-email', send_email);
}

async function send_email() {
  let self = this;
  let email = self.body.email;

  console.log(` Recibido en el backend: ${email}`);

  if (!email || !email.includes('@')) {
      console.error(' ERROR: Email inválido recibido en send_email:', email);
      return self.throw400('El email no es válido');
  }

  let obj = {
      email: email,
      subject: 'Revisión de Falla en el SIAE - Actualización de Calificaciones',
      route: 'mails/siae',
      from: CONF.mail_address_from
  };

  console.log(`Enviando correo a: ${email}`);

  MAIL(obj.email, obj.subject, obj.route, obj, (err, res) => {
      if (err) {
          console.error(err);
          self.status = 500;
          self.json({ success: false, error: err.message });
      } else {
          console.log(`Guardando en la base de datos: ${email}`);
          NOSQL('emails').insert({ email: email, abierto: false, click: false, fecha: NOW });
          self.json({ success: true });
      }
  }).from(obj.from);
}



