

const express	= require('express')
const cors		= require('cors')
const app		= express()
const path		= require('path')
const utils		= require('./utils.js')
const router	= express.Router()
var   port		= process.env.PORT || 3000
app.use(cors())	// Makes it cross-origin something

const FAIL		= false
const DONE		= true


// ----------------------------------------------------------------------------
// --------------------  UTILS  -----------------------------------------------
// ----------------------------------------------------------------------------

var print = console.log

function has(){
	let obj = arguments[0]
	console.log("\t > Does:")
	console.log(obj)
	console.log("\t > Have:")
	console.log(arguments.length)
	console.log(arguments)
	for(let i = 1; i<arguments.length; i++){
		console.log(arguments[i])
		console.log("ADADAS")
		if(obj[arguments[i]] == null) return false
	}
	return true
}

function hasnt(){
	let obj = arguments[0]
	for(let i = 1; i<arguments.length; i++){
		if(obj[arguments[i]] == null) return true
	}
	return false
}

function fail(msg){
	return {
		success : false,
		message : msg
	}
}

function done(msg){
	return {
		success : true,
		message : msg
	}
}


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

/*
	To win, you need points:
	- Build Temple (1 point)
	- Conquer camp (1 point)
	- Build 10 structures (1 point)
	- 
	
*/

// Barracks - protectes adjacent squares from enemy
// Temple - 10 points
// Farm - icreases adjacent resources on tiles


// Each structure is worth points
StructureTypes = {
	'House' : {					// Collects the resources on the tile aswell
		name : 'House',
		cost : {
			wood : 3,
			stone : 3,
		},
		res : {
			gold : 3,
			food : 3
		}
	},
	'Tower' : {
		name : 'Tower',
		cost : {
			stone : 3,
			wood : 1
		},
		res : {
			force : 6
		}
	},
	'Town Hall' : {
		name : 'Town Hall',
		cost : {},
		res : {}
	},
	'Temple' : {
		name : 'Temple',
		cost : {
			stone : 3,
			wood : 3,
			gold : 3,
			food : 3,
			force : 3,
		},
		res : {
			points : 1
		}
	},
	'Windmill' : {
		name : 'Windmill',
		cost : {
			stone : 2,
			food : 2,
			wood : 2
		},
		res : {
			food : 3,
			gold : 3
		}
	}
	
}

function random2Resources(){
	let res = {
		gold : 0,
		wood : 0,
		food : 0,
		stone : 0
	}
	res[utils.randomOf('gold', 'wood', 'food', 'stone')] += 1
	res[utils.randomOf('gold', 'wood', 'food', 'stone')] += 1
	return res
}

class Tile{
	constructor(x, y, board){
		this.board = board
		this.x = x
		this.y = y
		this.type = 'grass'
		this.structure = null
		this.ownerName = null
		this.res = random2Resources()
	}
	
	buildStructure(str, playerName){
		this.structure = StructureTypes[str]
		this.ownerName = playerName
	}
	
	isFree(){
		if(this.structure == null && this.ownerName == null) return true
		return false
	}
	
	getNeighbors(){
		let neighbors = []
		let b = this.board
		let x = this.x
		let y = this.y
		if(b.tileExists(x - 1, y)) neighbors.push(b.getTile(x - 1, y))
		if(b.tileExists(x + 1, y)) neighbors.push(b.getTile(x + 1, y))
		if(b.tileExists(x, y - 1)) neighbors.push(b.getTile(x, y - 1))
		if(b.tileExists(x, y + 1)) neighbors.push(b.getTile(x, y + 1))
		return neighbors
	}
	
}

class Board{
	constructor(w, h, game){
		this.width = w
		this.height = h
		this.matrix = []
		for(let i = 0; i<h; i++){
			this.matrix[i] = []
			for(let j = 0; j<w; j++){
				this.matrix[i][j] = new Tile(j, i, this)
			}
		}
	}
	
	tileExists(x, y){
		if(y >= 0 && y < this.height && x >= 0 && x < this.width) return true
		return false
	}
	
