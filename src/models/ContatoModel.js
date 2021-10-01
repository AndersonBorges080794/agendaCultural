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

Contato.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.valida = function() {
  //validação
  //O e-mail precisa ser válido
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.evento) this.errors.push('Evento é um campo obrigatório.');
  if(!this.body.endereco && !this.body.email) {
    this.errors.push('Endereço é um campo obrigatório.');
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

Contato.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};


//Métodos estáticos
Contato.buscaPorId = async function(id){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
}

Contato.buscaContatos = async function() {
  const contatos = await ContatoModel.find()
    .sort({ criadoEm: -1 });
  return contatos;
};

Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({_id: id});
  return contato;
};

module.exports = Contato;
