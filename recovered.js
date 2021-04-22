/**
 * @Date:   2021-01-19T17:16:18+00:00
 * @Last modified time: 2021-04-22T15:26:35+01:00
 */



 //creating a recovered molecule subclass
 //constructor contains attribute sfrom the super class
 //setting colours and health
class Recovered extends Molecule {
constructor({_i, px, py}){
  super({_i,px,py});
  this.fillColor = color(184, 184, 184);
  this.intersectingColor =  color(156, 0, 0);
  this.health = "Recovered";
}

}
