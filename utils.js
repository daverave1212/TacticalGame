

function findInArray(arr, prop, val){
	for(let i = 0; i<arr.length; i++){
		if(arr[i][prop] == val) return i
	}
	return null
}

function randomOf(...args){
	return args[randomInt(0, args.length - 1)];
}

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports.findInArray = findInArray
module.exports.randomOf = randomOf
module.exports.randomInt = randomInt