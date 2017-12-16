Array.prototype.sum = function sum(selector, initialValue = 0) {
  const pick = selector ? selector : x => x;
  return this.reduce((result, item) => result + pick(item), initialValue);
}

Array.prototype.unique = function unique(selector) {
  const pick = selector ? selector : x => x;

  const keys = this.map(item => pick(item));
  return this.filter((value, index) => keys.indexOf(pick(value)) === index);
}

Array.prototype.last = function last() {
  if (this.length === 0) {
    throw new Error('no items in array');
  }
  return this[this.length - 1];
}

Array.prototype.groupBy = function groupBy(selector) {
  if (!selector) {
    throw new Error('no group by selector.');
  }

  return this.reduce((result, curr) => {
    const key = selector(curr);
    if (typeof key !== 'string') {
      throw new Error(`group by key must be a string -- '${JSON.stringify(key)}' (${typeof key}) will not work...`);
    }
    if (result[key]) {
      result[key].push(curr);
    } else {
      result[key] = [curr];
    }

    return result;
  }, {});
}

Array.prototype.circularSlice = function circularSlice(from, to) {
  const adjustedFrom = from >= this.length ? from % this.length : from;
  const adjustedTo = to >= this.length ? to % this.length : to;

  if (adjustedTo >= adjustedFrom) {
    console.log(adjustedTo, adjustedFrom);
    return this.slice(adjustedFrom, adjustedTo);
  }

  return this.slice(adjustedFrom).concat(this.slice(0, adjustedTo + 1));
}