import { Command } from 'commander';
import chalk from 'chalk';
import { Booking, Order, OrderStatus } from '../types/domain.js';
import { photoApi } from '../api/photoApi.js';
import { printTable } from '../utils/table.js';
import { printApiError } from '../utils/errors.js';

function pad(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getThisMonthPrefix(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function registerOverviewCommand(program: Command): void {
  program
    .command('overview')
    .description('开工概览：今日待确认预约、本月已确认收入、待完成订单')
    .action(async () => {
      try {
        const today = getTodayStr();
        const thisMonthPrefix = getThisMonthPrefix();

        const [bookings, orders]: [Booking[], Order[]] = await Promise.all([
          photoApi.listBookings(),
          photoApi.listOrders(),
        ]);

        const todayPendingBookings = bookings.filter((b) => b.date === today).length;

        const pendingStatuses: OrderStatus[] = ['pending', 'confirmed', 'shooting'];
        const pendingOrders = orders.filter((o) => pendingStatuses.includes(o.status)).length;

        const confirmedOrdersThisMonth = orders.filter(
          (o) => o.status === 'confirmed' && o.date.startsWith(thisMonthPrefix),
        );
        const confirmedAmountThisMonth = confirmedOrdersThisMonth.reduce(
          (sum, o) => sum + Number(o.amount),
          0,
        );

        console.log(chalk.bold(`\n📸 开工概览  ${today}\n`));

        printTable(
          ['指标', '数值', '类型', '说明'],
          [
            [
              '今日待确认预约',
              todayPendingBookings,
              '预约数',
              todayPendingBookings > 0 ? '请尽快联系客户确认' : '今日暂无待确认预约',
            ],
            [
              '本月已确认订单总额',
              `¥${confirmedAmountThisMonth.toFixed(2)}`,
              '金额',
              `共 ${confirmedOrdersThisMonth.length} 单已确认订单`,
            ],
            [
              '待完成订单',
              pendingOrders,
              '订单数',
              pendingOrders > 0 ? '含待确认/已确认/拍摄中状态' : '暂无待完成订单，太棒了！',
            ],
          ],
        );

        const todayBookings = bookings.filter((b) => b.date === today);
        if (todayBookings.length > 0) {
          console.log(chalk.cyan('\n今日预约明细：'));
          printTable(
            ['ID', '客户', '日期', '类型', '备注'],
            todayBookings.map((item) => [
              item.id,
              item.customerName,
              item.date,
              item.shootType,
              item.note,
            ]),
          );
        }

        const pendingOrdersList = orders.filter((o) => pendingStatuses.includes(o.status));
        if (pendingOrdersList.length > 0) {
          console.log(chalk.cyan('\n待完成订单明细（前10条）：'));
          printTable(
            ['ID', '客户', '日期', '类型', '状态', '金额'],
            pendingOrdersList.slice(0, 10).map((item) => [
              item.id,
              item.customerName,
              item.date,
              item.shootType,
              item.status,
              `¥${Number(item.amount).toFixed(2)}`,
            ]),
          );
          if (pendingOrdersList.length > 10) {
            console.log(chalk.gray(`  ... 另有 ${pendingOrdersList.length - 10} 条待完成订单\n`));
          }
        }

        if (confirmedOrdersThisMonth.length > 0) {
          console.log(chalk.cyan('\n本月已确认订单类型分布：'));
          const byType = new Map<string, { count: number; amount: number }>();
          confirmedOrdersThisMonth.forEach((o) => {
            const existing = byType.get(o.shootType) ?? { count: 0, amount: 0 };
            byType.set(o.shootType, {
              count: existing.count + 1,
              amount: existing.amount + Number(o.amount),
            });
          });
          printTable(
            ['拍摄类型', '订单数', '金额', '占比'],
            Array.from(byType.entries()).map(([type, info]) => {
              const ratio = confirmedAmountThisMonth > 0 ? ((info.amount / confirmedAmountThisMonth) * 100).toFixed(1) + '%' : '-';
              return [type, info.count, `¥${info.amount.toFixed(2)}`, ratio];
            }),
          );
        }
      } catch (error) {
        printApiError(error);
      }
    });
}
