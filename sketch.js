/**
 * @Date:   2021-01-19T17:18:38+00:00
 * @Last modified time: 2021-04-22T20:19:56+01:00
 */

// ##CA2 VIRUS SIMULATOR
// - For CA2 I have created a simulator that represents the effect of covid-19 in the Dundalk - Carlingford area.
//
// - Coronavirus disease (COVID-19) is an infectious disease caused by a newly discovered coronavirus.
// - Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.
//
// - The subject area currently has 18 confirmed cases with a total population of 25,599.
// - This means that 1 in 1422 are infected.
// - Loading 55 molecules on my canvas means roughly 28 of the rendered molecules will be infected.
// - This means the percent of infection is roughly 50%.
//
// - The chance of catching the virus if exposed is 2.6%.
//
// - When the program begins 55 molecules will be rendered on the canvas, 50% of these will be infected.
// - As the molecules move around the screen they will bounce off eachother.
// - If an infected molecule intersects with a healthy molecule there is a 2.6% chance of the molecule becoming ill.
// - Each infected molecule is given a date of birth and a life span.
// - The date of birth of a molecule is the frame number they have been created on.
// - The life span of the molecule is the amount of frames the molecule will live for.
// - Once the life of the infected molecule ends the become recovered and can no longer infect other molecules.
// - The text and graph on the canvas display a live count of the different molecule types.

//creating variables
//setting percent of infected molecules - this sets the amount of infected balls to rendered when starting the program
let molecules = [];
let grid = [];
let graphArray = [];
let graphHeight = 150;
let colWidth, rowHeight;
let percentOfInfected = .5;
let countHealth;
let countInfected;
let countRecovered;



//used to initialize enviornment properties - runs when program starts
//sets canvas size, rowHeight and colWidth
//calls gridify and checkLoop functions
function setup() {
  createCanvas(1000, 1000);
  colWidth = width / obj.numCols;
  rowHeight = height / obj.numRows;

  //creating new molecule object starting from 0
  // pushing new infected and healthy molecules into the array
  //these molecules are rendered when the program starts
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
//running recovery, displayCounter, drawGraph, splitObjectIntoGrid and drawGrid functions
function draw() {
  background(255);
  //forEach loop for molecules array that runs the molecule reset function
  //this is used to reset the intersecting colours of the molecules
  molecules.forEach((molecule) => {
    molecule.reset();
  });

  recovery();
  splitObjectIntoGrid();
  drawGrid();
displayGraphCount();
  //checking if gridtstate is on or off - this can be changed using the gui
  obj.gridState ? drawGrid() : null;

  //runs the render and step functions for each molecule
  //this creates the visual properties of the molecule and makes the molecules move
  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();
  });
}

