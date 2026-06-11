import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { SHOOT_TYPES, TIME_SLOTS } from '../constants/enums.js';
import { photoApi } from '../api/photoApi.js';
import { printApiError } from '../utils/errors.js';

export function registerScheduleCommand(program: Command): void {
  program.command('schedule').description('批量发布约拍档期').action(async () => {
    try {
      const answer = await inquirer.prompt([
        { type: 'input', name: 'dates', message: '可约日期，逗号分隔，例如 2026-06-10,2026-06-11' },
        { type: 'list', name: 'slot', message: '时段', choices: TIME_SLOTS },
        { type: 'list', name: 'shootType', message: '拍摄类型', choices: SHOOT_TYPES },
        { type: 'number', name: 'price', message: '价格' },
        { type: 'input', name: 'city', message: '服务城市' },
      ]);
      const payload = { ...answer, dates: String(answer.dates).split(',').map((item) => item.trim()) };
      await photoApi.createSchedules(payload);
      console.log(chalk.green('档期已发布。'));
    } catch (error) { printApiError(error); }
  });
}
