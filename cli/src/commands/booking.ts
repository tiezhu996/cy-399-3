import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { Booking } from '../types/domain.js';
import { photoApi } from '../api/photoApi.js';
import { printTable } from '../utils/table.js';
import { printApiError } from '../utils/errors.js';

export function registerBookingCommand(program: Command): void {
  program.command('booking').description('查看预约请求').action(async () => {
    try {
      const bookings: Booking[] = await photoApi.listBookings();
      printTable(['ID', '客户', '日期', '类型', '备注'], bookings.map((item) => [item.id, item.customerName, item.date, item.shootType, item.note]));
      const answer = await inquirer.prompt<{ operate: boolean; id: number; action: 'confirm' | 'reject' }>([{ type: 'confirm', name: 'operate', message: '是否处理预约？' }, { type: 'number', name: 'id', message: '预约 ID', when: (a: { operate?: boolean }) => a.operate }, { type: 'list', name: 'action', message: '操作', choices: ['confirm', 'reject'], when: (a: { operate?: boolean }) => a.operate }]);
      if (answer.operate) await photoApi.updateBooking(answer.id, answer.action);
      console.log(chalk.green('预约处理完成。'));
    } catch (error) { printApiError(error); }
  });
}
