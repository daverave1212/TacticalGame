

Utils = require('/utils.js')



StructureTypes = {
	'House' : {
		name : 'House',
		cost : {
			wood : 3,
			stone : 3,
		},
		res : {
			gold : 4
			food : 4
		}
	}
}



class Tile{
	constructor(x, y, board){
		this.board = board
		this.x = x
		this.y = y
		this.type = 'grass'
		this.structure = null
		this.owner = null
	}
	
	buildStructure(str, player){
		this.structure = str
		this.owner = player
	}
	
}

class Board{
	constructor(w, h, game){
		this.width = w
		this.height = h
		this.matrix = []
		for(let i = 0; i<h; i++){
			matrix[i] = []
			for(let j = 0; j<w; j++){
				matrix[i][j] = new Tile(j, i)
			}
		}
	}
}

class Player{
	constructor(n, board){
		this.board = board
		this.name = n
		this.res = {
			gold : 10,
			wood : 10,
			food : 10,
			force : 10
		}
	}
	
	addResources(res){
		if(res == null) return
		if(res.gold  != null) this.res.gold  += res.gold
		if(res.wood  != null) this.res.wood  += res.wood
		if(res.food  != null) this.res.food  += res.food
		if(res.force != null) this.res.force += res.force
	}
	
	subResources(res){
		if(res == null) return
		if(res.gold  != null) this.res.gold  -= res.gold
		if(res.wood  != null) this.res.wood  -= res.wood
		if(res.food  != null) this.res.food  -= res.food
		if(res.force != null) this.res.force -= res.force
	}
	
	hasResources(res){
		if(res == null) return
		if(res.gold != null && this.res.gold < res.gold) return false
		if(res.wood != null && this.res.wood < res.wood) return false
		if(res.food != null && this.res.food < res.food) return false
		if(res.force != null && this.res.food < res.force) return false
		return true
	}
	
	build(struct, tile){
		if(this.hasResources(struct.cost)){
			this.subResources(struct.cost)
			this.addResources(struct.res)
			tile.buildStructure(struct, this)
		}
	}
	
}

class Game{
	constructor(id){
		this.id = id
		this.board = new Board(8, 8)
		this.players = []
	}
}