	getTile(x, y){
		return this.matrix[y][x]
	}
}

class Player{
	constructor(n, game){
		this.game = game
		this.name = n
		this.res = {
			gold : 10,
			wood : 10,
			food : 10,
			stone : 10,
			force : 10,
			points : 0,
		}
	}
	
	addResources(res){
		if(res == null) return
		if(res.gold  != null) this.res.gold  += res.gold
		if(res.wood  != null) this.res.wood  += res.wood
		if(res.food  != null) this.res.food  += res.food
		if(res.force != null) this.res.force += res.force
		if(res.stone != null) this.res.stone += res.stone
		if(res.points != null) this.res.points += res.points
	}
	
	subResources(res){
		if(res == null) return
		if(res.gold  != null) this.res.gold  -= res.gold
		if(res.wood  != null) this.res.wood  -= res.wood
		if(res.food  != null) this.res.food  -= res.food
		if(res.force != null) this.res.force -= res.force
		if(res.stone != null) this.res.stone -= res.stone
		if(res.points != null) this.res.points -= res.points
	}
	
	hasResources(res){
		if(res == null) return
		if(res.gold != null && this.res.gold < res.gold) return false
		if(res.wood != null && this.res.wood < res.wood) return false
		if(res.food != null && this.res.food < res.food) return false
		if(res.force != null && this.res.force < res.force) return false
		if(res.stone != null && this.res.stone < res.stone) return false
		if(res.points != null && this.res.points < res.points) return false
		return true
	}
	
	build(struct, tile){
		if(!this.hasResources(struct.cost)) return fail(`Not enough resources!`)
		if(!tile.isFree()) return fail('Tile is occupied!')
		let neighbors = tile.getNeighbors()
		let hasNeighbor = false
		for(let i = 0; i<neighbors.length; i++)
			if(neighbors[i].ownerName == this.name)
				hasNeighbor = true
		if(!hasNeighbor) return fail('You must build it near another building of yours!')
		this.subResources(struct.cost)
		this.addResources(struct.res)
		tile.buildStructure(struct.name, this.name)
		if(struct.name == 'House')
			this.addResources(tile.res)
		return done(`Structure ${struct.name} built`)
	}
	
	takeTurn(action, pars){
		switch(action){
			case 'build':
				if(hasnt(pars, 'x', 'y', 'structureName')) return fail(`Not enough parameters for ${action}`)
				let structure = StructureTypes[pars.structureName]
				if(structure == null) return fail(`No such structure ${pars.structureName}`)
				let tile = this.game.getTile(pars.x, pars.y)
				let didItWork = this.build(structure, tile)
				return didItWork
		}
		return fail(`Action not found ${action} for ${this.name}`)
	}

	
}

class Game{
	constructor(id){
		this.id = id
		this.board = new Board(8, 8)
		this.players = []
		this.isStarted = false
		this.currentPlayerIndex = 0
	}
	
	getTile(x, y){
		return this.board.getTile(x, y)
	}
	
	addPlayer(n){
		this.players.push(new Player(n, this))
	}
	
	start(){
		this.isStarted = true
		let p1 = {
			name : this.players[0].name,
			x : this.board.width - 2,
			y : this.board.height - 2}
		let p2 = {
			name : this.players[1].name,
			x : 1,
			y : 1}
		this.getTile(p1.x, p1.y).buildStructure('Town Hall', p1.name)
		this.getTile(p2.x, p2.y).buildStructure('Town Hall', p2.name)
	}
	
	getCurrentPlayer(){
		return this.players[this.currentPlayerIndex]
	}
	
	getPlayer(name){
		let playerIndex = utils.findInArray(this.players, 'name', name)
		return this.players[playerIndex]
	}
	
	takeTurn(playerName, action, pars){
		let playerIndex = utils.findInArray(this.players, 'name', playerName)
		let player = this.players[playerIndex]
		let didItWork = player.takeTurn(action, pars)
		if(didItWork.success == true){
			this.currentPlayerIndex++
			if(this.currentPlayerIndex == this.players.length){
				this.currentPlayerIndex = 0
			}
		}
		return didItWork
	}

	
}





// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------













Games = {}

app.get('/game', (req, res)=>{
	res.sendFile(path.join(__dirname+'/HTML/game.html'))
})

app.get('/new_game', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		 res.send(false)
		 return
	}
	let gameID = pars.gameID
	Games[gameID] = new Game(gameID)
	res.send(true)
})

app.get('/join_game', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name', 'gameID')){
		res.send(false)
		return
	}
	Games[pars.gameID].addPlayer(pars.name)
	res.send(true)
})

app.get('/start_game', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		res.send(false)
		return
	}
	Games[pars.gameID].start()
	res.send(true)
})

app.get('/turn', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name', 'action', 'gameID')){
		res.send(false)
		return
	}
	let game = Games[pars.gameID]
	if(game == null){
		res.send(fail(`No such game ${pars.gameID}`))
		console.log("Games:")
		console.log(Games)
		return
	}
	if(game.getCurrentPlayer().name != pars.name){
		res.send(fail(`Not your turn!`)) // Not your turn!
		return
	}
	let didItWork = game.takeTurn(pars.name, pars.action, pars)
	res.send(didItWork)
})





app.get('/info/board', (req, res)=>{
	let pars = req.query
	console.log(pars)
	if(hasnt(pars, 'gameID')){
		res.send(fail("No gameID passed"))
		return
	}
	res.send(Games[pars.gameID].board)
})
app.get('/info/structs', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')){
		res.send(fail("No gameID passed"))
		return
	}
	let b = Games[pars.gameID].board
	let r = ""
	for(let i = 0; i<b.height; i++){
		for(let j = 0; j<b.width; j++){
			let st = "_"
			if(b.getTile(j, i).structure != null){
				print(b.getTile(j, i).structure.name)
				st = b.getTile(j, i).structure.name[0]	// First letter
			}
			r += st + "&nbsp;&nbsp;&nbsp;"
		}
		r += "<br>"
	}
	res.send(r)
})
app.get('/info/Player', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID', 'name')) res.send(false)
	let player = Games[pars.gameID].getPlayer(pars.name)
	res.send({
		name : player.name,
		res : player.res
	})
})






function _test(){
	Games['game1'] = new Game('game1')	// Create game
	Games['game1'].addPlayer('Dave')
	Games['game1'].addPlayer('Daisy')
	Games['game1'].start()
}

app.get('/test', (req, res)=>{
	_test()
	res.send(true)
})


app.get('/templ', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name')) res.send(false)
	res.send(true)
})

app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`)
	_test()
})



















/*
// REMINDER: When you make requests, always include the link with http:// in fata!

// Just sends this
app.get('/', (request, response) => {
	response.send('Hello World')
})

// When this page is accessed, return the index.html file
app.get('/index.html', (req, res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
})

// When our index.html loads, it requests the style from the same server. That's why we need this
app.get('/style.css', (req, res) => {
	res.sendFile(path.join(__dirname+'/style.css'));
})



app.get('/api/courses', (request, response)=>{
	response.send([1,2,3,4,5,6,2])
})

// Nice littlr trick ;)
app.route('/book')
	.get((req, res) => {
		res.send('Get a random book')
	})
	.post((req, res) => {
		res.send('Add a book')
	})
	.put((req, res) => {
		res.send('Update the book')
	})

'Try /api/courses/dave/21?a=20&b=30'
app.get('/api/courses/:name/:age', (request, response)=>{
	console.log(request.params)	// Params from url as p1/p2/
	console.log(request.query)	// Params from ?a=20&b=30
	if(false)response.send(request.params)
	else response.status(404).send('Something not found :c')
	if(false) response.status(400).send('Bad Request (wrong or incomplete params sent, for example)')
})

app.post('/api/courses', (req, res)=>{
	console.log(req.body)		// Params from post, JSON format
	res.send({"Dingo" : req.body})
})

*/