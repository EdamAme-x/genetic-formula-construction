import { Cell } from "./cell/index.ts";
import { Generic, calculate, createRandomGeneric, crossOver } from "./generic/index.ts";
import { green, blue } from "@ryu/enogu";

const config = {
  // evaluate function
  evaluate: (generic: Generic) => Math.abs(calculate(generic) - 5),
  // evaluate evaluation function
  evaluateEvaluation: (number: number) => -Math.abs(number),
  // createRandomGeneric function
  createRandomGeneric: () => createRandomGeneric([], 0.5, 5),
  // number of individuals
  individuals: 25,
  // maxGenerations
  maxGenerations: 500,
  // mutation rate
  mutationRate: 0.2,
  // power of crossOver
  crossOverPower: 10,
  // power of best,
  bestPower: 2,
};

let beforeGeneration: Cell[] = [];

const createMutationCell = () => new Cell(config.createRandomGeneric());

for (let i = 0; i < config.maxGenerations; i++) {
    console.log(`Generation: ${green((i + 1).toString())}`);

    const cells = beforeGeneration.length === 0 ? Array.from({ length: config.individuals })
        .map(() => createMutationCell()) : beforeGeneration

    if (cells.length < config.individuals) {
        while (cells.length < config.individuals) {
            cells.push(createMutationCell());
        }
    }

    const aliveCells = cells.filter((cell) => cell.evaluate(config.evaluate) === "alive");

    const evaluations = aliveCells
        .map((cell) => config.evaluateEvaluation(cell.evaluation));

    const sortedAliveCells = aliveCells
        .map((cell, index) => ({ cell, evaluation: evaluations[index] }))
        .sort((a, b) => b.evaluation - a.evaluation);

    console.log(`Alive Cells: ${blue(sortedAliveCells.length.toString())}`);

    if (sortedAliveCells.length === 0) {
        console.log("No alive cells, will exit");
        break
    }

    const bestCell = sortedAliveCells[0].cell || createMutationCell();
    sortedAliveCells.shift()
    sortedAliveCells.pop()
    
    beforeGeneration = [
      ...Array.from({ length: config.bestPower }).map(() => bestCell),
      ...sortedAliveCells.slice(0, config.individuals - (config.bestPower + 1)).map((cell) => cell.cell),
      Math.random() < config.mutationRate
        ? createMutationCell()
        : sortedAliveCells[sortedAliveCells.length - 1] ? sortedAliveCells[sortedAliveCells.length - 1].cell :
          createMutationCell(),
    ];

    for (let j = 0; j < config.crossOverPower; j++) {
        const pick1 = beforeGeneration[Math.floor(Math.random() * beforeGeneration.length)];
        const pick2 = beforeGeneration[Math.floor(Math.random() * beforeGeneration.length)];

        const crossoveredGeneric = crossOver(pick1.generic, pick2.generic);

        pick1.generic = crossoveredGeneric[0];
        pick2.generic = crossoveredGeneric[1];
    }
}

console.log(`
[Result]

Evaluation: ${config.evaluateEvaluation(calculate(beforeGeneration[0].generic))}

Generic: ${JSON.stringify(beforeGeneration[0].generic)}`);