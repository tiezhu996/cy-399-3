import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { photoApi } from '../api/photoApi.js';
import { printApiError } from '../utils/errors.js';

export function registerProfileCommand(program: Command): void {
  program.command('profile').description('个人资料管理').action(async () => {
    try {
      const answer = await inquirer.prompt([
        { type: 'input', name: 'bio', message: '摄影师简介' },
        { type: 'input', name: 'portfolioUrl', message: '作品集链接' },
        { type: 'input', name: 'priceGuide', message: '服务报价' },
        { type: 'input', name: 'styleTags', message: '擅长风格标签，逗号分隔' },
      ]);
      await photoApi.updateProfile({ ...answer, styleTags: String(answer.styleTags).split(',').map((item) => item.trim()) });
      console.log(chalk.green('个人资料已更新。'));
    } catch (error) { printApiError(error); }
  });
}
