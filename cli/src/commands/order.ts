import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ORDER_STATUS } from '../constants/enums.js';
import { Order } from '../types/domain.js';
import { photoApi } from '../api/photoApi.js';
import { printTable } from '../utils/table.js';
import { printApiError } from '../utils/errors.js';

export function registerOrderCommand(program: Command): void {
  program.command('order').description('订单管理').option('--status <status>', '订单状态').action(async (options) => {
    try {
      const orders: Order[] = await photoApi.listOrders(options.status);
      printTable(['ID', '客户', '日期', '类型', '状态', '金额'], orders.map((item) => [item.id, item.customerName, item.date, item.shootType, item.status, item.amount]));
      const answer = await inquirer.prompt<{ complete: boolean; id: number }>([{ type: 'confirm', name: 'complete', message: '是否标记订单完成？' }, { type: 'number', name: 'id', message: '订单 ID', when: (a: { complete?: boolean }) => a.complete }]);
      if (answer.complete) await photoApi.completeOrder(answer.id);
      console.log(chalk.green(`可筛选状态：${ORDER_STATUS.join(', ')}`));
    } catch (error) { printApiError(error); }
  });
}
