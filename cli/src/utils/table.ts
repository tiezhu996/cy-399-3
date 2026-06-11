import Table from 'cli-table3';

export function printTable(head: string[], rows: Array<Array<string | number>>): void {
  const table = new Table({ head });
  rows.forEach((row) => table.push(row));
  console.log(table.toString());
}
