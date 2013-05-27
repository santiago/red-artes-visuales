jQuery(document).ready(function($) {

    // Quick & dirty UI fixes
    $('#tab-general').hide();

    $('button').css({ cursor: 'pointer' });

    // What's this content
    var articulo = $('input[name=articulo]').val();

    
    // Media Gallery
    var MediaGallery = function() {
        var view = this;
    
        Galleria.loadTheme('/javascripts/thirdparty/galleria-classic-theme/galleria.classic.min.js');
        Galleria.ready(function() {
            console.log('ready')
            $('#galleria-wrapper').overlay({
                fixed: false,
                top: 32
            })
            $('#galleria-wrapper').overlay().onClose(function() {
                view.showing = false;
            });
            view.galleria = Galleria.get(0);
        });
        Galleria.run('#galleria', { dataSource: [{image:'/images/ajax-loader-big.gif'}] });
    };
    
    MediaGallery.prototype.load = function(data) {
        $('#galleria-wrapper').fadeIn(function() {
            this.galleria.load(data);
        }.bind(this))
    };
    
    MediaGallery.prototype.open = function() {
        var data = []
        
        $('ul.fotos li img').each(function() {
            var img = $(this).attr('src').split('150-')[1];
            data.push({
                thumb: 'https://s3.amazonaws.com/red-artes-visuales/150-'+img,
                image: 'https://s3.amazonaws.com/red-artes-visuales/'+img
            })
        });
            
        if (!this.showing) {
            this.showing = true;
            $('#galleria-wrapper').css({ 'z-index': 1 });
            this.load(data);
            if(!$('#galleria-wrapper').overlay().isOpened()) {
                $('#galleria-wrapper').overlay().load();
            }
        }
    };
    

	// Páginas
	var Paginas = {};

    Paginas.Equipamientos = function() {};

	Paginas.EquipamientoTalleres = function() {
		var $el = $('article#equipamiento');

		$('#fecha').datepicker();

		$el.find('.submit').click(function(e) {
			if ($('#fecha').hasClass('border_error')) {
				$('#fecha').removeClass('border_error');
			}
			e.preventDefault();
			$(this).blur();

			var equip = location.pathname.split('/')[2];
			var taller_id = $('select option:selected').val();
			var fecha_str = $('#fecha').val();
			if (fecha_str) {
				var fecha = fecha_str.split('/');
				if (fecha) {
					fecha = new Date(parseInt(fecha[2]), parseInt(fecha[0].replace(/^0/, '')) - 1, parseInt(fecha[1].replace(/^0/, '')))
					fecha = fecha.getTime();
				}
			}

			if (!equip) {
				$(this).parent().before("<p class='error'>* debe seleccionar un equipamiento</p>");
			}

			if (!fecha) {
				$(this).parent().before("<p class='error'>* debe seleccionar una fecha</p>");
				$('#fecha').addClass('border_error');
			}

			if (fecha && taller_id) {
				var equip_nombre = $('select option:selected').first().text();
				$.post('/talleres/' + taller_id, {
					equipamiento_id: equip,
					fecha: fecha,
					equipamiento_nombre: equip_nombre
				}, function(taller) {
					location.href = '/equipamientos/' + equip;
				});
			}
        });
	};

    Paginas.SeguimientoCreativo = function() {
		
	};

	Paginas.Taller = function() {
    	var $el = $("#taller");
        var taller_id = location.pathname.split('/').pop();
        
		// Tabs
		$el.find('.opciones li a').click(function(e) {
			e.preventDefault();
			$(this).blur();

			var opcion = $(this).attr('id');

			// Active Tab
			$el.find('.opciones li a').removeClass('activo');
			$(this).addClass('activo');

			// Show/Hide content
			$el.find('.tab_content').hide();
			$el.find('.tab_content#' + opcion).show();
		});
        
        $el.find('[type="radio"]').live('click', function(e) {
            var $radio = $(this);
            var asistencia = $(this).val();
            var participante_id = $(this).attr('name').split('_').pop();

            var data = {
                asistencia: asistencia
            };
            $.post('/taller/' + taller_id + '/participantes/' + participante_id, data, function(res) {
               $radio.closest('.participante_item')
                    .find('.indicador-asistencia span')
                    .removeClass('undefined Si si No no')
                    .addClass(asistencia);
            });
        });

        $('a.observaciones').click(function(e) {
            e.preventDefault();
            $(this).blur()
                
            var $participante = $(this).closest('.participante_item');
            var participante_id = $participante.attr('id');
            var $observaciones = $participante.find('.observaciones-item');
            
            if($participante.has('.observaciones-item:visible').length > 0) {
                $observaciones.slideUp('fast');
                return;
            }
            
            $observaciones.slideDown();
            $observaciones.find('button').one('click', function(e) {
                $(this).blur();
                var data = {
                    observaciones: $observaciones.find('textarea').val()
                };
                $.post('/taller/' + taller_id + '/participantes/' + participante_id, data, function(res) {
                    $observaciones.slideUp('fast');
                });
            });
            
        });
        
        // Consolidar asistencia
        $("button#consolidar").click(function(e) {
            if($('.undefined').length) {
                alert("Debe completar la asistencia para todos los participantes antes de consolidar");
                return;
            }
            if(confirm("Después de consolidar, la información no podrá ser modificada. ¿Desea continuar?")) {
                $.post("/taller/" + taller_id + "/consolida", function(data) {
                    location.reload()
                });
            }
            
        });

		$el.find('.submit').click(function(e) {
			e.preventDefault();
			$(this).blur();
			var taller_id = location.pathname.split('/').pop();
			location.href = '/taller/' + taller_id + '/participantes/new';
		});
	};
    
    Paginas.TallerBase = function() {
		$('.list_header a.activo').each(function() {
			$(this).closest('li').css({
				'float': 'left'
			});
			$(this).find('span.mask').css({
				width: $(this).closest('li').width() - 2
			})
		});
	};

	Paginas.Talleres = function() {
		var $el = $('article#talleres');

		$el.find('.ver-equipamientos').click(function(e) {
			e.preventDefault();
			$(this).blur();

			$(this).closest('.taller_item').find('.equipamientosTaller').first().slideDown('fast');

			$(this).hide();
			$(this).closest('.taller_item').find('.cerrar-equipamientos').show()

			var taller_base = $(this).closest('.taller_item').attr('id');
			$(this).closest('.taller_item').find('.equipamientosTaller').load('/talleres/' + taller_base + '/talleres');
		});

		$el.find('.cerrar-equipamientos').click(function(e) {
			e.preventDefault();
			$(this).blur();

			$(this).closest('.taller_item').find('.equipamientosTaller').first().slideUp('fast');

			$(this).hide();
			$(this).closest('.taller_item').find('.ver-equipamientos').show();
		});

		$("button.submit").live('click', function(e) {
			e.preventDefault();
			$(this).blur();
			var id = $(this).closest('.taller_item').attr('id');
			location.href = '/talleres/' + id + '/new';
		});
	};

	Paginas.Consultas = function() {
		var $el = $('article#consultas');
		var $mask = $el.find('.opciones .mask');
        
        // Activate current tab
        var $li = $el.find('.opciones li a.activo').closest('li');
        $li.prepend($mask.css({
    		width: $li.width()
		}));
        
        var $current_tab = $('.tab_content:visible');
        var current = $current_tab.attr('id');
        setCurrent()

		// Tabs
		$el.find('.opciones li a').click(function(e) {
			e.preventDefault();
			$(this).blur();

			var opcion = $(this).attr('id').split('-')[0];

			// Active Tab
			$el.find('.opciones li a').removeClass('activo');
			$(this).addClass('activo');

            $current_tab = $el.find('.tab_content#' + opcion);
            
            // Show/Hide content
			$el.find('.tab_content').hide();
			$current_tab.show();
            setCurrent();

            if(current == opcion) {
                $('.resultado_area.'+current).show();
            } else {
                $('.resultado_area').hide();
            }

			$(this).closest('li').prepend($mask);
			$mask.css({
				width: $(this).closest('li').width()
			});
		});
        
        $("button#buscar").click(function() {
            var $tab = $(".tab_content:visible");
            var resource = $tab.attr('id');
            
            if(resource == 'talleres') q = "Taller";
            if(resource == 'equipamientos') q = "Equipamiento";
            if(resource == 'participantes') q = "Participante";
            
            var query = '/consultas?q='+q;
            
            $tab.find('select :selected')
            
            $tab.find('select :selected').each(function() {
                var $select = $(this).closest('select');
                var value = $select.val();
                var field = $select.attr('name');
                console.log([field, value])
                if($.trim(value)) {
                    query += "&"+field+"="+value;
                }
            })
            
            location.href = query;
        });
        
        function setCurrent() {
            $current_tab.find('select[name=comuna]').off('change')
            $current_tab.find('select[name=barrio]').off('change')
            
            $current_tab.find('select[name=comuna]').change(function() {
                if($(this).val())
                    $current_tab.find('select[name=barrio]').attr('disabled', 'disabled')
                else
                    $current_tab.find('select[name=barrio]').removeAttr('disabled')
            });
            
            $current_tab.find('select[name=barrio]').change(function() {
                if($(this).val())
                    $current_tab.find('select[name=comuna]').attr('disabled', 'disabled')
                else
                    $current_tab.find('select[name=comuna]').removeAttr('disabled')

            });
	    }
        
        // If it's a query, show selected options
        var query = decodeURI(location.search).replace(/\?/, '').split('&');
        console.log(query)
        for(var field in query) {
            var data = query[field].split('=');
            console.log('select[name='+data[0]+'] option[value="'+data[1]+'"]')
            $current_tab
                .find('select[name='+data[0]+'] option[value="'+data[1]+'"]')
                .attr('selected', 'selected');
        }
        
	};

	Paginas.FormEquipamiento = function() {
        function res(data) {
			// console.log(data);
			location.href = '/equipamientos';
		}

		// Collect and Validate data
		var $el = $("#equipamiento form");
		$el.find('button').click(function(e) {
			e.preventDefault();

			var data = EquipamientoForm.getValidData();
			if (data) {
				$.post('/equipamientos', data, res);
			}
		});
        
        // Select for barrios according to comuna
        $('select[name=comuna]').change(function() {
            var comuna = $(this).val();
            var $options = $('select[comuna='+comuna+'] option');
            $('select[name=barrio]').empty().append($options);
        });
	};

	Paginas.FormTaller = function() {};

	Paginas.FormTallerBase = function() {
		// Callback par atender el response

		function res(data) {
			// console.log(data);
			location.href = "/talleres";
		}

		var $el = $("#taller form");
		$el.find('button').click(function(e) {
			e.preventDefault();
			var data = TallerBaseForm.getValidData();
			if (data) {
				$.post('/talleres', data, res);
			}
		});
	};

    Paginas.EditarTallerBase = function() {
        var taller_id = $('#tallerbase_id').val();
        var $el = $("#taller form");
    	
        $el.find('button#save').click(function(e) {
            e.preventDefault();
            $(this).blur();
            
            var data = TallerBaseForm.getValidData();

		    if (data) {
			    $.ajax({
				    url: "/talleres/" + taller_id,
				    type: "PUT",
				    data: data,
				    success: function(data, textStatus, XMLHttpRequest) {
					    location.href = "/talleres/" + taller_id;
				    }
			    });
		    }        
    	});
    };

	Paginas.EditarEquipamiento = function() {
		var equipamiento_id = $('#equipamiento_id').val();
        
        $('input[type="radio"]').removeAttr('disabled');
		
		$('.submit').click(function(e) {
			e.preventDefault();
			var data = EquipamientoForm.getValidData();
			
			// Fix styles for error message in radio buttons
			var hasRadioError = $('p.error').closest('li').find('input[type="radio"]').length;
			if (hasRadioError) $('p.error').css({ bottom: -13 });

			if (data) {
				$.ajax({
					url: "/equipamientos/" + equipamiento_id,
					type: "PUT",
					data: data,
					success: function(data, textStatus, XMLHttpRequest) {
						location.href = "/equipamientos/" + equipamiento_id;
					}
				});
			}
		});
        
        // Select for barrios according to comuna
        $('select[name=comuna]').change(function() {
            var comuna = $(this).val();
            var $options = $('select[comuna='+comuna+'] option');
            $('select[name=barrio]').empty().append($options);
        });
        $('select[name=comuna]').change();
        
        // Delete equipamiento
        $('#delete').click(function(e) {
            e.preventDefault();
            $(this).blur();

            var eliminar = confirm('Está seguro que desea eliminar este equipamiento? Esta operación no puede deshacerse.');
            if(eliminar) {
                $.ajax({
                    url: '/equipamientos/'+equipamiento_id,
                    type: 'delete',
                    success: function() {
                        location.href = '/equipamientos'
                    }
                });
            } else {
            }
        });        
	};

	Paginas.EditarCreativo = function() {
		fixMask();

		function res(data) {
			location.href = location.pathname;
		}
        
        var creativo_id = location.href.split('/').pop();
        
        $('.perfil input[type=radio]').click(function() {
            $.post('/creativo/'+creativo_id+'/perfil', { perfil: $(this).val() }, function() {
                alert('Se actualizó el perfil de este usuario!')
            });
        });

		var $el = $('#creativo form');
		$el.find('button#save').click(function(e) {
			e.preventDefault();
			var data = AdminCreativoForm.getValidData();
			if (data) {
				$.ajax({
					url: location.pathname,
					type: 'PUT',
					data: data,
					success: res
				});
			}
		});
        
        // Delete creativo
        $('#delete').click(function(e) {
            e.preventDefault();
            $(this).blur();

            var eliminar = confirm('Está seguro que desea eliminar este creativo? Esta operación no puede deshacerse.');
            if(eliminar) {
                $.ajax({
                    url: '/admin/creativos/'+creativo_id,
                    type: 'delete',
                    success: function() {
                        location.href = '/admin/creativos'
                    }
                });
            } else {
            }
        });
	};

	Paginas.FormCreativo = function() {
		fixMask();

		function res(data) {
			// console.log(data);
			location.href = "/admin/creativos";
		}
		var $el = $('#creativo form');
		$el.find('button').click(function(e) {
			e.preventDefault();
			var data = AdminCreativoForm.getValidData();
			if (data) {
				$.post('/admin/creativos', data, res);
			}
		});
	};

	Paginas.EditarParticipante = function() {
		var $el = $('#edit_participante');
		var participante_id = $('#participante_id').val();
        var equipamiento_id = $('#equip_id').val();
        
        setupUpload.call(this, '/participantes/'+participante_id+'/foto');
        
        $("#upload-btn").click(function(e) {
            e.preventDefault();
            $('#upload').click();
        })
        
        // Hide file input
        var wrapper = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
        var fileInput = $(':file').wrap(wrapper);
        fileInput.change(function(){
            var $this = $(this);
            $('#file').text($this.val());
        });
        
        // Click to Save
		$el.find('button#save').click(function(e) {
			e.preventDefault();
			var data = EditarParticipanteForm.getValidData();
			if (data) {
				$.ajax({
					url: '/participantes/' + participante_id,
					type: 'PUT',
					data: data,
					success: function(data) {
						location.href = "/participantes/" + participante_id;
					}
				});
			}
		});
        
        // Select for barrios according to comuna
        $('select[name=comuna]').change(function() {
            var comuna = $(this).val();
            var $options = $('select[comuna='+comuna+'] option');
            $('select[name=barrio]').empty().append($options);
        });
        $('select[name=comuna]').change();

        
        // Delete participante
        $('#delete').click(function(e) {
            e.preventDefault();
            $(this).blur();

            var eliminar = confirm('Está seguro que desea eliminar este participante? Esta operación no puede deshacerse.');
            if(eliminar) {
                $.ajax({
                    url: '/participantes/'+participante_id,
                    type: 'delete',
                    success: function() {
                        location.href = '/equipamientos/'+equipamiento_id+'/participantes'
                    }
                });
            } else {
            }
        });

	};

	Paginas.FormEvalTaller = function() {
		var $el = $('#taller form');
		$el.find('button.submit').click(function(e) {
			var taller_id = $('#taller_id').val();
			e.preventDefault();
			var data = EvalTallerForm.getValidData();
			if (data) {
				$.ajax({
					url: '/taller/' + taller_id,
					type: 'PUT',
					data: data,
					success: function(data) {
						location.href = "/taller/" + taller_id;
					}
				});
			}
		});
	};

	Paginas.FormParticipante = function() {
		var $el = $('#participante form');
		var equip_id = $('#equipamiento_id').val();

		$el.find('button.submit').click(function(e) {
			e.preventDefault();
			var parti = ParticipanteForm.getValidData();
			if (parti) {
				$.post('/participantes', parti, function(data) {
					location.href = '/equipamientos/' + equip_id + "/participantes";
				});
			}
		});
	};

	Paginas.FormEvaluacion = function() {
		var $el = $('#evaluacion');
		var taller_id = $('#taller_id').val();

		$el.find('.list_header a.activo').each(function() {
			$(this).find('span.mask').css({
				width: $(this).parent().width() - 2
			})
		});

		$el.find('button.submit').click(function(e) {
			e.preventDefault();
			var evaluacion = EvaluacionForm.getValidData();
			if (evaluacion) {
				evaluacion.taller_id = taller_id;
				evaluacion.creativo_id = $('#creativo_id').val();
				evaluacion.p_id = $('#p_id').val();
				$.post('/evaluaciones', evaluacion, function(data) {
					location.href = "/taller/" + taller_id;
				});
			}
		});
	};
    
    Paginas.TallerMedia = function() {
        this.taller_id = location.pathname.split('/')[2]
        setupUpload.call(this, '/taller/'+this.taller_id+'/media')
        
        var gallery = new MediaGallery()
        
        $("#upload-btn").click(function() {
            $('#upload').click();
        })
        
        // Hide file input
        var wrapper = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
        var fileInput = $(':file').wrap(wrapper);
        fileInput.change(function(){
            var $this = $(this);
            $('#file').text($this.val());
        });
        
        $("ul.fotos li")
            .hover(function() { $(this).css({ cursor: 'pointer'}) })
            .click(function(e) {
                gallery.open()
            })
    };

    Paginas.Control = function() {
        $('#fecha').datepicker();
        $('#fecha').on('change', function() {
            if (!$(this).val()) return
            var fecha = $(this).val().split('/');
            var date = new Date(fecha[2], fecha[0]-1, fecha[1])
            location.href= '/admin/control?f='+date.getTime();
        });
    };

	function startProgressBar() {
        $('.meter > span').width(0);
        $('.meter > span').removeClass('stop')

        var view = this;
        function go() {
            var w = view.__progress + '%';
            if (/*view.__progress == 100 || */!view.__uploading) { return }
            $(".meter > span").animate({
                width: w
            }, 100, go);
        }
        go()
    }
    
    function setupUpload(url) {
        var view = this;
            
        $('.image-upload .control a').click(function(e) {
            e.preventDefault();
            $(this).blur();
                
            if ($(this).hasClass('cancel')) {
                // view.cancelUpload();
            }
            if ($(this).hasClass('skip')) {
                // view.skipCurrentUpload();
            }
        });

        $("#upload").html5_upload({
            url: url,
            sendBoundary: window.FormData || $.browser.mozilla,
            onStart: function(event, total) {
                // view.__progress = 0;
                //$('.meter > span').width(0);
                //$('.meter > span').removeClass('stop')
                    
                var check = confirm("Está subiendo un total de " + total + " imágenes. ¿Desea continuar?");
                if (check) {
                    $('.image-upload').find('.control p span.index').text(' 1');
                    $('.image-upload').find('.control p span.total').text(total);
                    $('button#upload-btn').fadeOut(function() {
                       $('.image-upload').fadeIn();
                    });
                }
                return check;
            },
            onStartOne: function(event, name, number, total) {
                view.__progress = 0;
                view.__uploading = true;

                var ext = name.split('.').pop().toLowerCase();
                var regex = /jpg|jpeg|gif|png/;
                if(!ext.match(regex)) {
                    return false
                }
                
                $('.meter > span').removeClass('stop');
                $('.image-upload').find('.control p span.index').text(' ' + (number + 1));
                startProgressBar.call(view);
                return true;
            },
            onProgress: function(event, progress, name, number, total) {                
                view.__progress = parseFloat((progress*100).toString().slice(0,5));
                // console.log(view.__progress)
            },
            onFinish: function(event, response, name, number, total) {
                view.__uploading = false;
                setTimeout(function() {
                    location.reload()
                }, 100);
            },
            onError: function(event, name, error) {
                alert('error while uploading file ' + name);
            }
        })
    };
    
    
    // Util functions
	var fixMask = function() {
			$('.list_header a.activo').each(function() {
				$(this).find('span.mask').css({
					width: $(this).closest('a').width()+20
				})
			});
		}

    
    // Start App
	try {
		Paginas[articulo]();
	}
	catch (err) {}

    
    // Select Periodo
    $('#periodo select').on('change', function() {
        var periodo = $(this).val()
        $.post('/admin/periodo', { periodo: periodo }, function() {
             alert("Se ha cambiado el Periodo a "+periodo);
             location.href = location.pathname;
        })
    })    
    
}) // endonready