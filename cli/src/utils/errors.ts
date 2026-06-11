import chalk from 'chalk';

export function printApiError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`操作失败：${message}`));
}
