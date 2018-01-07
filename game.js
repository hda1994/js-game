'use strict';

const actorsDict = {
	"x": 'wall',
	"!": 'lava',
	"@": (pos) => { return new Player(pos)},
	"o": (pos) => { return new Coin(pos)},
	"=": (pos) => { return new HorizontalFireball(pos)},
	"|": (pos) => { return new VerticalFireball(pos)},
	"v": (pos) => { return new FireRain(pos)}
}
function rand(max = 10, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getWidth(w){
	if((w === undefined) || (!Array.isArray(w))){
		return 0;
	}
	else{
		return w.length;
	}
}

class Vector{
	constructor(x = 0, y = 0){
		this.x = x;
		this.y = y;
	}
	
	get type(){
		return 'vector';
	}
	
	plus(vect){
		if(vect.type !== 'vector'){
			throw new Error('Is not a vector');
		}
		let v = new Vector(this.x + vect.x, this.y + vect.y);
		return v;
	}
	
	times(n){ 
		let v = new Vector(n * this.x, n * this.y);
		return v;
	}
	
	isVector(){
		if(this.type === 'vector'){
			return true;
		}
		else{
			return false;
		}
	}
	
}

class Actor{
	constructor(pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)){
		if(pos.isVector){
			this.pos = pos;
		}
		else{
			throw new Error('Is not a vector');
		}
		if(size.isVector){
			this.size = size;
		}
		else{
			throw new Error('Is not a vector');
		}
		if(speed.isVector){
			this.speed = speed;
		}
		else{
			throw new Error('Is not a vector');
		}
	}
	
	act(){
		
	}
	
	get left(){
		return this.pos.x;
	}
	get right(){
		return this.pos.x + this.size.x;
	}
	get bottom(){
		return this.pos.y + this.size.y;
	}
	get top(){
		return this.pos.y;
	}	
	
	get type(){
		return 'actor';
	}
	
	
	isIntersect(newActor){
		if(newActor.type !== 'actor'){
			throw new Error('Is not an actor');
		}
		else{
			if(newActor === this){
				return false;
			}
			
			if(
					(
						((newActor.left < this.right) && (newActor.left > this.left)) || 
						((newActor.right < this.right) && (newActor.right > this.left)) ||
						((newActor.right > this.right) && (newActor.right < this.left)) ||
						((newActor.left > this.right) && (newActor.left < this.left))
					) 
					&& 
					(
					 	((newActor.top < this.bottom) && (newActor.top > this.top)) || 
						((newActor.bottom < this.bottom) && (newActor.bottom > this.top)) ||
						((newActor.bottom > this.bottom) && (newActor.bottom < this.top)) ||
					 	((newActor.top > this.bottom) && (newActor.top < this.top))
				 	) 
			){
				return true;
		 	}
			
			if(
					(
						((newActor.left < this.right) && (newActor.left > this.left)) || 
						((newActor.right < this.right) && (newActor.right > this.left)) ||
						((newActor.right > this.right) && (newActor.right < this.left)) ||
						((newActor.left > this.right) && (newActor.left < this.left))
					) 
					&& 
					(
					 	((newActor.top < this.top) && (newActor.bottom > this.bottom)) || 
						((newActor.bottom < this.top) && (newActor.top > this.bottom))
				 	) 
			){
				return true;
		 	}			

			if(
					(
						((newActor.left < this.left) && (newActor.right > this.right)) || 
						((newActor.right < this.left) && (newActor.left > this.right))
					) 
					&& 
					(
					 	((newActor.top < this.bottom) && (newActor.top > this.top)) || 
						((newActor.bottom < this.bottom) && (newActor.bottom > this.top)) ||
						((newActor.bottom > this.bottom) && (newActor.bottom < this.top)) ||
					 	((newActor.top > this.bottom) && (newActor.top < this.top))
				 	) 
			){
				return true;
		 	}			
//			else{
				return false;
//			}
		}
	}
}

class Level{
	constructor(grid, actors){
		this.actors = actors; // Array of Actor
		if(grid === undefined){
			this.grid = [[]];
			this.height = 0;
			this.width = 0;
		}
		else{
			this.grid = grid;//Array of Array of String
			this.height = grid.length;
			this.width = getWidth(this.grid[0]);
			for (let g of this.grid){
				if(getWidth(g) > this.width){
					this.width = getWidth(g);
				}
			}
		}
		///////////////////////////////////////////////////????????????????????
		this.player = undefined;
		for(let p in actors){
			if(p.type === 'player'){
				this.player = p;
			}
		}
		this.status = null;
		this.finishDelay = 1;
	}
	
	isFinished(){
		if((this.status !== null) && (this.finishDelay < 0)){
			return true;
		}
		return false;
	}
	
	actorAt(actor){
		if(!(actor instanceof Actor)){
			throw new Error('Is not an actor');
		}
		if(this.height === 0){
			return undefined;
		}
		/////////////////////////////////////////////////////////////////
		for (let a in this.actors){
			if (actor.isIntersect(a)){
				return a;
			}
		}
		
		return undefined;
	}
	
