/**
 * @Date:   2021-01-19T17:15:34+00:00
 * @Last modified time: 2021-04-21T09:32:42+01:00
 */

//setting the variables that we can configure
let obj = {
    numOfMolecules:20
    , numRows: 2
    , numCols: 2
    , showText: false
    , loopState: true
    , gridState: true
    , lineState: true
    , moleculeColor: [255, 0, 0]
    , intersectingColor: [0, 255, 0]
    , minMoleculeSize: 20
    , maxMoleculeSize: 20
};

//creating new gui called gui
var gui = new dat.gui.GUI();

gui.remember(obj);

//creating new gui folder called Layout
//this allows you to change the number of molecules, rows, cols and show text, grid, line and turn on loop
section01 = gui.addFolder('Layout');
section01.add(obj, 'numOfMolecules').min(0).max(1000).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'numRows').min(1).max(20).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'numCols').min(1).max(20).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'showText').onChange(function () {
    draw()
});
section01.add(obj, 'loopState').onChange(function () {
    checkLoop()
});
section01.add(obj, 'gridState').onChange(function () {
    draw()
});
section01.add(obj, 'lineState').onChange(function () {
    draw()
});

//creating new gui folder called Design
//this allows you to change the colour of molecules originally or when they intersect and molecule size
section02 = gui.addFolder('Design');
// section02.addColor(obj, 'moleculeColor').onChange(function () {
//     draw()
// });
// section02.addColor(obj, 'intersectingColor').onChange(function () {
//     draw()
// });
section02.add(obj, 'minMoleculeSize').min(1).max(50).step(1).onChange(function () {
    setup();
    draw()
});
section02.add(obj, 'maxMoleculeSize').min(1).max(50).step(1).onChange(function () {
    setup();
    draw()
});
