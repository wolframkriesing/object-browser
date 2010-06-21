function reflect(objectName){
	// summary:
	//
	// returns: {objects:[], functions:[], properties:[]}
	// 		Each element has properties: obj, name, typeOf.
	var obj = dojo.getObject(objectName);
	var ret = {objects:[], functions:[], properties:[]};
	if (!obj){
		return ret;
	}
	var sortedProps = [], j;
	for (j in obj) {
		try{
			sortedProps.push(""+j);
		}catch(e){
			//console.log("hush");
		}
	}
	// We sort them all, so we just sort once.
	// Ignore leading underscores when sorting.
	sortedProps.sort(function(a, b){
		var x = a.replace(/^_/, "").toLowerCase();
		var y = b.replace(/^_/, "").toLowerCase();
		return x == y ? 0 : (x < y ? -1 : 1);
	}); // Sort case-independent.
	for (var i=0, l=sortedProps.length, s, ref; i<l; i++){
		s = sortedProps[i];
		try{
			ref = obj[s];
		}catch(e){
			ref = e.message;
		}
		var typeOf = typeof ref == "object" ? "objects" :
						typeof ref == "function" ? "functions" : "properties";
		ret[typeOf].push({
			obj:ref,
			name:s,
			objectName:objectName + "." + s,
			typeOf:typeof ref
		});
	}
	return ret;
};

