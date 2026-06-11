import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { photoApi } from '../api/photoApi.js';
import { loadConfig, saveConfig } from '../utils/config.js';
import { printApiError } from '../utils/errors.js';

async function collectCredential() {
  return inquirer.prompt<{ username: string; password: string }>([
    { type: 'input', name: 'username', message: '用户名' },
    { type: 'password', name: 'password', message: '密码', mask: '*' },
  ]);
}

export function registerAuthCommands(program: Command): void {
  program.command('login').description('摄影师登录').action(async () => {
    try {
      const credential = await collectCredential();
      const data = await photoApi.login(credential.username, credential.password);
      saveConfig({ ...loadConfig(), token: data.token, user: data.user });
      console.log(chalk.green('登录成功，Token 已保存。'));
    } catch (error) { printApiError(error); }
  });
  program.command('register').description('摄影师注册').action(async () => {
    try {
      const credential = await collectCredential();
      const data = await photoApi.register(credential.username, credential.password);
      saveConfig({ ...loadConfig(), token: data.token, user: data.user });
      console.log(chalk.green('注册成功。'));
    } catch (error) { printApiError(error); }
  });
}
