if (window["opera"]){
	// Make "console.log()" work.
	console = {};
	console.log = function(){
		opera.postError(arguments.join(" "));
	}
	if (window.widget && window.widget.widgetMode && window.widget.widgetMode=="application"){
		console.log = function(){}
	}
}


dojo = {
	
	getObject:function(objString, scope){
		var parts = objString.split("."),
			obj = (scope || window);
		for (var i=0; p=parts[i]; i++){
			if (typeof obj[p]!="undefined"){
				obj = obj[p];
			} else {
				return null;
			}
		}
		return obj;
	},
	
	isObject:function(objString, scope){
		// summary: Check if the given string represents an object reference.
		// examples:
		// 		>>> util.isObject("window.document"); // Verify that window.document is an object.
		// 		true
		// 		>>> util.isObject("window.util.isObject"); // Verify that util.isObject exists.
		// 		true
		// 		>>> util.isObject("util.isNotAFunction"); // Check the negative case.
		// 		false
		return this.getObject(objString, scope)!==null;
	},
	
	byId:function(s){
		return document.getElementById(s);
	},
	
	query:function(query, parentNode){
		// summary: Works with ".className", "#id", and ".className .className"
		// Actually we would need querySelectorAll() :-).
		// But we don't have it, so we just kinda fake it.
		var parts = query.split(" ");
		if (parts.length > 1){
			return this.query(parts.slice(1).join(" "), this.query(parts[0]));
		}
		if (query.charAt(0)=="."){
			return document.getElementsByClassName(query.substr(1));
		}
		if (query.charAt(0)=="#"){
			return [dojo.byId(query.substr(1))];
		}
		return [];
	},
	
	connect:function(node, event, callback){
		// summary: Connect the event on a node to the callback.
// TODO make this loop over multiple nodes if given or if found via util.query() and return an array of handles.
		var n = (typeof node=="string") ? this.query(node)[0] : node,
			e = event.replace(/^on/, "");
		n.addEventListener(e, callback, false);
	}
};
