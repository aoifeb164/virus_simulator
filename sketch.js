/**
 * @Date:   2021-01-19T17:18:38+00:00
 * @Last modified time: 2021-04-21T10:13:21+01:00
 */


//creating variables - creating empty molecules and grid arrays and colWidth and rowHeight
let molecules = [];
let grid = [];
let graphArray = [];

let graphHeight = 100;
let colWidth, rowHeight;
let percentOfInfected = .4;

//used to initialize enviornment properties - runs when program starts
//sets canvas size, rowHeight and colWidth
//calls gridify and checkLoop functions
function setup() {
  createCanvas(800, 800);
  colWidth = width / obj.numCols;
  rowHeight = height / obj.numRows;
  //creates new molecule object starting from 0
  molecules = [];
  for (let i = 0; i < obj.numOfMolecules; i++) {
    let randomNum = random();
    if (randomNum < percentOfInfected) {
      molecules.push(new Infected({
        _i: i
      }));

    } else {
      molecules.push(new Healthy({
        _i: i
      }));
    }

  }

  gridify();
  checkLoop();
}

//always called after setup - continuously executes what is inside the function until the program ends
//sets background colour to white
function draw() {
  background(255);

  //forEach loop for molecules array that runs the molecule reset function
  molecules.forEach((molecule) => {
    molecule.reset();
  });

  recovery();
  drawGraph();

  //runs checkIntersections or splitObjectIntoGrid
  splitObjectIntoGrid();
  drawGrid();
  //checkIntersectionsOld();
  //checking if gridtstate is on or off
  obj.gridState ? drawGrid() : null;

  //runs the render and step functions for each molecule
  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();
  });

  console.log(frameCount);
}

//checking when the molecules are intersecting
//runs a nested for loop itterating through the molecules array - this ensures the molecules do not check themselves for intersection
function checkIntersectionsOld() {
  //console.time("old method")
  for (let a = 0; a < molecules.length; a++) {
    for (let b = a + 1; b < molecules.length; b++) {
      let moleculeA = molecules[a];
      let moleculeB = molecules[b];
      //if statemnt - if the line state is turned on draw the line between the molecules based on their positions with a stroke colour of grey
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
      };
      // if molecule a intersects molecule b change colour if not do nothing
      moleculeA.isIntersecting(moleculeB) ? (moleculeA.changeColor(), moleculeB.changeColor()) : null;
    }
  }
  //console.timeEnd("old method")
}

//checking when the molecules are intersecting passing _collection as parameter
//runs a nested for loop itterating through the molecules array - this ensures the molecules do not check themselves for intersection
function checkIntersections(_collection) {

  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let moleculeA = molecules[_collection[a]];
      let moleculeB = molecules[_collection[b]];
      //if statemnt - if the line state is turned on draw the line between the molecules based on their positions with a stroke colour of grey
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
      }; // if molecule a intersects molecule b change colour
      moleculeA.isIntersecting(moleculeB) ? (moleculeA.changeColor(), moleculeB.changeColor(), moleculeA.dedock(moleculeB)) : null;
      if (moleculeA.isIntersecting(moleculeB)) {
        if (moleculeA.constructor.name === "Infected" && moleculeB.constructor.name === "Healthy") {
          let randomOdds = random(1);
          //50% chance of infection
          if (randomOdds < 0.5) {
            //takes info from ballB
            let tempObject = {
              _i: moleculeB.index,
              px: moleculeB.position.x,
              py: moleculeB.position.y
            }
            //replace ballB with infected ball
            molecules.splice(tempObject._i, 1, new Infected(tempObject));
          }
        } else {
          if (moleculeB.constructor.name === "Infected" && moleculeA.constructor.name === "Healthy") {
            let randomOdds = random(1);
            //50% chance of infection
            if (randomOdds < 0.1) {
              //takes info from ballB
              let tempObject = {
                _i: moleculeA.index,
                px: moleculeA.position.x,
                py: moleculeA.position.y
              }
            }

          }
        }
      }
    }
  }

}

