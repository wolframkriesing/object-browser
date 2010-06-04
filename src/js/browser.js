var browser = {
	execute:function(funcName){
		var objName = funcName.replace(/\.[^.]*$/, ""); // Remove the function name at the end.
		var fncName = funcName.split(".").pop(); // Extract the object/scope where the function shall be called in.
		var ref = dojo.getObject(funcName);
		var ret = null;
		if (ref){
			try{
				ret = "returns: " + ref.apply(dojo.getObject(objName), []);
			}catch(e){
				ret = [];
				for (var key in e){
					ret.push(key+": "+e[key]);
				}
				ret = ret.join("<br />");
			}
		}
		var node = dojo.query(".content .result")[0];
		node.className = node.className.replace("displayNone", "");
		node.innerHTML = ret;
	}
};

var render;
(function(){
	
	var TEMPLATES = {
		ROW:
			'<a class="row typeOf_${typeOf} classType_${classType}" onclick="render(\'${objectName}\')">'+
				'${name} <span class="value">${value}</span> <span class="error">${error}</span>'+
			'</a>'
		,
		BREADCRUMB:
			'<button class="objectName" onclick="render(\'${fullObjectName}\')">${objectName}</button>.'
		,
		FUNCTION:
			'<div class="execute" onclick="browser.execute(\'${functionName}\')">Execute (Without params)</div>'
		,
		FUNCTION_RESULT:
			'<div class="result displayNone"></div>'
		,
		VALUE:
			'<div class="type">type: ${typeOf}</div>'+
			'<pre>${sourceCode}</pre>'
	};
	
	render = function(objectName){
		_lastSearchString = ""; // Reset the search string or it wont start the search.
		var objRef = dojo.getObject(objectName);
		var reflectData = reflect(objectName);
		var n = dojo.query(".content")[0];
		var fnavi = dojo.query(".floatingNav")[0];
		var rows = [];
		renderStatusBar(objectName);
		window.scrollTo(0, 0); // Reset scrolling.
		dojo.query(".statusBar .filterBy")[0].value = ""; // Reset the search value.
		n.innerHTML = "Loading...";
		if (typeof objRef!="object"){
			var content = _render({sourceCode:_htmlEncode(""+objRef), typeOf:typeof objRef}, TEMPLATES.VALUE);
			if (typeof objRef=="function"){
				content = _render({functionName:objectName}, TEMPLATES.FUNCTION) +
						_render({}, TEMPLATES.FUNCTION_RESULT) +
						content;
			}
			n.innerHTML = content;
			fnavi.style.display = "none";
			return;
		}
		fnavi.style.display = "block";
		
		var objectNames = []; // Contains all object names in the order they are rendered.
		var typesOrder = ["objects", "functions", "properties"]; // The order in which we want to sort the objects.
		for (var i=0, l=typesOrder.length, t; i<l; i++){
			t = typesOrder[i];
			rows.push('<a name="' + t + '"> </a>');
			for (var j=0, l1=reflectData[t].length, o; j<l1; j++){
				o = reflectData[t][j];
				objectNames.push([objectName + "." + o.name, o.name]);
				rows.push(_renderRow(o));
			}
		}
		
		n.innerHTML = rows.join("");
		// Add the property "_name" to the node, so we can use it for filtering.
		var rows = dojo.query(".content .row");
		for (var i=0, l=rows.length; i<l; i++){
			rows[i]._name = objectNames[i][1];
		}
		dojo.query(".floatingNav .numObjects")[0].innerHTML = dojo.query(".content .classType_object").length;
		dojo.query(".floatingNav .numFunctions")[0].innerHTML = dojo.query(".content .classType_method").length;
		dojo.query(".floatingNav .numProperties")[0].innerHTML = dojo.query(".content .classType_property").length;
	};
	
	function _renderRow(data){
		var t = data.typeOf;
		// Set the type of value it is in a class context, object, method or property.
		data.classType = (t=="function" ? "method" :
							(t=="object" ? t : "property")
						);
		data.typeLetter = data.typeOf.substr(0, 1).toUpperCase();
		data.error = ""; // Defaults for tpl vars.
		data.value = "";
		switch (data.typeOf){
			case "object":
				try{
					data.value = ""+data.obj;
				}catch(e){
					data.error = e.name;
				}
				data.value = data.value.replace("[object ", "").replace(/\]$/, "");
				break;
			case "function":
				var source = ""+data.obj;
				if (!source.match(/\[native code\]/)){
					data.value = "";
//							data.value = source.match(/^(function.*\([^\)]*)/);
//console.log('source = ', source);
//							if (data.value && data.value.length){
//								data.value = data.value[0] + ")";
//							}
				} else {
					data.value = "Native Code";
				}
				break;
			default:
				data.value = ""+data.obj;
				data.value = data.value.length>20 ? data.value.substr(0, 18)+"..." : data.value;
		}
		return _render(data, TEMPLATES.ROW);
	}
	
	function _render(data, tpl){
		var row = tpl;
		for (var i in data){
			if (row.indexOf("${" + i + "}")==-1) continue; // If there is no variable to replace continue.
			try{
				row = row.replace(new RegExp("\\$\\{" + i + "\\}", "g"), data[i]);
			}catch(e){
				console.log(e.message);
			}
		}
		return row;
	};
	
	function renderStatusBar(objectName){
		var parts = objectName.split(".");
		var rendered = [];
		var fullObjNames = [];
		for (var i=0, l=parts.length, p; i<l; i++){
			p = parts[i];
			rendered.push(_render({objectName:p, fullObjectName:parts.slice(0, i+1).join(".")}, TEMPLATES.BREADCRUMB));
			//fullObjNames.push(parts.slice(0, i+1).join("."));
		}
		dojo.query(".statusBar .breadcrumb")[0].innerHTML = rendered.join("");
	}
	
	//function onBreadcrumbClick(e){
	//	if (e.target.className=="objectName"){
	//		render(e.target._objectName)
	//	};
	//};
	//
	var _lastSearchString = "";
	function onKeyUpFilterBy(evt){
		var rows = dojo.query(".content .row");
		var searchString = evt.target.value.toLowerCase();
		if (_lastSearchString==searchString){
			return;
		}
		for (var i=0; row=rows[i]; i++){
			row.style.display = row._name.toLowerCase().indexOf(searchString)==0 ? "block" : "none";
		}
		_lastSearchString = searchString;
	}
	
	function _htmlEncode(/*string*/str){
		// TODO Should become dojo.html.entities(), when exists use instead
		// summary:
		//              Adds escape sequences for special characters in XML: &<>"'
		str = String(str).replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
				.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
		return str; // string
	};
	
	dojo.connect(".statusBar .filterBy", "onkeyup", onKeyUpFilterBy);
	dojo.connect(".statusBar .filterBy", "onblur", onKeyUpFilterBy); // For those browsers that dont react upon onkeyup
	
	// I dont know why, but the real device needs this timeout :-(.
	setTimeout(function(){render("window");}, 500);
})();
