import { Command } from 'commander';
import { photoApi } from '../api/photoApi.js';
import { printTable } from '../utils/table.js';
import { printApiError } from '../utils/errors.js';

export function registerStatsCommand(program: Command): void {
  program.command('stats').description('收入统计').option('--year <year>').option('--month <month>').action(async (options) => {
    try {
      const data = await photoApi.stats({ year: options.year ? Number(options.year) : undefined, month: options.month ? Number(options.month) : undefined });
      printTable(['拍摄类型', '订单数', '收入'], data.byType.map((item: any) => [item.shootType, item.count, item.amount]));
      printTable(['周期', '总收入'], [[data.period, data.totalAmount]]);
    } catch (error) { printApiError(error); }
  });
}
