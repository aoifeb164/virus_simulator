/**
 * @Date:   2021-01-19T17:16:18+00:00
 * @Last modified time: 2021-04-20T11:45:12+01:00
 */



//creating ball object
class Infected extends Molecule {
constructor({_i, px, py}){
  super({_i,px,py});
  this.fillColor = color(255,0,0);
  this.intersectingColor =  color(100,0,0);
  this.Birthdate = (frameCount);
  this.life = 1000;
}

}