var params = {
    edades: ['7-8', '9-10', '11-12', '13-14', '15-16'],

    habilidades: ['Reflexión', 'Creatividad', 'Capacidad de Escucha', 'Compromiso', 
		  'Pensamiento Crítico', 'Tolerancia', 'Honestidad', 'Participación', 
		  'Reconocer el Contexto Social', 'Reconocer el Contexto Familiar', 
		  'Reconocer el Contexto Geográfico', 'Respeto', 'Confianza', 
		  'Construcción Colectiva', 'Aceptación del Otro', 
		  'Capacidad de Expresión', 'Trabajo en Equipo'],

	comunas: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','50','60','70','80','90'],
    
    barriosComuna: [ 
        { 
            comuna: '1',
            barrios: [   
                'Santo Domingo Sabio Nº 1',
                'Santo Domingo Sabio Nº 2',
                'Popular, Granizal',
                'Moscú Nº 2',
                'Villa Guadalupe',
                'San Pablo',
                'Aldea Pablo VI',
                'La Esperanza Nº 2',
                'El Compromiso',
                'La Avanzada',
                'Carpinelo' 
            ].sort()
        },
        { 
            comuna: '2',
            barrios: [   
                'La Isla',
                'El Playón de Los Comuneros',
                'Pablo VI',
                'La Frontera',
                'La Francia',
                'Andalucía',
                'Villa del Socorro',
                'Villa Niza',
                'Moscú Nº 1',
                'Santa Cruz',
                'La Rosa' 
            ].sort()
        },
        {
            comuna: '3',
            barrios: [ 
                'La Salle',
                'Las Granjas',
                'Campo Valdes Nº 2',
                'Santa Inés',
                'El Raizal',
                'El Pomar',
                'Manrique',
                'Central Nº 2',
                'Manrique Oriental',
                'Versalles Nº 1',
                'Versalles Nº 2',
                'La Cruz, Oriente',
                'Maria Cano ? Carambolas',
                'San José La Cima Nº 1',
                'San José La Cima Nº 2' ].sort()
        },
        { 
            comuna: '4',
            barrios: [ 
                'Berlín',
                'San Isidro',
                'Palermo',
                'Bermejal - Los Álamos',
                'Moravia',
                'Sevilla',
                'San Pedro',
                'Manrique Central Nº 1',
                'Campo Valdes Nº 1',
                'Las Esmeraldas',
                'La Piñuela',
                'Aranjuez',
                'Brasilia',
                'Miranda' ].sort()
        },
        { 
            comuna: '5',
            barrios: [ 
                'Toscaza',
                'Las Brisas',
                'Florencia',
                'Tejelo',
                'Boyacá',
                'Héctor Abad Gómez',
                'Belalcazar',
                'Girardot',
                'Tricentenario',
                'Castilla',
                'Francisco Antonio Zea',
                'Alfonso López',
                'Caribe' 
            ].sort()
        },
        { 
            comuna: '6',
            barrios: [ 
                'Santander',
                'Doce de Octubre Nº 1',
                'Doce de Octubre Nº 2',
                'Pedregal',
                'La Esperanza',
                'San Martín de Porres',
                'Kennedy',
                'Picacho',
                'Picachito',
                'Mirador del Doce',
                'Progreso Nº 2',
                'El Triunfo' 
            ].sort()
        },
        { 
            comuna: '7',
            barrios: [ 
                'Cerro El Volador',
                'San Germán',
                'Barrio Facultad de Minas',
                'La Pilarica',
                'Bosques de San Pablo',
                'Altamira',
                'Córdoba',
                'López de Mesa',
                'El Diamante',
                'Aures Nº 1',
                'Aures Nº 2',
                'Bello Horizonte',
                'Villa Flora',
                'Palenque',
                'Robledo',
                'Cucaracho',
                'Fuente Clara',
                'Santa Margarita',
                'Olaya Herrera',
                'Pajarito',
                'Monteclaro',
                'Nueva Villa de La Iguaná' ].sort()
        },
        { 
            comuna: '8',
            barrios: [ 
                'Villa Hermosa',
                'La Mansión',
                'San Miguel',
                'La Ladera',
                'Batallón Girardot',
                'Llanaditas',
                'Los Mangos',
                'Enciso',
                'Sucre',
                'El Pinal',
                'Trece de Noviembre',
                'La Libertad',
                'Villa Tina',
                'San Antonio',
                'Las Estancias',
                'Villa Turbay',
                'La Sierra (Santa Lucía - Las Estancias)',
                'Villa Lilliam' 
            ].sort() 
        },
        { 
            comuna: '9',
            barrios:
            [ 
                'Juan Pablo II',
                'Barrios de Jesús',
                'Bomboná Nº 2',
                'Los Cerros El Vergel',
                'Alejandro Echevarria',
                'Barrio Caicedo',
                'Buenos Aires',
                'Miraflores',
                'Cataluña',
                'La Milagrosa',
                'Gerona',
                'El Salvador',
                'Loreto',
                'Asomadera Nº 1',
                'Asomadera Nº 2',
                'Asomadera Nº 3',
                'Ocho de Marzo' 
            ].sort() 
        },
        { 
            comuna: '10',
            barrios: [ 
                'Prado',
                'Jesús Nazareno',
                'El Chagualo',
                'Estación Villa',
                'San Benito',
                'Guayaquil',
                'Corazón de Jesús',
                'Calle Nueva',
                'Perpetuo Socorro',
                'Barrio Colón',
                'Las Palmas',
                'Bomboná Nº 1',
                'Boston',
                'Los Ángeles',
                'Villa Nueva',
                'La Candelaria',
                'San Diego' 
            ].sort() 
        },
        { 
            comuna: '11',
            barrios: [ 
                'Carlos E. Restrepo',
                'Suramericana',
                'Naranjal',
                'San Joaquín',
                'Los Conquistadores',
                'Bolivariana',
                'Laureles',
                'Las Acacias',
                'La Castellana',
                'Lorena',
                'El Velódromo',
                'Estadio',
                'Los Colores',
                'Cuarta Brigada',
                'Florida Nueva' 
            ].sort()
        },
        { 
            comuna: '12',
            barrios: [ 
                'Ferrini',
                'Calasanz',
                'Los Pinos',
                'La América',
                'La Floresta',
                'Santa Lucía',
                'El Danubio',
                'Campo Alegre',
                'Santa Mónica',
                'Barrio Cristóbal',
                'Simón Bolívar',
                'Santa Teresita',
                'Calasanz Parte Alta' 
            ].sort() 
        },
        { 
            comuna: '13',
            barrios: [ 
                'El Pesebre',
                'Blanquizal',
                'Santa Rosa de Lima',
                'Los Alcázares',
                'Metropolitano',
                'La Pradera',
                'Juan XIII - La Quiebra',
                'San Javier Nº 1',
                'San Javier Nº 2',
                'Veinte de Julio',
                'Belencito',
                'Betania',
                'El Corazón',
                'Las Independencias',
                'Nuevos Conquistadores',
                'El Salado',
                'Eduardo Santos',
                'Antonio Nariño',
                'El Socorro',
                'La Gabriela' 
            ].sort() 
        },
        { 
            comuna: '14',
            barrios: [ 
                'Barrio Colombia',
                'Simesa',
                'Villa Carlota',
                'Castropol',
                'Lalinde',
                'Las Lomas Nº 1',
                'Las Lomas Nº 2',
                'Altos del Poblado',
                'El Tesoro',
                'Los Naranjos',
                'Los Balsos Nº 1',
                'San Lucas',
                'El Diamante Nº 2',
                'El Castillo',
                'Los Balsos Nº 2',
                'Alejandría',
                'La Florida',
                'El Poblado',
                'Manila',
                'Astorga',
                'Patio Bonito',
                'La Aguacatala',
                'Santa Maria de Los Ángeles' 
            ].sort() 
        },
        { 
            comuna: '15',
            barrios: [ 
                'Tenche',
                'Trinidad',
                'Santa Fe',
                'Shellmar',
                'Parque Juan Pablo II',
                'Campo Amor',
                'Noel',
                'Cristo Rey',
                'Guayabal',
                'La Colina' 
            ].sort() 
        },
        { 
            comuna: '16',
            barrios: [ 
                'Fátima',
                'Rosales',
                'Belén',
                'Granada',
                'San Bernardo',
                'Las Playas',
                'Diego Echevarría',
                'La Mota',
                'La Hondonada',
                'El Rincón',
                'La Loma de Los Bernal',
                'La Gloria',
                'Altavista',
                'La Palma',
                'Los Alpes',
                'Las Violetas',
                'Las Mercedes',
                'Nueva Villa de Aburrá',
                'Miravalle',
                'El Nogal - Los Almendros',
                'Cerro Nutibara' 
            ].sort() 
        },
        { comuna: 'CORREGIMIENTOS',
            barrios: [ 
                'Palmitas',
                'San Cristóbal',
                'Altavista',
                'San Antonio de Prado',
                'Santa Elena' 
            ].sort() 
        }
    ],
    
    barrios: ['Santo Domingo', 'Granizal', 'Santa Cruz', 'Manrique Central', 'Moravia',
            'Palermo', 'Florencia', 'Pedregal', 'Luis López de Mesa', 'Aures', 'Villatina',
            'Las Estancias', 'La Milagrosa', 'Boston', 'Jesús Nazareno', 'Los colores',
            'La Floresta', 'San Javier', 'Belencito', 'El Salado Depósito', 'Los Alcázares',
            'Santa María de Los Angeles','Trinidad', 'San Bernardo', 'La Perla', 'Nuevo Amanecer',
            'Villa de Guadalupe', 'Vereda El Vergel', 'El Limonar', 'Robledo Pajarito', 'Vereda La Loma',
            'Sector el Parque', 'Ciudadela Nuevo Occidente', 'Vereda La Aldea', 'Santa Elena Parque Central',
            'Sector central'].sort(),

    // equipamientos: ["Casa Tres Patios", "EscuelaX", 'TallerZ','ImaginaLab'],

    estratos: ['0','1','2','3','4','5','6'],

    roles: ['creativo','administrador','participante','colaborador','visitante'],

    otros_talleres:  ['Pintura', 'Dibujo', 'Escultura', 'Fotografia', 
		      'Danza', 'Teatro', 'Música', 'Otros'],

    tipos: ['Escuela', 'Centro Comunitario', 'Público', 'Privado', 'Biblioteca', 
	    'Parque Biblioteca', 'Casa de la Cultura', 'Otro'],

    espacios:  ['Aulas de clase', 'Espacios Multi-propósitos', 'Otros'],

    familiaridades: ['Familia nuclear', 'Familia biparental', 'Familia monoparental', 
		     'Familia extensa', 'Familia reconstituida', 'Familia adoptiva'],

    poblacional: ['No aplica', 'En condición de calle', 'LGTBI', 'Indígena', 'Afro-colombiana', 
		  'Desplazada', 'Con discapacidad', 'ROM'],

    padres: ['Básica primaria', 'Básica secundaria', 'Estudios tecnicos', 'Estudios universitarios' ],

    metodologias: ['Sensibilización', 'Recorrido', 'Dinámica', 'Juego', 
		   'Técnicas Creativas', 'Presentación de Referentes', 
		   'Experimentación Materiales' , 'Visitas', 'Investigación', 
		   'Intercambios', 'Otro'],
    
    grados: [1,2,3,4,5,6,7,8,9,10,11],
    
    tipos_documento: ['TI', 'CC'],

    zonas: ['Urbana','Rural']
};

params.comunas = params.barriosComuna.map(function(c) { return c.comuna });

module.exports = params;
