var env = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var url = 'red-artes-visuales';
url += env == 'development' ? '-dev' : '';
url += env == 'test' ? '-test' : '';
mongoose.connect('mongodb://173.230.141.159/'+url);

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var edades = ['7-8', '9-10', '11-12', '13-14', '15-16'];
var habilidades = ['Reflexión', 'Creatividad', 'Capacidad de escucha', 'Compromiso', 'Pensamiento critico', 'Tolerancia', 'Honestidad', 'Participación', 'Reconocer el contexto social', 'Reconocer el contexto familiar', 'Reconocer el context geográfico', 'Respeto', 'Confianza', 'Construcción colectiva', 'Aceptación del otro', 'Capacidad de expresión', 'Trabajo en equipo'];
var comunas = ['Aranjuez','Belén','Buenos Aires','Castilla','Doce de Octubre','El Poblado','Guayabal','La América','La Candelaria','Laureles','Manrique','Popular','Robledo','San Javier','Santa Cruz', 'Villa Hermosa'];
var barrios = ['Conquistadores','Colores','Laureles','Robledo'];
var equipamientos = ["Casa Tres Patios", "EscuelaX", 'TallerZ','ImaginaLab'];
var estratos = ['1','2','3','4','5','6'];
var roles = ['creativo','administrador','participante','colaborador','visitante'];

var otros_talleres =  ['Pintura', 'Dibujo', 'Escultura', 'Fotografia', 'Danza', 'Teatro', 'Música', 'Otros'];
var tipos = ['Escuela', 'Centro Comunitario', 'Público', 'Privado', 'Biblioteca', 'Parque Biblioteca', 'Casa de la Cultura', 'Otro'];
var espacios =  ['Aulas de clase', 'Espacios Multi-propósitos', 'Otros'];
var familiaridades = ['Padres casados', 'Padres separados', 'Monoparental', 'Huérfano', 'Vive con otro familiar'];
var poblacional = ['En condición de calle', 'LGTBI', 'Indígena', 'Afro-colombiana', 'Desplazada', 'Con discapacidad', 'ROM'];
var padres = ['Alfabetizados', 'Empleados', 'Ama de casa'];
var metodologias = ['Sensibilización', 'Recorrido', 'Dinámica', 'Juego', 'Técnicas creativas', 'Presentación de referentes', 'Experimentación materiales' , 'Visitas', 'Investigación', 'Intercambios', 'Otro'];

var Equipamiento = new Schema({
    nombre          :  { type: String, enum: equipamientos }
  , ubicacion       :  { type: String, default: 'Ubicación' }
  , comuna          :  { type: String, enum: comunas  }
  , barrio          :  { type: String, enum: barrios }
  , contacto        :  { type: String }
  , email           :  { type: String }
  , telefono        :  { type: String }
  , experiencia     :  { type: Boolean }
  , otros_talleres  :  { type: Array }
  , tipo            :  { type: String, enum: tipos }
  , espacio         :  { type: Array }
  , locker          :  { type: Boolean }
  , banos           :  { type: Boolean }
  , e_equipos       :  { type: String }
  , horario         :  { type: String }
  , edades          :  { type: String, enum: edades }
  , seguridad       :  { type: String, enum: ['Alta', 'Media', 'Baja'] }
  , fronteras       :  { type: Boolean }
  , zona            :  { type: String, enum: ['Urbana', 'Rural'] }
  , como_llegar     :  { type: String }
  , web             :  { type: String }
  , fb              :  { type: String }
  , twitter         :  { type: String }
  , blog            :  { type: String }
  , newsletter      :  { type: Boolean }
  , cartelera       :  { type: Boolean }
  , telefono_info   :  { type: Boolean }
  , perifonia       :  { type: Boolean }
  , boletin         :  { type: Boolean }
  , medios_comunit  :  { type: Boolean }
  , emailing        :  { type: Boolean }
});
mongoose.model('Equipamiento', Equipamiento);

var Participante = new Schema({
    nombre          :  { type: String, default: 'Nombre' }
  , edad            :  { type: String, enum: edades }
  , comuna          :  { type: String, enum: comunas }
  , barrio          :  { type: String, enum: barrios }
  , estrato         :  { type: String, enum: estratos }
  , fotos           :  { type: Array }
  , videos          :  { type: Array }
  , familiar        :  { type: String, enum: familiaridades }
  , vive_con_otro   :  { type: String }
  , poblacion       :  { type: String, enum: poblacional }
  , padres          :  { type: String, enum: padres }
  , observaciones   :  { type: String }
});
mongoose.model('Participante', Participante);  

var TallerBase = new Schema({
    nombre          :  { type: String, default: 'Nombre' }
  , descripcion     :  { type: String }
  , objetivos       :  { type: String }
  , metodologia     :  { type: String, enum: metodologias }
  , habilidades     :  { type: String, enum: habilidades }
});
mongoose.model('TallerBase', TallerBase);

var Taller = new Schema({
  , creativos       :  { type: Array }
  , equipamiento    :  { type: String }
  , participantes   :  { type: Array }
  , resultados      :  { type: String }
  , autoeval_creativo : { type: String }
  , observ_externas : { type: String }
  , fotos           :  { type: Array}
  , videos          : { type: Array }
});
mongoose.model('Taller', Taller);  

var Usuario = new Schema({
    email           : { type: String },
    contrasena      : { type: String },
    rol             : { type: String, enum: roles }
});
mongoose.model('Usuario', Usuario); 

var Creativo = new Schema({
    nombre          : { type: String },
    email           : { type: String },
    direccion       : { type: String },
    titulo          : { type: String },
    ids_talleres    : { type: Array },
});
mongoose.model('Creativo', Creativo);  

var Evaluacion = new Schema({
    participante    :  { type: String }
  , creativo        :  { type: String }
  , fecha           :  { type: Date }
  , taller          :  { type: String }
  , habilidades     :  { type: String, enum : habilidades }
  , valor           :  { type: String }
});
mongoose.model('Evaluacion', Evaluacion);  

module.exports= mongoose;
