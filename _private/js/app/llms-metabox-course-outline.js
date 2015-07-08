/* global LLMS, $ */
/* jshint strict: false */

/**
 * Front End Quiz Class
 * Applies only to post type quiz
 * @type {Object}
 */
LLMS.MB_Course_Outline = {

	/**
	 * init
	 * loads class methods
	 */
	init: function() {

		if ($('#llms_post_edit_type').length ) {
			if ($('#llms_post_edit_type').val() === 'course') {
				this.bind();
			}
		}

	},

	/**
	 * Bind Method
	 * Handles dom binding on load
	 */
	bind: function() {
		var _this = this;

		$( '.llms-modal-cancel' ).click(function(e) {
			e.preventDefault();
			$(window).trigger('build');
		});

		$(document).ready(function() {
			$('.llms-chosen-select').chosen({width: '100%'});

			//$('#llms-section-select').chosen({width: '100%'});
		});

		//hack to resize excerpt and content editor size.
		//There is a WP but where passing the css_options to wp_editor
		//does not work.
		$('.tab-link').on('click', function() {
			$( '#content_ifr' ).css('height', '300px');
			$( '#excerpt_ifr' ).css('height', '300px');
		});

		//show / hide prereq lesson select based on setting
		if ( $('#_has_prerequisite').attr('checked') ) {
			$('.llms-prereq-top').addClass('top');
			$('.llms-prereq-bottom').show();

		} else {
			$('.llms-prereq-bottom').hide();
		}
		$('#_has_prerequisite').change(function() {
			if ( $('#_has_prerequisite').attr('checked') ) {
				$('.llms-prereq-top').addClass('top');
				$('.llms-prereq-bottom').show();

			} else {
				$('.llms-prereq-top').removeClass('top');
				$('.llms-prereq-bottom').hide();
			}
		});

		//generic modal call
		$('a.llms-modal').click(function() {
			$('#' + $(this).attr('data-modal_id') ).topModal( {
	        	title: $(this).attr('data-modal_title')
	        });
		});

		//test: DEPRECIATED
		// $('a.show1').click(function(){
	 //        $('#pop1').topModal( {
	 //        	title: 'Create a Course'
	 //        });
	 //    });

		//add new lesson modal
	    $('a.llms-modal-new-lesson-link').click(function(){
	        $('#' + $(this).attr('data-modal_id') ).topModal( {
	        	title: $(this).attr('data-modal_title'),
	        	open: function() {
	        		_this.getSections();
	        	}

	        });
	    });

	    //add existing lesson modal
	    $('a.llms-modal-existing-lesson-link').click(function(){
	        $('#' + $(this).attr('data-modal_id') ).topModal( {
	        	title: $(this).attr('data-modal_title'),
	        	open: function() {
	        		_this.getSections();
	        		_this.getLessons();
	        	}

	        });
	    });

		this.setup_course();

		$(window).click(function(e) {
			if (e.target.id !== 'llms-outline-add' && $('#llms-outline-add').hasClass('clicked') ) {
				$('#llms-outline-add').removeClass('clicked');
	            $('#llms-outline-add').addClass('bt');
	            $('#llms-outline-menu').removeClass('fade-in');
	            $('#llms-outline-menu').css('visibility', 'hidden');
			}
		});

		console.log('wow it did work!!!');
	    $('#llms-outline-add').click(function(e) {
	    	e.preventDefault();
	    	console.log('button clicked');
	        if ($('#llms-outline-add').hasClass('bt')) {
	            $('#llms-outline-add').removeClass('bt');
	            $('#llms-outline-add').addClass('clicked');
				$('#llms-outline-menu').addClass('fade-in');
	           $('#llms-outline-menu').css('visibility', 'visible');
	        } else {
	            $('#llms-outline-add').removeClass('clicked');
	            $('#llms-outline-add').addClass('bt');
	            $('#llms-outline-menu').removeClass('fade-in');
	            $('#llms-outline-menu').css('visibility', 'hidden');
	        }
	    });

	    $('#tooltip_menu a').click(function(e) {
	    	$('#llms-outline-menu').removeClass('fade-in');
	        $('#llms-outline-menu').css('visibility', 'hidden');
	        e.preventDefault();
	    });

	    $('a.tooltip').click(function(e) {
	        e.preventDefault();
	    });

		//sortable
		$( '.llms-lesson-tree' ).sortable({
			connectWith: '.llms-lesson-tree',
			axis 		: 'y',
	    	placeholder : 'placeholder',
	    	cursor		: 'move',
	    	forcePlaceholderSize:true,
	    	stop: function() {

	    		_this.resortLessons();
	    	}

		}).disableSelection();

		//add section row js functionality
		_this.addSectionRowFunctionality();

		//add lesson row js functionality
		_this.addLessonRowFunctionality();

		//section form submit
		$( '#llms_create_section' ).on( 'submit', function(e) {
			e.preventDefault();

			var values = {};
			$.each($(this).serializeArray(), function (i, field) {
			    values[field.name] = field.value;
			});

			_this.createSection( values );

		});

		//new lesson form submit
		$( '#llms_create_lesson' ).on( 'submit', function(e) {
			console.log('form submitted');
			e.preventDefault();

			var values = {};
			$.each($(this).serializeArray(), function (i, field) {
			    values[field.name] = field.value;
			});

			_this.createLesson( values );

		});

		//add existing lesson form submit
		$( '#llms_add_existing_lesson' ).on( 'submit', function(e) {
			console.log('form submitted');
			e.preventDefault();

			var values = {};
			$.each($(this).serializeArray(), function (i, field) {
			    values[field.name] = field.value;
			});

			_this.addExistingLesson( values );

		});

		//update lesson title
		$( '#llms_edit_lesson' ).on( 'submit', function(e) {
			console.log('form submitted');
			e.preventDefault();

			var values = {};
			$.each($(this).serializeArray(), function (i, field) {
			    values[field.name] = field.value;
			});

			_this.updateLesson( values );

		});

		//update section title
		$( '#llms_edit_section' ).on( 'submit', function(e) {
			console.log('form submitted');
			e.preventDefault();

			var values = {};
			$.each($(this).serializeArray(), function (i, field) {
			    values[field.name] = field.value;
			});

			_this.updateSection( values );

		});

		//update lesson title
		$( '#llms_delete_section' ).on( 'submit', function(e) {
			console.log('form submitted');
			e.preventDefault();

			var values = {};
			$.each($(this).serializeArray(), function (i, field) {
			    values[field.name] = field.value;
			});

			_this.deleteSection( values );

		});

	},

	// sortable: function() {

	// 	//sortable
	// 	$( '#sortable1, #sortable2' ).sortable({
	// 		connectWith: '.llms-lesson-tree',
	// 		axis 		: 'y',
	//     	placeholder : 'placeholder',
	//     	cursor		: 'move',
	//     	forcePlaceholderSize:true,
	//     	stop: function() {

	//     		$( '.llms-lesson-tree' ).each( function() {

	//     			//loop through all lessons and set order
	//     			$(this).find( '.llms-lesson').each( function(i) {
	// 	    			i++;

	// 	    			//set parent section
	// 	    			var parentSection = $(this).parent().parent().find('[name="llms_section_id[]"]').val();
	// 	    			// alert(parentSection);
	// 	    			$(this).find('[name="llms_lesson_parent_section[]"]').val(parentSection);

	// 	    			//set the new order
	// 	    			$(this).find('[name="llms_lesson_order[]"]').val(i);
	// 	    			$(this).find('.llms-lesson-order').html(i);
	// 	    			console.log(parentSection);
	// 	    		});
	//     		});
	//     	}

	// 	}).disableSelection();

	// 	//sortable
	// 	$( '#llms_course_outline_sort' ).sortable({
	// 		connectWith: '.sortablewrapper',
	// 		axis 		: 'y',
	//     	placeholder : 'placeholder',
	//     	cursor		: 'move',
	//     	forcePlaceholderSize:true,
	//     	stop: function() {
	//     		LLMS.MB_Course_Outline.resortSections();
	//     	}
	// 	}).disableSelection();

	// },

	resortSections: function() {

		var section_tree = {};

		$( '.llms-section' ).each( function(i) {
			i++;

			//update the sections to display the new order
			$(this).find('[name="llms_section_order[]"]').val(i);
			$(this).find('.llms-section-order').html(i);

			var id = $(this).find('[name="llms_section_id[]"]').val();

			//add section id and order to section tree object
			section_tree[id] = i;
			//update the new order in the database

		});

		LLMS.MB_Course_Outline.updateSectionOrder( section_tree );

	},

	updateSectionOrder: function( section_tree ) {
		console.log(section_tree);
		LLMS.Ajax.call({
	    	data: {
	    		action: 'update_section_order',
				sections: section_tree
	    	},
	    	beforeSend: function() {
	    		console.log('hell ya! i just did a before send');
	    	},
	    	success: function(r) {
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO total success!!!!!');

	    			// $('#llms_course_outline_sort').append(r.data);
	    			// $(window).trigger('build');
	    			//close metabox
	    			// $('#TB_window').fadeOut();
	    			// self.parent.tb_remove();

	    		}
	    	}

	    });

	},

	updateLessonOrder: function( lesson_tree ) {
		console.log(lesson_tree);
		LLMS.Ajax.call({
	    	data: {
	    		action: 'update_lesson_order',
				lessons: lesson_tree
	    	},
	    	beforeSend: function() {
	    		console.log('hell ya! i just did a before send');
	    	},
	    	success: function(r) {
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('udpate lesson success!');

	    			// $('#llms_course_outline_sort').append(r.data);
	    			// $(window).trigger('build');
	    			//close metabox
	    			// $('#TB_window').fadeOut();
	    			// self.parent.tb_remove();

	    		}
	    	}

	    });

	},

	resortLessons: function() {

		var lesson_tree = {};

		$( '.llms-lesson-tree' ).each( function() {

			//loop through all lessons and set order
			$(this).find( '.llms-lesson').each( function(i) {
    			i++;

    			//set parent section
    			var parentSection = $(this).parent().parent().find('[name="llms_section_id[]"]').val();
    			// alert(parentSection);
    			$(this).find('[name="llms_lesson_parent_section[]"]').val(parentSection);

    			//set the new order
    			$(this).find('[name="llms_lesson_order[]"]').val(i);
    			$(this).find('.llms-lesson-order').html(i);
    			console.log(parentSection);

    			//save parent section and order to object
    			var id = $(this).find('[name="llms_lesson_id[]"]').val();
    			lesson_tree[id] = {
    				parent_section : parentSection,
    				order : i
    			};

    		});
		});

		LLMS.MB_Course_Outline.updateLessonOrder( lesson_tree );

	},

	createSection: function( values ) {

		console.log( values.llms_section_name );

		console.log('about to do an ajax call');
	    LLMS.Ajax.call({
	    	data: {
	    		action: 'create_section',
				title: values.llms_section_name

	    	},
	    	beforeSend: function() {
	    		console.log('hell ya! i just did a before send');
	    	},
	    	success: function(r) {
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO total success!!!!!');

	    			$('#llms_course_outline_sort').append(r.data);
	    			$(window).trigger('build');
	    			LLMS.MB_Course_Outline.addSectionRowFunctionality();

	    			//clear form
	    			$( '#llms_create_section' ).each(function(){
					    this.reset();
					});

	    		}
	    	}

	    });

	},

	addSectionRowFunctionality: function() {

		//lesson sortable functionality
		$( '.llms-lesson-tree' ).sortable({
			connectWith: '.llms-lesson-tree',
			axis 		: 'y',
	    	placeholder : 'placeholder',
	    	cursor		: 'move',
	    	forcePlaceholderSize:true,
	    	stop: function() {

	    		LLMS.MB_Course_Outline.resortLessons();
	    	}

		}).disableSelection();

		$( '#llms_course_outline_sort' ).sortable({
			connectWith: '.sortablewrapper',
			axis 		: 'y',
	    	placeholder : 'placeholder',
	    	cursor		: 'move',
	    	forcePlaceholderSize:true,
	    	stop: function() {
	    		LLMS.MB_Course_Outline.resortSections();
	    	}
		}).disableSelection();

		//edit section modal
	    $('a.llms-edit-section-link').click(function(){
	    	var _that = $(this);
	        $('#' + $(this).attr('data-modal_id') ).topModal( {
	        	title: $(this).attr('data-modal_title'),
	        	open: function() {
	        		var section_id = _that.parent().parent().find('[name="llms_section_id[]"]').val();
	        		LLMS.MB_Course_Outline.getSection(section_id);
	        	}

	        });
	    });

	    //delete section modal
	    $('a.llms-delete-section-link').click(function(){
	    	var _that = $(this);
	        $('#' + $(this).attr('data-modal_id') ).topModal( {
	        	title: $(this).attr('data-modal_title'),
	        	open: function() {

	        		var section_id = _that.parent().parent().find('[name="llms_section_id[]"]').val();
	        		$('#llms-section-delete-id').val(section_id);

	        	}

	        });
	    });

	},

	addLessonRowFunctionality: function() {

		//edit lesson modal
	    $('a.llms-edit-lesson-link').click(function(){
	    	var _that = $(this);
	        $('#' + $(this).attr('data-modal_id') ).topModal( {
	        	title: $(this).attr('data-modal_title'),
	        	open: function() {
	        		var lesson_id = _that.parent().parent().parent().find('[name="llms_lesson_id[]"]').val();
	        		LLMS.MB_Course_Outline.getLesson(lesson_id);
	        	}

	        });
	    });

		//update lesson title
		$( '.llms-remove-lesson-link' ).on( 'click', function(e) {
			console.log('remove link clicked');
			e.preventDefault();

			var lesson_id = $(this).parent().parent().parent().find('[name="llms_lesson_id[]"]').val();

			LLMS.MB_Course_Outline.removeLesson( lesson_id );

		});

	},

	createLesson: function( values ) {

		console.log('about to do an ajax call');
	    LLMS.Ajax.call({
	    	data: {
	    		action: 'create_lesson',
				title: values.llms_lesson_name,
				excerpt: values.llms_lesson_excerpt,
				section_id: values.llms_section
	    	},
	    	beforeSend: function() {
	    		console.log('hell ya! i just did a before send');
	    	},
	    	success: function(r) {
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO total success!!!!!');

	    			//find the correct section and attach lesson
	    			$( '.llms-section' ).each( function() {

						var input_value = $(this).find('[name="llms_section_id[]"]').val();
						console.log(input_value);
						if ( input_value === values.llms_section ) {
							console.log('found one');
							console.log($(this));
							console.log($(this).find('.llms_lesson_tree'));
							$(this).find( '#llms_section_tree_' + values.llms_section ).append(r.data);
						}

					});

	    			//close modal window
	    			$(window).trigger('build');
	    			LLMS.MB_Course_Outline.addLessonRowFunctionality();

	    			//clear form
	    			$( '#llms_create_lesson' ).each(function(){
					    this.reset();
					});

	    		}
	    	}

	    });

	},

	addExistingLesson: function( values ) {

		console.log('about to do an ajax call');
	    LLMS.Ajax.call({
	    	data: {
	    		action: 'add_lesson_to_course',
	    		lesson_id: values.llms_lesson,
				section_id: values.llms_section
	    	},
	    	beforeSend: function() {
	    		console.log('hell ya! i just did a before send');
	    	},
	    	success: function(r) {
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO total success!!!!!');

	    			$( '.llms-section' ).each( function() {

						var input_value = $(this).find('[name="llms_section_id[]"]').val();
						console.log(input_value);
						if ( input_value === values.llms_section ) {
							console.log('found one');
							console.log($(this));
							$(this).find( '#llms_section_tree_' + values.llms_section ).append(r.data);
						}

					});

	    			//close modal window
	    			$(window).trigger('build');
	    			LLMS.MB_Course_Outline.addLessonRowFunctionality();

	    			$( '#llms_add_existing_lesson' ).each(function(){
					    this.reset();
					});

	    		}
	    	}

	    });

	},

	getSections: function() {

		LLMS.Ajax.call({
	    	data: {
	    		action: 'get_course_sections',
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO total success!!!!!');

	    			$('#llms-section-select').empty();

					$.each(r.data, function(key, value) {
						//append a new option for each result
						var newOption = $('<option value="' + value.ID + '">' + value.post_title + '</option>');
						$('#llms-section-select').append(newOption);

					});

					// refresh option list
					$('#llms-section-select').trigger('chosen:updated');

	    			//$('#llms_course_outline_sort').append(r.data);
	    			//$(window).trigger('build');

	    		}
	    	}

	    });

	},

	getSection: function( section_id ) {
console.log(section_id);
		LLMS.Ajax.call({
	    	data: {
	    		action: 'get_course_section',
	    		section_id: section_id
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO section total success!!!!!');

					$('#llms-section-edit-name').val(r.data.post.post_title);
					$('#llms-section-edit-id').val(r.data.id);

	    		}
	    	}

	    });

	},

	getLesson: function( lesson_id ) {
console.log(lesson_id);
		LLMS.Ajax.call({
	    	data: {
	    		action: 'get_course_lesson',
	    		lesson_id: lesson_id
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO section total success!!!!!');

					$('#llms-lesson-edit-name').val(r.data.post.post_title);
					$('#llms-lesson-edit-excerpt').val(r.data.post.post_excerpt);
					$('#llms-lesson-edit-id').val(r.data.id);

	    		}
	    	}

	    });

	},

	updateSection: function( values ) {

		LLMS.Ajax.call({
	    	data: {
	    		action: 'update_course_section',
	    		section_id: values.llms_section_edit_id,
	    		title: values.llms_section_edit_name
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO section total success!!!!!');

	    			//find and update section title in tree
	    			//find the correct section and attach lesson
	    			$( '.llms-section' ).each( function() {

						var input_value = $(this).find('[name="llms_section_id[]"]').val();
						console.log(input_value);
						if ( input_value === values.llms_section_edit_id ) {
							console.log('found one');
							console.log($(this));
							console.log($(this).find('.llms-section-title'));
							$(this).find( '.llms-section-title' ).html(r.data.title);
						}

					});

					// $('#llms-section-edit-name').val(r.data.post.post_title);
					// $('#llms-section-edit-id').val(r.data.id);
					//
					$(window).trigger('build');

					//clear form
					$( '#llms_edit_section' ).each(function(){
					    this.reset();
					});

	    		}
	    	}

	    });

	},

	updateLesson: function( values ) {

		LLMS.Ajax.call({
	    	data: {
	    		action: 'update_course_lesson',
	    		lesson_id: values.llms_lesson_edit_id,
	    		title: values.llms_lesson_edit_name,
	    		excerpt: values.llms_lesson_edit_excerpt
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO section total success!!!!!');

	    			//find the correct lesson and update the title and description
	    			$( '.llms-lesson' ).each( function() {

						var input_value = $(this).find('[name="llms_lesson_id[]"]').val();
						console.log(input_value);
						if ( input_value === values.llms_lesson_edit_id ) {
							$(this).find( '.llms-lesson-title' ).html(r.data.title.title);
							$(this).find( '.llms-lesson-excerpt' ).html(r.data.excerpt.post_excerpt);
						}

					});

					$(window).trigger('build');

					$( '#llms_edit_lesson' ).each(function(){
					    this.reset();
					});

	    		}
	    	}

	    });

	},

	removeLesson: function( lesson_id ) {

		LLMS.Ajax.call({
	    	data: {
	    		action: 'remove_course_lesson',
	    		lesson_id: lesson_id,
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO section total success!!!!!');

	    			//find the correct lesson and remove it
	    			$( '.llms-lesson' ).each( function() {

						var input_value = $(this).find('[name="llms_lesson_id[]"]').val();
						console.log(input_value);
						if ( input_value === lesson_id ) {
							$(this).remove();
							LLMS.MB_Course_Outline.resortLessons();
						}

					});

	    		}
	    	}

	    });

	},

	deleteSection: function( values ) {

		LLMS.Ajax.call({
	    	data: {
	    		action: 'delete_course_section',
	    		section_id: values.llms_section_delete_id,
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO section total success!!!!!');

	    			//find the correct lesson and remove it
	    			$( '.llms-section' ).each( function() {

						var input_value = $(this).find('[name="llms_section_id[]"]').val();
						console.log(input_value);
						if ( input_value === values.llms_section_delete_id ) {
							$(this).remove();
							LLMS.MB_Course_Outline.resortSections();
						}

					});

					$(window).trigger('build');

	    		}
	    	}

	    });

	},

	getLessons: function() {

		LLMS.Ajax.call({
	    	data: {
	    		action: 'get_lesson_options_for_select',
	    	},
	    	success: function(r) {
	    		console.log('success came back');
	    		console.log(r);

	    		if ( r.success === true ) {
	    			console.log('WOOOOOO total success!!!!!');

	    			$('#llms-lesson-select').empty();

					$.each(r.data, function(key, value) {
						//append a new option for each result
						var newOption = $('<option value="' + key + '">' + value + '</option>');
						$('#llms-lesson-select').append(newOption);

					});

					// refresh option list
					$('#llms-lesson-select').trigger('chosen:updated');

	    			//$('#llms_course_outline_sort').append(r.data);
	    			//$(window).trigger('build');

	    		}
	    	}

	    });

	},

	/**
	 * Initial Course setup
	 * displays modal window
	 * User enters course name
	 * Submit adds title to course and saves course as draft.
	 * @return {[type]} [description]
	 */
	setup_course: function() {

		//only run this function on new posts of type course
		var $R = LLMS.Rest,
			new_post = ['post-new.php'],
			post_type = 'course',
			query_vars = $R.get_query_vars();

		if ( $R.is_path(new_post) && query_vars.post_type === post_type ) {
			$(document).ready(function() {
				$('#pop1').topModal( {
		        	title: 'Create New Course'
		        });
			});

			// $(document).ready(function() {
		 //        tb_show('Create Your Course','#TB_inline?width=700&inlineId=hiddenModalContent&class=thickbox',null);
		 //        $('#TB_ajaxContent').css({ width: '100%' });
		 //        $('#TB_ajaxContent').css({ height: '100%' });
		 //        $('#TB_ajaxContent').addClass('llms-thickbox');
		 //    });

		 //    $( '#TB_window' ).each( function() {
			// 	var w = window.innerWidth * 0.25,
			// 	h = window.innerHeight * 0.25,
			// 	href = $( this ).attr('href'),
			// 	find = 'width=1200&height=800',
			// 	replace = 'width=' + w + '&height=' + h;
			// 	href = href.replace( find, replace );
			// 	$( this ).attr( 'href', href );
			// } );

			//on submit set course title and save post as draft
		    $( '#llms-create-course-submit').click(function(e) {

		    	$('#title').val( $('#llms-course-name').val() );
		    	$('#save-post').click();
		    	////save for later when you want to close a modal
		    	// $('#TB_window').fadeOut();
		    	// self.parent.tb_remove();
	    		e.preventDefault();
		    });

		   //  console.log('about to do an ajax call');
		   //  LLMS.Ajax.call({
		   //  	data: {
		   //  		action: 'test_ajax_call',
					// variable: 'this is a test variable',
		   //  	},
		   //  	beforeSend: function() {
		   //  		console.log('hell ya! i just did a before send');
		   //  	},
		   //  	success: function(r) {
		   //  		console.log('WOOOOOO total success!!!!!');
		   //  		console.log(r);
		   //  	}

		   //  });
	    }
	}

};