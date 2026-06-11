import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { AppConfig } from '../types/domain.js';

const configPath = join(homedir(), '.photo-cli', 'config.json');
const defaultConfig: AppConfig = { apiBaseUrl: 'http://localhost:3000' };

export function loadConfig(): AppConfig {
  if (!existsSync(configPath)) return defaultConfig;
  return { ...defaultConfig, ...JSON.parse(readFileSync(configPath, 'utf-8')) };
}

export function saveConfig(config: AppConfig): void {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}
