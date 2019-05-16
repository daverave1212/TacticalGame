

function findInArray(arr, prop, val){
	for(let i = 0; i<arr.length; i++){
		if(arr[i][prop] == val) return i
	}
	return null
}

module.exports.findInArray = findInArray