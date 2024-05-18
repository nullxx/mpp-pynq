import { execute } from "../core";
import operations from "../traslator/operations.json";

interface FindOperationValue {
  operation: string;
  range: [number, number];
}
type ReplacementFn = (offset: number, operation: string, { memoryData }: { memoryData: number[] }) => Promise<string>;

const INM_NAME = "inm";
const DIR_NAME = "dir";
export const NO_OP_NAME = "-";
const FILL_NO_OP = true;
const replacementFunctions: ReplacementFn[] = [replaceInm, replaceDir];

let memSize: null | number = null;

export async function collectMemoryData(fromMemOffset: number, toMemOffset: number) {
  const memoryData: number[] = new Array(toMemOffset - fromMemOffset + 4).fill(0);
  for (let i = fromMemOffset; i < toMemOffset; i++) {
    memoryData[i - fromMemOffset] = await execute<number>("get_memory_value", i);
  }
  return memoryData;
}
export async function deductOperationOf(fromMemOffset: number, toMemOffset: number) {
  if (memSize == null) memSize = await execute<number>("get_memory_size");
  if (toMemOffset < fromMemOffset) {
    throw new Error("toMemOffset must be greater than fromMemOffset");
  }
  if (fromMemOffset < 0) {
    fromMemOffset = 0;
  }
  if (toMemOffset > memSize) {
    toMemOffset = memSize;
  }

  // collect all memory data
  const memoryData = await collectMemoryData(fromMemOffset, toMemOffset);

  const operations: FindOperationValue[] = [];

  let initOffset = fromMemOffset;
  do {
    // const currentMemValue = await execute<number>("get_memory_value", initOffset);
    const currentMemValue = memoryData[initOffset];
    const operation = await findOperation(initOffset, currentMemValue, { memoryData });
    if (!operation) {
      initOffset++;
      continue;
    }

    operations.push(operation);
    initOffset = operation.range[1] + 1;
  } while (operations.length === 0 || initOffset < toMemOffset);

  return operations;
}

async function findOperation(
  initOffset: number,
  memValue: number,
  { memoryData }: { memoryData: number[] }
): Promise<FindOperationValue | null> {
  const op = operations.find((o) => parseInt(o.HEX, 16) === memValue);
  if (!op && !FILL_NO_OP) return null;
  if (!op) return { operation: NO_OP_NAME, range: [initOffset, initOffset] };
  return {
    operation: await doReplacements(initOffset, op.NEMO, { memoryData}),
    range: [initOffset, initOffset + op.ALLOC - 1],
  };
}

async function doReplacements(offset: number, operation: string, { memoryData }: { memoryData: number[] }) {
  for (const fn of replacementFunctions) {
    operation = await fn(offset, operation, {memoryData});
  }
  return operation;
}

async function replaceInm(offset: number, operation: string, { memoryData }: { memoryData: number[] }) {
  return operation.replace(
    INM_NAME,
    // (await execute<number>("get_memory_value", offset + 1)).toString(16).toUpperCase()
    memoryData[offset + 1].toString(16).toUpperCase()
  );
}

async function replaceDir(offset: number, operation: string, { memoryData }: { memoryData: number[] }) {
  // const hdir = (await execute<number>("get_memory_value", offset + 1)).toString(16).toUpperCase();
  const hdir = memoryData[offset + 1].toString(16).toUpperCase();
  // const ldir = (await execute<number>("get_memory_value", offset + 2)).toString(16).toUpperCase();
  const ldir = memoryData[offset + 2].toString(16).toUpperCase();
  return operation.replace(DIR_NAME, `${hdir}${ldir}`);
}
