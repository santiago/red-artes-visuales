var TallerBase = require('./models/models').model('TallerBase');

TallerBase.find(function(err, data) {
	data.forEach(function(taller) {
		taller.set('periodo', '2012')
		taller.save()
	})
})

