/**
 * @Date:   2021-01-19T17:16:18+00:00
 * @Last modified time: 2021-04-21T19:54:45+01:00
 */



//creating superclass molecule object
class Molecule {

  //setting initial values for object attributes
  //setting position, speed, molecule size and colour of the molecule - these properties can be edited in gui
  constructor({
    _i,
    px = random(0, width),
    py = random(0, width)
  }) {
    this.position = createVector(px, py);
    this.velocity = createVector(random(-2.5, 2.5), random(-2.5, 2.5));
    this.radius = random(obj.minMoleculeSize, obj.maxMoleculeSize);
    this.fillColor = color(255, 0, 0);
    this.intersectingColor = color(155, 155, 155);
    this.currentColor = this.fillColor;
    // this.intersectingColor = color(100,0,0);
    this.index = _i;
  }

  //creating visual properties
  //setting no stroke colour, molecule fill colour, molecule shape and text position and size - these properties can be edited in gui
  render() {
    noStroke()
    fill(this.currentColor);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    fill(0);
    (obj.showText) ? (
      textSize(10),
      textAlign(CENTER),
      fill(255,255,255),
      text(this.index, this.position.x, this.position.y),
      fill(255,255,255),
      text(this.constructor.name, this.position.x, this.position.y + 10 )) : null;

  }

  //checking molecule intersection
  //assigning distance as distance of molecules x and y position
  //assigning gap as distance minus radius
  //assigning check to gap less than or equal to 0  and if its true or false
  isIntersecting(_molecule) {
    let resultantV = p5.Vector.sub(this.position, _molecule.position);
    // let distance = dist(this.position.x, this.position.y, _molecule.position.x, _molecule.position.y)
    let distance = resultantV.mag();
    let gap = distance - this.radius - _molecule.radius;
    let check = (gap <= 0) ? true : false;

    //change in x and y
    //difference in positions and square root
    //pythagerous distance between balls
    //let dist = dist(this.position.x, this.position.y, molecules[_molecule].position.x, molecules[_molecule].position.y)

    if (check) {

      let dx = this.position.x - _molecule.position.x;
      let dy = this.position.y - _molecule.position.y;
      // let dist = Math.sqrt(dx * dx + dy * dy);

      //
      let normalX = dx / distance;
      let normalY = dy / distance;


      //collision detection
      let midpointX = (this.position.x + _molecule.position.x) / 2;
      let midpointY = (this.position.y + _molecule.position.y) / 2;


      //calc difference in x velocity and multiply by normal
      let dVector = (this.velocity.x - _molecule.velocity.x) * normalX;
      dVector += (this.velocity.y - _molecule.velocity.y) * normalY;



      let dvx = dVector * normalX;
      let dvy = dVector * normalY;


      this.velocity.x -= dvx;
      this.velocity.y -= dvy;


      let indexValue = _molecule.index;

      molecules[indexValue].velocity.x += dvx;
      molecules[indexValue].velocity.y += dvy;

    }
    return check;
  }

  dedock(_otherMolecule) {
    //This is the ball we want to move (latest in Array)
    // This is where we want to dock it to
    let fixedBall = molecules[_otherMolecule.index];

    //creates new vector called resultantV
    //based on differences between ball points
    let resultantV = p5.Vector.sub(this.position, fixedBall.position)
    //angle pointing at (direction)
    let rHeading = resultantV.heading();
    //distance between mag(length) and radius of balls
    let rDist = (resultantV.mag() - this.radius - fixedBall.radius) / 2;
    //here we take away calculated distance from current pos
    let moveX = cos(rHeading) * rDist;
    let moveY = sin(rHeading) * rDist;

    this.position.x -= moveX;
    this.position.y -= moveY;

    molecules[_otherMolecule.index].position.x += moveX;
    molecules[_otherMolecule.index].position.y += moveY;

  }

  //change colour when the molecules overlap to the colour set in gui
  changeColor() {
    this.currentColor = this.intersectingColor;
  }

  //reseting molecule colour back to original when they no longer overlap
  reset() {
    this.currentColor = this.fillColor;
  }

  //creating movement of the molecules
  step() {

    (this.position.x >= width - this.radius || this.position.x <= 0 + this.radius) ?
    this.velocity.x *= -1: null;

   //minus 160 so the balls dont overlap the graph
    (this.position.y >= height - this.radius - 160 || this.position.y <= 0 + this.radius) ?
    this.velocity.y *= -1: null;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
