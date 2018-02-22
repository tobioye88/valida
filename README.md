# Valida.js

## Usage
```javascript
var options = [
{name: 'inputName', rule: 'required|numeric'},
{name: 'inputName', rule: 'required|max[9]'}
];

var myValida = new Valida('[name=formName]', options, function(errors, event){
	event.preventDefault();
	if(errors.length > 0){
		//validation failed
	}else{
		//validation passed
	}
})
```

## Rules

* required - fieled must have a value or must be checked or selected
* numeric - only numeric values allowed
* integer - only integer values allowed
* decimal - only float values allowed
* min[9] - minimum number of characters or digits
* max[9] - maximuim number of characters or digits
* exactly[9] - must have exactly the specified characters
* alphabet - only alpahbets allowed
* alpanumeric - only alpabets and numbers allowed
* matches(fieldname) - matches field in in parethesis
* email - only valid email allowes
* fileType[jpg,jpeg,png,gif] - add one or more file type seperated by commers
* fileSizeMax(5) - the maximum size of file in mb
* fileNumMax  - Maximum number of files
* fileNumMin - Minimum number of files

## If element is not in DOM use

```javascript
myValida.reload();
```


## Custom Error Message

```javascript
var options = [
{
	name: 'inputName',
	message: {required:"Custom message for each rule", max: "Hey you! What you have added is way too much!"},
	rules: required|max[2]
}
];
```

## Example

add a lint to the doucment in the head of the project or file

```html
<script type="text/javascript" src="link/to/valida.js"></script>
```

```html
<form action="" method="post" name="login">
<label for="username">Username</label>
<br>
<input type="text" name="username" id="username">
<br>
<label for="password">Password</label>
<br>
<input type="password" name="password" id="password">
<br>
<input type="submit" name="username" value="Submit">
</form>
```
```javascript
var options = [
{
	name: 'username',
	rule: 'required|min[3]',
},{
	name: 'password',
	message:{required:"Please enter a password",min: "Your Password must be at least 6 Characters long"}
	rule: 'required|min[6]',
}
];
var myValida = new Valida('[name=login]', options, function(errors, event){
	event.preventDefault();
	if(errors.length > 0){
		//failed
		errors.forEach(obj, index){
			obj.element.style.borderColor = 'red';
		});
	}else{
		//Do passed
	}
});
```

## Error Format

```
errors = [
	{'name': 'InputName', 'messages': ['Input Required', 'Input must be greater than 3'], 'element': element},
	{'name': 'InputName', 'messages': ['Input Required', 'Input must be greater than 3'], 'element': element}
];
```
