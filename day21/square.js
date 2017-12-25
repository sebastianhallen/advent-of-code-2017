require('../lib/array-extensions');
module.exports = square;

function square(data) {
  function partition() {
    const partitionSize = size() % 2 === 0 ? 2 : 3;

    return data.split('/')
      .map(row => row.split('').chunk(partitionSize))
      .chunk(partitionSize)
      .reduce((partitions, curr) => {
        const cols = curr.map(a => a.map(b => b.join('')));
        cols[0].forEach((col, colI) => {
          const sqr = [];
          for (let i = 0; i < cols.length; i++) {
            sqr.push(cols[i][colI]);
          }

          partitions.push(square(sqr.join('/')));
        });
        
        return partitions;
      }, []);
  }


  function addRight(rightSquare) {
    const left =  data.split('/');
    const right = rightSquare.data.split('/');

    const merged = left.map((row, i) => row + right[i]).join('/');
    return square(merged);
  }

  function addBelow(below) {
    return square(`${data}/${below.data}`);
  }
  
  function print() {
    data.split('/').forEach(row => console.log(row));
  }

  function size() {
    return data.split('/').length;
  }

  function enhance(rules) {    
    if (size() <= 3) {
      const matchingRules = rules.filter(r => r.isMatch(data));
      return square(matchingRules[0].output);
    }
    
    const transformed = partition().map(quadrant => {
      const matchingRules = rules.filter(r => r.isMatch(quadrant.data));
      return square(matchingRules[0].output);
    });

    const partitionSize = size() % 2 === 0 ? 2 : 3;
    const qpr = size() / partitionSize;
    
    return transformed.chunk(qpr)
      .reduce((rows, curr) => {
        const row = curr.reduce((r, quadrant) => r.addRight(quadrant));
        rows.push(row);
        return rows;
      }, [])
      .reduce((merged, curr) => merged.addBelow(curr));
  }

  return {
    size,
    print,
    enhance,
    partition,
    data,
    addBelow,
    addRight,
  }
}