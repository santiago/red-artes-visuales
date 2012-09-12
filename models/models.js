var env = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var url = 'red-artes-visuales';
url += env == 'development' ? '-dev' : '';
url += env == 'test' ? '-test' : '';
console.log("Connecting to DB at: " + url);
mongoose.connect('mongodb://173.230.141.159/'+url);

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var params = require('../params');

function getSiNo() {
}

function setSiNo(val) {
	console.log("setSino:"+val)
	if (val == 'Si') return true;
	if (val == 'No') return false;
	return null;
}

function getSiNo(val) {
	console.log("getSino:"+val);
	if (val === true) return 'Si';
	if (val === false) return 'No';
	return null;
}

var Equipamiento = new Schema({
    nombre          :  { type: String }
  , ubicacion       :  { type: String }
  , comuna          :  { type: String, enum: params.comunas  }
  , barrio          :  { type: String, enum: params.barrios }
  , contacto        :  { type: String }
  , email           :  { type: String }
  , telefono        :  { type: String }
  , experiencia     :  { type: Boolean, get: getSiNo, set: setSiNo }
  , otros_talleres  :  { type: Array }
  , tipo            :  { type: String, enum: params.tipos }
  , espacio         :  { type: Array }
  , locker          :  { type: Boolean, get: getSiNo, set: setSiNo }
  , banos           :  { type: Boolean, get: getSiNo, set: setSiNo }
  , e_equipos       :  { type: String }
  , horario         :  { type: String }
  , edades          :  { type: Array }
  , seguridad       :  { type: String, enum: ['Alta', 'Media', 'Baja'] }
  , fronteras       :  { type: Boolean, get: getSiNo, set: setSiNo }
  , zona            :  { type: String, enum: ['Urbana', 'Rural'] }
  , como_llegar     :  { type: String }
  , web             :  { type: String }
  , fb              :  { type: String }
  , twitter         :  { type: String }
  , blog            :  { type: String }
  , newsletter      :  { type: Boolean, get: getSiNo, set: setSiNo }
  , cartelera       :  { type: Boolean, get: getSiNo, set: setSiNo }
  , telefono_info   :  { type: Boolean, get: getSiNo, set: setSiNo }
  , perifonia       :  { type: Boolean, get: getSiNo, set: setSiNo }
  , boletin         :  { type: Boolean, get: getSiNo, set: setSiNo }
  , medios_comunit  :  { type: Boolean, get: getSiNo, set: setSiNo }
  , emailing        :  { type: Boolean, get: getSiNo, set: setSiNo }
  , observaciones   :  { type: String }
});
mongoose.model('Equipamiento', Equipamiento);

var Participante = new Schema({
    equipamiento_id :  { type: String, index: true }
  , fecha           :  { type: Date }
  , nombre          :  { type: String, default: 'Nombre' }
  , comuna          :  { type: String, enum: params.comunas }
  , barrio          :  { type: String, enum: params.barrios }
  , estrato         :  { type: String, enum: params.estratos }
  , contacto        :  { type: String}
  , fotos           :  { type: Array }
  , videos          :  { type: Array }
  , familiar        :  { type: String, enum: params.familiaridades }
  , vive_con_otro   :  { type: String }
  , poblacion       :  { type: String, enum: params.poblacional }
  , padres          :  { type: String, enum: params.padres }
  , observaciones   :  { type: String }
});
mongoose.model('Participante', Participante);  

var Taller = new Schema({
    nombre          :  { type: String }
  , descripcion     :  { type: String }
  , objetivos       :  { type: String }
  , metodologias    :  { type: Array }
  , habilidades     :  { type: Array }
});
mongoose.model('TallerBase', Taller);

var Sesion = new Schema({
    nombre          :  { type: String }
  , actividad_id    :  { type: String, index: true }
  , fecha           :  { type: Date }
  , creativo_cedula :  { type: String }
  , equipamiento_id    :  { type: String }
  , equipamiento_nombre  :  { type: String }
  , participantes   :  { type: Array }
  , resultados      :  { type: String }
  , autoeval_creativo: { type: String }
  , observ_externas :  { type: String }
  , fotos           :  { type: Array }
  , videos          :  { type: Array }
});
mongoose.model('Taller', Sesion);

var Usuario = new Schema({
    email           : { type: String },
    cedula          : { type: String },
    contrasena      : { type: String },
    rol             : { type: String, enum: params.roles }
});
mongoose.model('Usuario', Usuario); 

var Creativo = new Schema({
    nombre          : { type: String },
    cedula          : { type: String },
    email           : { type: String },
    telefono        : { type: String },
    direccion       : { type: String },
    titulo          : { type: String }
});
mongoose.model('Creativo', Creativo);  

var Evaluacion = new Schema({
    participante_id :  { type: String }
  , fecha           :  { type: Date }
  , taller_id       :  { type: String, index: true }
  , habilidades     :  { type: Array }
  , observaciones   :  { type: String }
  , sensibilidad    :  { type: String }
  , comunicacion    :  { type: String }
  , apreciacion     :  { type: String }
});
mongoose.model('Evaluacion', Evaluacion);  

module.exports= mongoose;
