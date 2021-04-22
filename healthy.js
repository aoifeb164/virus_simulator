/**
 * @Date:   2021-01-19T17:16:18+00:00
 * @Last modified time: 2021-04-22T15:26:50+01:00
 */



//creating a healthy molecule subclass
//constructor contains attributes from the super class
//setting colours and health
class Healthy extends Molecule {
constructor({_i,  px, py}){
  super({_i,px,py});
  this.fillColor = color(43, 43, 43);
  this.intersectingColor =  color(156, 0, 0);
  this.health = "Healthy";
}

}
