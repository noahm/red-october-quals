type ClassName = string | Record<string, boolean | undefined>;

export function cn(...classnames: ClassName[]) {
  let ret: string[] = [];
  for (const item of classnames) {
    if (typeof item === "string") {
      ret.push(item);
    } else {
      for (const [classname, active] of Object.entries(item)) {
        if (active) {
          ret.push(classname);
        }
      }
    }
  }
  return ret.join(" ");
}

export function* mapIter<T, R>(cb: (item: T) => R, iter: Iterable<T>) {
  for (const item of iter) {
    yield cb(item);
  }
}

export function* filterIter<T>(cb: (item: T) => boolean, iter: Iterable<T>) {
  for (const item of iter) {
    if (cb(item)) {
      yield item;
    }
  }
}

export function* mergeIter<T>(
  cb: (a: T, b: T) => number,
  aIn: Iterable<T>,
  bIn: Iterable<T>,
) {
  let aIter = aIn[Symbol.iterator]();
  let bIter = bIn[Symbol.iterator]();
  let a = aIter.next();
  let b = bIter.next();
  while (!(a.done && b.done)) {
    let order: number;
    if (a.done) {
      order = -1;
    } else if (b.done) {
      order = 1;
    } else {
      order = cb(a.value, b.value);
    }

    let item: T;
    if (order < 0) {
      item = b.value;
      b = bIter.next();
    } else {
      item = a.value;
      a = aIter.next();
    }
    yield item;
  }
}
