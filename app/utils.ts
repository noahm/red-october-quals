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
