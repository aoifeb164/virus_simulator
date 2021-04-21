/**
 * @Date:   2021-01-19T17:16:18+00:00
 * @Last modified time: 2021-04-21T19:58:47+01:00
 */



//creating ball object
class Healthy extends Molecule {
constructor({_i,  px, py}){
  super({_i,px,py});
  this.fillColor = color(43, 43, 43);
  this.intersectingColor =  color(0,100,0);
  this.health = "Healthy";
}

}
