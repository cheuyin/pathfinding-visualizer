export let totalGridCellRenders = 0;

export function incrementGridCellRenders() {
  totalGridCellRenders++;
}

export function logTotalGridCellRenders() {
  console.log(`Total GridCell renders: ${totalGridCellRenders}`);
  return totalGridCellRenders;
}

export function resetTotalGridCellRenders() {
  totalGridCellRenders = 0;
}
