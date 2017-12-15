Array.prototype.sum = function sum(selector, initialValue = 0) {
  const pick = selector ? selector : x => x;
  return this.reduce((result, item) => result + pick(item), initialValue);
}

Array.prototype.any = function any(predicate) {
  if (!predicate) {
    throw new Error('must provide a predicate to any()');
  }

  return this.reduce((result, item) => {
    if (result) {
      return result;
    }

    return predicate(item);
  }, false);
}

Array.prototype.unique = function unique(predicate) {
  const _predicate = predicate ? predicate : (value, index, array) => array.indexOf(value) === index;

  return [...new Set(this.filter((value, index, array) => _predicate(value, index, array)))];
}

Array.prototype.last = function last() {
  if (this.length === 0) {
    throw new Error('no items in array');
  }
  return this[this.length - 1];
}