//checking when the molecules are intersecting passing _collection as parameter
//runs a nested for loop itterating through the molecules array - this ensures the molecules do not check themselves for intersection
function checkIntersections(_collection) {

  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let moleculeA = molecules[_collection[a]];
      let moleculeB = molecules[_collection[b]];
      //if statemnt - if the line state is turned on draw the line between the molecules based on their x & y positions with a stroke colour of grey
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
      }; // if molecule a intersects molecule b change colour
      moleculeA.isIntersecting(moleculeB) ? (moleculeA.changeColor(), moleculeB.changeColor(), moleculeA.dedock(moleculeB)) : null;
      //  if when the molecules are intersecting one is infected the chance of the healthy molecule becoming infected is 2.6%
      if (moleculeA.isIntersecting(moleculeB)) {
        if (moleculeA.constructor.name === "Infected" && moleculeB.constructor.name === "Healthy") {
          let randomOdds = random(1);
          //2.6% chance of infection
          if (randomOdds < 0.026) {
            //takes info from ballB and replacing it with infected molecule using splice
            //splice inserts an object into an existing array
            let tempObject = {
              _i: moleculeB.index,
              px: moleculeB.position.x,
              py: moleculeB.position.y
            }
            molecules.splice(tempObject._i, 1, new Infected(tempObject));
          }
        } else {
            //  if when the molecules are intersecting one is infected the chance of the healthy molecule becoming infected is 2.6%
          if (moleculeB.constructor.name === "Infected" && moleculeA.constructor.name === "Healthy") {
            let randomOdds = random(1);
            //2.6% chance of infection
            if (randomOdds < 0.026) {
                //takes info from ballB and replacing it with infected molecule using splice
                //splice inserts an object into an existing array
              let tempObject = {
                _i: moleculeA.index,
                px: moleculeA.position.x,
                py: moleculeA.position.y
              }
              molecules.splice(tempObject._i, 1, new Infected(tempObject));
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
}

//ensures the molecules are spaced out evenly across the gird when the program starts or is refreshed -- called in setup function
//assigning numDivision to square root of molecules that is rounded up
//assigning spacing to the width of the canvas divided by numDivsion
function gridify() {
  let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
  let spacingY = (width - (obj.minMoleculeSize*2)) / numDivision;
  let spacingX = (height - graphHeight - (obj.minMoleculeSize*2)) / numDivision;

  //foreach loop taking in molecules array
  //assigning col pos to modulus of index and numDivsion and multiplied by spacing
  //assigned row pos to index divided by numDivision and rounded down then multiplied by spacing
  molecules.forEach((molecule, index) => {
    let colPos = (index % numDivision) * spacingY;
    let rowPos = floor(index / numDivision) * spacingX;
    //assigning molecule pos x to col pos plus 20
    //assigning molecule pos y to row pos plus 20
    molecule.position.x = colPos + (obj.maxMoleculeSize * 2);
    molecule.position.y = rowPos + (obj.maxMoleculeSize * 2);

  });
}

// diaplying the molecule counter
// this counts the number of each molecule type currently displayed on the canvas
//drawing the graph that displays the amount of each type of molecule
function displayGraphCount() {
  {
    //for loop itterating through the numOfMolecules index
    //if the state of the molecule is healthy count the healthy molecules;
    //if the state of the molecule is infected count the infected molecules;
    //if the state of the molecule is recovered count the recovered molecules;
    for (let i = 0; i < obj.numOfMolecules; i++) {
      if (molecules[i].state == "Healthy") {
        countHealth++;
      }

      if (molecules[i].state == "Infected") {
        countInfected++;
      }

      if (molecules[i].state == "Recovered") {
        countRecovered++;
      }
    }

    //setting text size and placement
    textAlign(LEFT);
    textSize(30);
    fill(0,0,0);
    text("Healthy: " + countHealth, 30, 900)
    text("Infected: " + countInfected, 30, 950)
    text("Recovered: " + countRecovered, 30, 1000)

    //mapping the numOfMolecules to be the same number as graphHeight
    let infectedHeight = map(countInfected, 0, obj.numOfMolecules, 0, graphHeight);
    let healthHeight = map(countHealth, 0, obj.numOfMolecules, 0, graphHeight);
    let recoveredHeight = map(countRecovered, 0, obj.numOfMolecules, 0, graphHeight);

    //starting the count at 0
    countHealth = 0;
    countInfected = 0;
    countRecovered = 0;

    //setting length of graph to be 500px and allowing it to move with new data as it removes elements as it goes on
    if (graphArray.length >= 500) {
      graphArray.shift();
    }

    //pushing the counted molecules and heights into graphArray
    graphArray.push({
      countInfected: countInfected,
      countHealth: countHealth,
      countInfected: countInfected,
      infectedHeight: infectedHeight,
      healthHeight: healthHeight,
      recoveredHeight: recoveredHeight
    })
    //console.log(graphArray);

    //The push() function saves the current drawing style settings and transformations, while pop() restores these settings.
    push();
    translate(250, 1000);
    graphArray.forEach(function(data, index) {

      //drawing a rect in the graph to reflect the number of infected, healthy and recovered molecules
      //setting the colour and shape of the graph
      noStroke();
      fill(255, 0, 0)
      rect(index, 0, 1, -data.infectedHeight)

      fill(43, 43, 43);
      rect(index, -data.infectedHeight, 1, -data.healthHeight)

      fill(184, 184, 184);
      rect(index, -data.infectedHeight - data.healthHeight, 1, -data.recoveredHeight)

    })
    pop();

  }
}

//changing the infected balls to Recovered
//replacing the balls based on the time they were rendered and the frameCount
//if the frame count is more than the infected birthdate and their lifespan - create a new recovered object with the old infected molecules position and index
function recovery() {
  molecules.forEach((molecule) => {
    if (frameCount > molecule.Birthdate + molecule.life) {
      let tempObject = {
        _i: molecule.index,
        px: molecule.position.x,
        py: molecule.position.y
      }
      //replace molecule with new recovered molecule
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
      rect(i * rowHeight, j * colWidth, colWidth, rowHeight)
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