	obstacleAt(pos, size){
		if((pos.type !== 'vector') && (size.type !== 'vector')){
			throw 'Not a vector';
		}
		
		let actor = new Actor(pos, size);
		let tmp = this.actorAt(actor);///////////////////////////////
		if(tmp === undefined){
			if((actor.left < 0) || (actor.right > this.width) || (actor.top < 0)){
				return 'wall';
			}
			if(actor.bottom > this.height){
				return 'lava';
			}
		}
		else{
			return tmp;
		}
		return undefined;
	}
	
	removeActor(actor){
//		for(let a in this.actors){
//			if(a == actor){
//				a = null;
//			}
//		}
		//////////////////////////////////////////////////////////////
	}
	
	noMoreActors(type){
		
		for (let i = 0; i < this.grid.length; i++){
			for (let j = 0; j < this.grid[i].length; j++){
				if (this.grid[i][j].type === type){
					return false;
				}
			}
		}
		
		return true;
		//////////////////////////////////////////////////////////////
	}
	
	playerTouched(type, actor){
		if(this.status !== null){
			return;
		}
		if((type === 'lava') || (type === 'fireball')){
			this.status = 'lost';
			return;
		}
		if(type === 'coin'){
			this.removeActor(actor);
			if(this.noMoreActors('coin')){
				this.status = 'won';
			}
			return;
		}
		return;//////////////////////////////////////?????????????????????????????
	}
}

class LevelParser {
	constructor(dict){
		this.dict = dict;
	}
	
	actorFromSymbol(str){
		if(str === undefined){
			return undefined;
		}
		let keys = Object.keys(this.dict);
		for(let key of keys){
			if(key == str){
				return this.dict[key];
			}
		}
		return undefined;
	}
	
	obstacleFromSymbol(str){
		if(str === undefined){
			return undefined;
		}
		if('x' == str){
			return 'wall';
		}
		if('!' == str){
			return 'lava';
		}
		
		return undefined;
	}
	
	createGrid(strings){
		let tmp = new Array();
		if(strings.length === 0){
			return [];
		}
		for(let i = 0; i < strings.length; i++){
			tmp[i] = new Array();
			for(let j = 0; j < strings[i].length; j++){
					tmp[i][j] = this.obstacleFromSymbol(strings[i][j]);
			}
		}
		return tmp;
	}
	
	createActors(strings){////////////////////////////////////////////////
		let tmp = [];
		let k = 0;
		for(let i = 0; i < strings.length; i++){
			for(let j = 0; j < strings[i].length; j++){
				let tmpKey = this.actorFromSymbol(strings[i][j]);
				if((tmpKey !== undefined) && (typeof(tmpKey) === 'function') && (tmpKey instanceof Actor)){
					tmp[k++] = this.actorFromSymbol(strings[i][j])(new Vector(i, j));// i j     or j i ?
				}
			}
		}
		return tmp;
	}
	
	parse(plan){
		return new Level(this.createGrid(plan), this.createActors(plan));
	}
}

class Fireball extends Actor{
	constructor(pos, speed){
		super(pos, new Vector(1, 1), speed);
	}
	
	get type(){
		return 'fireball';
	}
	
	getNextPosition(time = 1){
		//let speed = this.speed.times(time);
		let tmpV = this.pos.plus(this.speed.times(time));
		return tmpV;
	}
	
	handleObstacle(){
		this.speed = this.speed.times(-1);
	}
	
	act(time = 1, lev){
//		let tmp = this.getNextPosition(time);
//		let is = false;
//		for(let i = 0; i < lev.grid.length; i++){
//			for(let j = 0; j < lev.grid[i].length; j++){
//				if(lev.grid[i][j])
//			}
//		}
		///////////////////////////////////////////
	}
}

class HorizontalFireball extends Fireball{
	constructor(pos){
		super(pos, new Vector(2, 0));
	}
}

class VerticalFireball extends Fireball{
	constructor(pos){
		super(pos, new Vector(0, 2));
	}
}

class FireRain extends Fireball{
	constructor(pos){
		super(pos, new Vector(0, 3));
		this.tmp = pos;
	}
	
	handleObstacle(){
		this.pos = this.tmp;
	}
}

class Coin extends Actor{
	constructor(pos = new Vector(0,0)){
		let v = new Vector(0.6, 0.6);
		super(pos.plus(new Vector(0.2, 0.1)), v);
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.spring = rand(2 * Math.PI, 0);
	}
	get type(){
		return 'coin';
	}
	
	updateSpring(time = 1){
		this.spring += this.springSpeed * time; 
	}
	getSpringVector(){
		return new Vector(0, Math.sin(this.spring) * this.springDist);
	}
	getNextPosition(time = 1){
		this.pos = this.pos.plus(this.getSpringVector());
		this.updateSpring(time);
		return this.pos;
	}
	act(time){
		///////////////////////////////////////////////////////////////////////////////////
	}
}

class Player extends Actor{
	constructor(pos = new Vector(0,0)){
		super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
	}
	get type(){
		return 'player';
	}
}
