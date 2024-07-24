import { Generic } from "../generic/index.ts";

export class Cell {
  evaluation: number = 0;

  constructor(
    public generic: Generic,
  ) {}

  public evaluate(evaluator: (generic: Generic) => number) {
    this.evaluation = evaluator(this.generic);
    if (isNaN(this.evaluation)) {
        return "death"
    }else {
        return "alive"
    }
  }

  public clone(): Cell {
    return new Cell(this.generic);
  }
}
