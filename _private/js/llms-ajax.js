function Ajax (type, data, cache) {

	this.type = type;
	this.data = data;
	this.cache = cache;
	this.dataType = 'json';
	this.url = window.ajaxurl || window.llms.ajaxurl;

}

Ajax.prototype.get_sections = function () {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { section_template(response); }
	});
};

Ajax.prototype.get_lesson = function (lesson_id, row_id, type) {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { add_edit_link(response, lesson_id, row_id, type); },
	});
};

Ajax.prototype.get_lessons = function (section_id, section_position) {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { lesson_template(response, section_id, section_position); },
	});
};

Ajax.prototype.update_syllabus = function () {
	jQuery.ajax({
       // type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
        success 	: function(response) { console.log(JSON.stringify(response, null, 4)); },
        error 		: function(errorThrown){ console.log(errorThrown); },
	});
};

Ajax.prototype.get_all_posts = function () {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { return_data(response); },
	});
};

Ajax.prototype.get_all_engagements = function () {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { return_engagement_data(response); },
	});
};

Ajax.prototype.get_associated_lessons = function (section_id, section_position) {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { add_associated_lessons(response, section_id, section_position); },
	});
};

Ajax.prototype.get_question = function (question_id, row_id) {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { add_edit_link(response, question_id, row_id); },
	});
};

Ajax.prototype.getLessons = function () {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { return_data(response); },
	});
};

Ajax.prototype.getSections = function () {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { return_data(response); },
	});
};

Ajax.prototype.get_course_tracks = function () {
	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
        cache		: this.cache,
        dataType	: this.dataType,
		success		: function(response) { return_data(response); },
	});
};


Ajax.prototype.check_voucher_duplicate = function () {

	jQuery.ajax({
		type 		: this.type,
		url			: this.url,
		data 		: this.data,
		cache		: this.cache,
		dataType	: this.dataType,
		success		: function(response) {
			llms_on_voucher_duplicate(response.duplicates);
		}
	});
};
