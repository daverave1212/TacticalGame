

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

function has(){
	let obj = arguments[0]
	for(let i = 1; i<arguments.length; i++){
		if(obj[arguments[i]] == null) return false
	}
	return true
}

function hasnt(){
	return !has(arguments)
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






StructureTypes = {
	'House' : {
		name : 'House',
		cost : {
			wood : 3,
			stone : 3,
		},
		res : {
			gold : 4,
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
			this.matrix[i] = []
			for(let j = 0; j<w; j++){
				this.matrix[i][j] = new Tile(j, i)
			}
		}
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
			return done(`Structure ${struct.name} built`)
		} else {
			return fail(`Not enough resources!`)
		}
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
	}
	
	getCurrentPlayer(){
		return this.players[this.currentPlayerIndex]
	}
	
	takeTurn(playerName, action, pars){
		let playerIndex = utils.findInArray(this.players, 'name', playerName)
		let player = this.players[playerIndex]
		let didItWork = player.takeTurn(action, pars)
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
	if(game.getCurrentPlayer().name != pars.name) res.send(fail(`Not your turn!`)) // Not your turn!
	let didItWork = game.takeTurn(pars.name, pars.action, pars)
	res.send(didItWork)
})

app.get('/get_board', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'gameID')) res.send(false)
	res.send(Games[pars.gameID].board)
})


app.get('/test', (req, res)=>{
	Games['game1'] = new Game('game1')	// Create game
	Games['game1'].addPlayer('Dave')
	Games['game1'].addPlayer('Daisy')
	Games['game1'].start()
	res.send(true)
})


app.get('/templ', (req, res)=>{
	let pars = req.query
	if(hasnt(pars, 'name')) res.send(false)
	res.send(true)
})

app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`)
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