type Argument = `$${string}`;

type Prop<U extends boolean = true> = (U extends true ? Argument | number : number) | Operator;

type OperatorBase<N extends string, U extends boolean = true> = {
  name: N;
  left: Prop<U>;
  right: Prop<U>;
};

type AddOperator<U extends boolean = true> = OperatorBase<"add", U>;

type SubOperator<U extends boolean = true> = OperatorBase<"sub", U>;

type MulOperator<U extends boolean = true> = OperatorBase<"mul", U>;

type DivOperator<U extends boolean = true> = OperatorBase<"div", U>;

type PowOperator<U extends boolean = true> = OperatorBase<"pow", U>;

type ModOperator<U extends boolean = true> = OperatorBase<"mod", U>;

type Operator<U extends boolean = true> =
  | AddOperator<U>
  | SubOperator<U>
  | MulOperator<U>
  | DivOperator<U>
  | PowOperator<U>
  | ModOperator<U>;

type FormulaFunction = (left: number, right: number) => number;
