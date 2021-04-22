/**
 * @Date:   2021-01-19T17:16:18+00:00
 * @Last modified time: 2021-04-22T20:00:46+01:00
 */



 //creating an infected molecule subclass
 //constructor calling attributes from the super class
 //setting colours and health
 //setting a date of birth for the molecules - this is the frame number the ball is rendered on
 //setting the life span of the molecule which is 10 seconds
class Infected extends Molecule {
constructor({_i, px, py, vx, vy}){
  super({_i, px, py,vx, vy});
  this.fillColor = color(255,0,0);
  this.intersectingColor =  color(156, 0, 0);
  this.Birthdate = (frameCount);
  this.life = 1000;
  this.state = "Infected";
}

}
