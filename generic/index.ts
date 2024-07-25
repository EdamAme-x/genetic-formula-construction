const formulaFunctions = {
  add: (left: number, right: number) => left + right,
  sub: (left: number, right: number) => left - right,
  mul: (left: number, right: number) => left * right,
  div: (left: number, right: number) => left / right,
  pow: (left: number, right: number) => Math.pow(left, right),
  mod: (left: number, right: number) => left % right,
} as const satisfies Record<Operator["name"], FormulaFunction>;

export function getFormulaFunction(operator: Operator): FormulaFunction {
  return formulaFunctions[operator.name];
}

export function createOperator(
  name: Operator["name"],
  left: Operator["left"],
  right: Operator["right"],
): Operator {
  return { name, left, right };
}

export type Generic = Operator;

function generateRandomNumber(size: number): number {
  return (Math.random() - 0.5) * 10 ** (Math.floor(Math.random() * size));
}

export function createRandomGeneric(vars: string[] = [], hev = 0.5, size = 5): Generic {
  const nameList = Object.keys(formulaFunctions) as Operator["name"][];
  const name =
    nameList[Math.floor(Math.random() * nameList.length)] as Operator["name"];

  const createVariable = () =>
    `$${vars[Math.floor(Math.random() * vars.length)]}` as const;

  const left = Math.random() < hev
    ? createRandomGeneric(vars, hev / 2)
    : vars.length !== 0 && Math.random() < hev
    ? createVariable()
    : generateRandomNumber(size);
  const right = Math.random() < hev
    ? createRandomGeneric(vars, hev / 2)
    : vars.length !== 0 && Math.random() < hev
    ? createVariable()
    : generateRandomNumber(size);

  return createOperator(name, left, right);
}

export function calculate(generic: Generic, vars: [string, number][] = []): number {
    const calc = getFormulaFunction(generic);

    const left = typeof generic.left === "number"
      ? generic.left
      : typeof generic.left === "object"
      ? calculate(generic.left, vars)
      : vars.find((v) => v[0] === generic.left)?.[1] ?? 0;

    const right = typeof generic.right === "number"
      ? generic.right
      : typeof generic.right === "object"
      ? calculate(generic.right, vars)
      : vars.find((v) => v[0] === generic.right)?.[1] ?? 0;

    return calc(left, right);
}

function getAllPaths(obj: Generic, currentPath = ""): string[] {
  let paths: string[] = [];
  for (const key in obj) {
    if (key === "left" || key === "right") continue;
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    if (typeof obj[key as keyof Generic] === "object" && obj[key as keyof Generic] !== null) {
      // @ts-expect-error NOT TYPED WELL
      paths = paths.concat(getAllPaths(obj[key], newPath));
    } else {
      paths.push(newPath);
    }
  }
  return paths;
}

function getValueByPath(obj: Generic, path: string): Prop {
  // @ts-expect-error NOT TYPED WELL
  return path.split(".").reduce((o, p) => o && o[p], obj);
}

function setValueByPath(obj: Generic, path: string, value: Prop): void {
  const keys = path.split(".");
  const lastKey = keys.pop();
  // @ts-expect-error NOT TYPED WELL
  const target = keys.reduce((o, p) => o[p], obj);
  target[lastKey as ("left" | "right")] = value;
}

function pickRandomGeneric(obj: Generic): [Prop, string] {
  const paths = getAllPaths(obj);
  const randomPath = paths[Math.floor(Math.random() * paths.length)];
  const value = getValueByPath(obj, randomPath);
  return [value, randomPath];
}

export function crossOver(
  generic1: Generic,
  generic2: Generic
): [Generic, Generic] {
  const pickedGenericFrom1 = pickRandomGeneric(generic1);
  const pickedGenericFrom2 = pickRandomGeneric(generic2);

  const [prop1, path1] = pickedGenericFrom1;
  const [prop2, path2] = pickedGenericFrom2;

  setValueByPath(generic1, path1, prop2);
  setValueByPath(generic2, path2, prop1);

  return [generic1, generic2];
}
