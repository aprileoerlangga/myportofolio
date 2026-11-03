const { RoundedBoxGeometry } = require('three-stdlib');
const geom = new RoundedBoxGeometry(1.6, 0.96, 1.6, 3, 0.06);
console.log('Created geom:', geom.type, 'vertex count:', geom.attributes.position.count);

