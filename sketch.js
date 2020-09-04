function removeFromArray(arr,elt)
{
	for(var i = arr.length-1; i >= 0; i--)
	{
		if(arr[i] == elt)
		{
			arr.splice(i,1);
		}
	}
}


function heuristic(a,b)
{
	//This is euclidean heuristic - just diag dist
	var d = dist(a.i,a.j,b.i,b.j);//dist is p5 function
	
	//Manhattan heuristic - diff in x and y coord
	//var d = abs(a.i - b.i) + abs(a.j - b.j);

	return d;
}

var cols = 60;
var rows = 60;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start = 0;
var end;

var w = 0,h = 0;

var path = [];

var nosolution = false;

function Spot(i,j){
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbours = [];
	this.previous = undefined;
	this.wall = false; //Adding Obstacles

	if(random(1) < 0.4){
		this.wall = true;
	}
	this.show = function(col){
		fill(col);
		if(this.wall){
			fill(0);
		}
		noStroke();
		ellipse(this.i*w + w/2,this.j*h + h/2,w/2,h/2);
		//rect(this.i*w,this.j*h,w-1,h-1);
	}

	this.addNeighbours = function(grid)
	{
		var i = this.i;
		var j = this.j;

		if(i < cols-1)
		this.neighbours.push(grid[i + 1][j]);
		
		if(i > 0)
		this.neighbours.push(grid[i - 1][j]);
		
		if(j < rows - 1)
		this.neighbours.push(grid[i][j + 1]);
		
		if(j > 0)
		this.neighbours.push(grid[i][j - 1]);
		
		//Adding Diagonals - 4 diagonals to each central cell
		if(i > 0 && j > 0)
			this.neighbours.push(grid[i - 1][j - 1]);

		if(i < cols - 1 && j < rows - 1)
			this.neighbours.push(grid[i + 1][j + 1]);
	
		if(i < cols - 1 && j > 0)
			this.neighbours.push(grid[i + 1][j - 1]);
		
		if(i > 0  && j < rows - 1)
			this.neighbours.push(grid[i - 1][j + 1]);
	

	}  
}

function setup(){
	let cnv = createCanvas(700,700);
	 cnv.position(400, 55);
	console.log('A*');

	w = width/cols;
	h = height/rows;

	for(var i = 0; i < cols;i++){
		grid[i] = new Array(rows);
	}

	console.log(grid);
	
	for(var i = 0; i < cols;i++)
	{
		for(var j = 0; j < rows;j++)
		{
			grid[i][j] = new Spot(i,j);
		}
	}
	for(var i = 0; i < cols;i++)
	{
		for(var j = 0; j < rows;j++)
		{
			grid[i][j].addNeighbours(grid);
		}
	}
	
	//Coordinate-Entry using prompt

	/*var x1,x2,y1,y2,temp;
	temp = window.prompt("Enter Start X1");
	x1 = parseInt(temp);
	temp = window.prompt("Enter Start Y1");
	y1 = parseInt(temp);
	
	temp = window.prompt("Enter End X1");
	x2 = parseInt(temp);
	temp = window.prompt("Enter End Y1");
	y2 = parseInt(temp);

	start = grid[x1][y1];
	end = grid[x2][y2];
	*/

	start = grid[0][0];
	end = grid[rows - 1][cols - 1];

	start.wall = false;
	end.wall = false;
	openSet.push(start);

	console.log(grid);
}
function draw()
{

	if(openSet.length > 0)
	{
		//Keep going
		//Find next node to go with minimum f value in openSet
		var winner = 0;
		for(var i = 0; i < openSet.length; i++)
		{
			if(openSet[i].f < openSet[winner].f )
			{
				winner = i;
			}
		}

		var current = openSet[winner];

		//Last guy(node) reached then finished !
		if(current === end)
		{
			noLoop();
			console.log("DONE!");
			window.alert("Success --- Path found! REFRESH for new path...")
		}

		removeFromArray(openSet,current);
		closedSet.push(current);

		//Get all neighbours
		
		var neighbours = current.neighbours;
		
		for(var i = 0; i < neighbours.length; i++)
		{
			var neighbour = neighbours[i];
			if(!closedSet.includes(neighbour) && !neighbour.wall)
			{
				var tempG = current.g + 1;	
				
				var newpath = false;//TO avoid false choosing and update of previous
				if(openSet.includes(neighbour))	
				{
					if(tempG < neighbour.g)
					{
						neighbour.g = tempG;
						newpath = true;
					}
				}
				else
				{
					neighbour.g = tempG;
					newpath = true;
					openSet.push(neighbour);
				}

				//Now calc guess / heuristic 
				//Here simple used euclidean distance - pythagorean
				//refer different heuristic too

				if(newpath)
				{
					neighbour.h = heuristic(neighbour,end);
					neighbour.f = neighbour.g + neighbour.h;
					neighbour.previous = current;	
				}
				

			}
			
		}

	}	
	else
	{
		//No solution
		console.log("No solution");
		noLoop();
		window.alert("No Valid Path found! REFRESH for new path...")
		return;
	}
	
	background(0);

	for(var i = 0; i < cols;i++)
	{
		for(var j = 0; j < rows; j++)
		{
			grid[i][j].show(color(255));
		} 
	}

	for(var i = 0; i < closedSet.length; i++)
	{
		closedSet[i].show(color(255,0,0));//Red
	}

	for(var i = 0; i < openSet.length; i++)
	{
		openSet[i].show(color(0,255,0));//Green
	}
	
	//So find the path

		path = [];
		var temp = current;
		path.push(temp);
		while(temp.previous)
		{
			path.push(temp.previous);
			temp = temp.previous;
		}
		for(var i = 0; i < path.length; i++)
		{
			path[i].show(color(255,255,0));//Yellow
		}
		noFill();
		stroke(255);
		beginShape();
		for(var i = 0; i < path.length; i++)
		{
			vertex(path[i].i*w + w/2,path[i].j*h + h/2);
			//path[i].show(color(255,255,0));//Blue	
		}
		endShape();
}