//populates array of molecules with their indexes
//creating new array which only contains molecules' index
//runs nested for loop that goes through rows and cols
function splitObjectIntoGrid() {
  //console.time("new method")
  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {
      //assigning moleculeCollection as new array from molecules - each molecule inside array we check their x & y position based on rowheight and col colWidth
      let moleculeCollection = molecules.filter(molecule =>
        molecule.position.x > (i * colWidth) &&
        molecule.position.x < ((i + 1) * colWidth) &&
        molecule.position.y > j * rowHeight &&
        molecule.position.y < (j + 1) * rowHeight
        //mapping array indexes
      ).map(molecule => molecule.index);
      //calling checkIntersections function and passing in new array
      checkIntersections(moleculeCollection);
    }
  }
  //console.timeEnd("new method")
}

//ensures the molecules are spaced out evenly across the gird when the program starts or is refreshed -- called in setup function
//assigning numDivision to square root of molecules that is rounded up
function gridify() {
  let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
  let spacing = (width) / numDivision

  //setting x & y pos for each molecule in the array based on their col and row pos
  molecules.forEach((molecule, index) => {
    //assigning col pos to modulus of index by numDivsion and multiplied by spacing
    //assigned row pos to index divided by numDivision and rounded down then multiplied by spacing
    let colPos = (index % numDivision) * spacing;
    let rowPos = floor(index / numDivision) * spacing;
    //console.log(`The col pos ${colPos} and the row pos ${rowPos}`);
    //assigning molecule pos x to col pos plus 20
    //assigning molecule pos y to row pos plus 20
    molecule.position.x = colPos + (obj.maxMoleculeSize * 2);
    molecule.position.y = rowPos + (obj.maxMoleculeSize * 2);

  });
}

function drawGraph() {

  let numInfected = molecules.filter(molecule => molecule.constructor.name == "Infected")
  let numHealthy = molecules.filter(molecule => molecule.constructor.name == "Healthy")
  let numRecovered = molecules.filter(molecule => molecule.constructor.name == "Recovered")

  iHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, graphHeight);
  hHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, graphHeight);
  rHeight = map(numRecovered.length, 0, obj.numOfMolecules, 0, graphHeight);

  if (graphArray.length >= 300) {
    graphArray.shift();
  }

  graphArray.push({
    numInfected: numInfected.length,
    numHealthy: numHealthy.length,
    numRecovered: numRecovered.length,
    iHeight: iHeight,
    hHeight: hHeight,
    rHeight: rHeight
  })
  //console.log(graphArray);

  push();
  translate(300, 800);
  graphArray.forEach(function(data, index) {

    noStroke();
    fill(255, 0, 0)
    rect(index, 0, 1, -data.iHeight)

    fill(0, 255, 0);
    rect(index, -data.iHeight, 1, -data.hHeight)

    fill(237, 211, 40);
    rect(index, -data.iHeight, -data.hHeight, -data.rHeight)
  })
  pop();
}

function recovery(){
  molecules.forEach((molecule) => {
    if (frameCount > molecule.Birthdate + molecule.life){
      let tempObject = {
        _i: molecule.index,
        px: molecule.position.x,
        py: molecule.position.y
      }
      //replace ballB with infected ball
      molecules.splice(tempObject._i, 1, new Recovered(tempObject));
    }
  });
}


// The function drawGrid draws a grid using a nested loop iterating columns(i)
// within rows(j). colWidth and rowWidth are calculated in the setup(). The style
// of grid is defined by fill, stroke and strokeWeight. There
// are no parameters required to fulfil the function and no returns

function drawGrid() {
  noFill();
  stroke(155, 155, 155, 50);
  strokeWeight(1);

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {
      //
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
    }
  }
}

//checks if the loop is on or off in gui - if on run loop if not don't run loop
function checkLoop() {
  if (obj.loopState) {
    loop();
  } else {
    noLoop();
  }
}
