const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  evento: { type: String, required: true },
  endereco: { type: String, required: true },
  data: { type: String, required: false, default: '' },
  hora: { type: String, required: false, default: ''},
  criadoEm: { type: Date, default: Date.now },
  
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.buscaPorId = async function(id){
    if(typeof id !== 'string') return;
    const user = await ContatoModel.findById(id);
    return user;
}

Contato.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.valida = function() {
  //validação
  //O e-mail precisa ser válido
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.evento) this.errors.push('Evento é um campo obrigatório');
  if(!this.body.endereco && !this.body.email) {
    this.errors.push('Informe pelo menos um endereço do evento.');
  }
}

Contato.prototype.cleanUp = function(){
  for(const key in this.body){
    if(typeof this.body[key] !== 'string'){
      this.body[key] = '';
    }
  }

  this.body = {
    evento: this.body.evento,
    endereco: this.body.endereco,
    data: this.body.data,
    hora: this.body.hora,
  };
}

module.exports = Contato;
