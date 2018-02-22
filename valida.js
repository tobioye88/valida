/*
author: @tobioye88
*/

var Valida = function (form, options, callback){
	var v = this;
	this.formName = form;
	this.form;
	this.event;
	this.elementType;
	this.inputType;
	this.element;
	this.elements;
	this.options = options;
	this.allErrors = [];
	this.errors = [];
	this.callback = callback || function(){};

	this._load = function(){
		this.form = document.querySelector(form);
		if(this.form){
			this.form.addEventListener('submit',  function(e){
				v.event = e;
				v.run();
			});
		}
	}
	this._load();
	this.reload = function(){
		this._load();
	}
	this.getType = function (elem){
		return elem.nodeName;
	}
	this._setElement = function(name){
		this.elements = document.querySelectorAll(this.formName + ' [name="'+name+'"]');
		// this.element = document.querySelector(this.formName + ' [name="'+name+'"]');
		this.element = this.elements[0];
		if(!this.element){
			console.warn('Valida: Element "'+name+'" does not exist');
			return;
		}
		this.elementType = this.element.nodeName.toLowerCase();
		this.inputType = this.element.type;
	}
	this._getValue = function(name){
		var value;
		if(this.elementType == 'select'){
			//select
			value = this.element.options[this.element.selectedIndex].value;// || this.element.options[this.element.selectedIndex].text;
		}else{
			//input, textarea, checkbox, etc
			value = this.element.value;
		}
		return value;
	}
	this._getMessage = function(object, name, deflt){
		if (object.message && object.message[name]) {
			return object.message[name];
		}else {
			return deflt;
		}
	}
	this.required = function(obj){
		var ruleName = 'required';
		var res = false;
		if(this.inputType == 'file'){
			res = this.element.files.length;
		}else if(this.inputType == 'radio' || this.inputType == 'checkbox'){
			this.elements.forEach(function(elem, index){
				if(elem.checked){
					res = true;
				}
			})
		}else if(this.element.nadeName == 'select'){
			res = this.element.selectedIndex > 0;
		}else{
			res = this.element.value.toString().length > 0;
		}
		if(!res > 0){
			return this._getMessage(obj, ruleName, 'Input can not be empty');
		}
	}
	this.numeric = function(obj){
		var ruleName = 'numeric';
		var value = this._getValue(obj.name);
		if(value.match(/\D+/)){
			return this._getMessage(obj, ruleName, 'Input must be numbers only');
		}
	}
	this.integer = function(obj){
		var ruleName = 'integer';
		var value = this._getValue(obj.name);
		if(value.match(/^\-?[^0-9]+$/g)){
			return this._getMessage(obj, ruleName, 'Input must be an integer only');
		}
	}
	this.decimal = function(obj){
		var ruleName = 'decimal';
		var value = this._getValue(obj.name);
		if(value.match(/^\-?[^0-9\.]+$/)){
			return this._getMessage(obj, ruleName, 'Input must be decimal only');
		}
	}
	this.alphabet = function(obj){
		var ruleName = 'alphabet';
		var value = this._getValue(obj.name);
		if(value.match(/[^a-zA-Z]/g)){
			return this._getMessage(obj, ruleName, 'Input must be alfabet only');
		}
	}
	this.alpanumeric = function(obj){
		var ruleName = 'alpanumeric';
		var value = this._getValue(obj.name);
		if(value.match(/[^a-zA-Z0-9]/g)){
			return this._getMessage(obj, ruleName, 'Input must be numbers or alphabet only');
		}
	}
	this.email = function(obj){
		var ruleName = 'email';
		var value = this._getValue(obj.name);
		if(!value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			return this._getMessage(obj, ruleName, 'Input must be a valid email');
		}
	}
	this.min = function(obj, par){
		var ruleName = 'min';
		var value = this._getValue(obj.name);
		var res = (value.toString().length > parseInt(par));
		if(!res){
			return this._getMessage(obj, ruleName, 'Input must be greater than ' + par + ' characters');
		}
	}
	this.max = function(obj, par){
		var ruleName = 'max';
		var value = this._getValue(obj.name);
		var res = !(value.toString().length > parseInt(par));
		if(res){
			return this._getMessage(obj, ruleName, 'Input must be less than ' + par + ' characters');
		}
	}
	this.exactly = function(obj, par){
		var ruleName = 'exactly';
		var value = this._getValue(obj.name);
		var res = (value.toString().length !== parseInt(par));
		if(res){
			return this._getMessage(obj, ruleName, 'Input must be exactly ' + par + ' characters');
		}
	}
	this.matches = function(obj, par){
		var ruleName = 'matches';
		var value1 = this._getValue(obj.name);
		var value2 = this._getValue(par);
		if(value1 !== value2){
			return this._getMessage(obj, ruleName, 'Input ' + obj.name + ' and ' + par + ' must match');
		}
	}
	this.fileType = function(obj, par){
		var ruleName = 'fileType';
		var res = false;
		var e = document.querySelectorAll('[name="'+obj.name+'"]');
		for(var i=0; i<e.length; i++){
			if(e[i].type == 'file'){
				if(e[i].files.length > 0){
					var fileType = e[i].files[0].name.split('.');
					var ext = fileType[fileType.length-1];
					if(par.indexOf(ext) == -1){
						res = true;
					}
				}
			}else{
				console.warn('Valida: Element is not an input file type.');
			}
		}

		if(res){
			return this._getMessage(obj, ruleName, 'File can only be of ' + par + ' file types');
		}
	}
	this.fileSizeMax = function(obj, par){
		var ruleName = 'fileSizeMax';
		var res = true;
		var totalSize = 0;
		this.elements.forEach(function(elem, i){
			if(elem.type.toLowerCase() == 'file'){
				if(elem.files.length > 0){
					for(var i=0; i<elem.files.length; i++){
						totalSize += elem.files[i].size;
					}
				}
			}else{
				console.warn('Valida: Element is not an input file type.');
			}
		});
		if((totalSize/1000000) < parseInt(par)){
			res = false;
		}
		if(res){
			return this._getMessage(obj, ruleName, 'File can not be greater than ' + par + 'mb ');
		}
	}
	this._getNumFiles = function(obj){
		var num = 0;
		var e = this.elements;
		for(var i=0; i<e.length; i++){
			num += e[i].files.length;
		}
		return num;
	}
	this.fileNumMax = function(obj, par){
		var ruleName = 'fileNumMax';
		var res = true;
		if(this.inputType == 'file'){
			numOfFiles = this._getNumFiles(obj);
			if(numOfFiles <= parseInt(par)){
				res = false;
			}
		}else{
			console.warn('Valida: Element is not an input file type.');
		}
		if(res){
			return this._getMessage(obj, ruleName, 'Number of files can not be greater than ' + par);
		}
	}
	this.fileNumMin = function(obj, par){
		var ruleName = 'fileNumMin';
		var res = true;
		if(this.inputType == 'file'){
			numOfFiles = this._getNumFiles(obj);
			if(numOfFiles >= parseInt(par)){
				res = false;
			}
		}else{
			console.warn('Valida: Element is not an input file type.');
		}
		if(res){
			return this._getMessage(obj, ruleName, 'Number of files can not be less than ' + par);
		}
	}

	this.run = function(){
		this.allErrors = [];
		// loop through the options 
		// loop throught the rules
		for(var i=0; i<this.options.length; i++){
			this.errors = [];
			var obj = this.options[i];
			var allRules = obj.rules.split('|');
			this._setElement(obj.name);
			if(this.element == '' || this.element == null){
				continue;
			}
			for(var j=0; j<allRules.length; j++){
				var error = false;
				if(allRules[j].indexOf('[') > 0){
					var inRule = allRules[j].split('[');
					var parm = inRule[inRule.length-1].replace(']', '');
					if(v[inRule[0]]){
						error = v[inRule[0]](obj, parm);
					}else{
						console.warn('Valida: Rule '+inRule[0]+' does not exist');
					}
				}else if(allRules[j].indexOf('(') > 0){
					var inRule = allRules[j].split('(');
					var parm = inRule[inRule.length-1].replace(')', '');
					if(v[inRule[0]]){
						error = v[inRule[0]](obj, parm);
					}else{
						console.warn('Valida: Rule '+inRule[0]+' does not exist');
					}
				}else{
					if(v[allRules[j]]){
						error = v[allRules[j]](obj);
					}else{
						console.warn('Valida: Rule '+allRules[j]+' does not exist');
					}
				}
				if(error){
					this.errors.push(error);
				}
			}
			if(this.errors.length){
				this.allErrors.push({'name':obj.name, 'messages': this.errors, 'element': this.element});
			}
		}
		this.callback(this.allErrors, this.event);
	}
	this.passed = function(){
		return !this.allErrors.length;
	}
}