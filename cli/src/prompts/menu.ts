import inquirer from 'inquirer';

export async function chooseMainAction() {
  const answer = await inquirer.prompt<{ action: string }>([
    { type: 'list', name: 'action', message: '请选择操作', choices: [
      { name: '登录', value: 'login' },
      { name: '注册', value: 'register' },
      { name: '发布约拍档期', value: 'schedule' },
      { name: '查看预约请求', value: 'booking' },
      { name: '订单管理', value: 'order' },
      { name: '收入统计', value: 'stats' },
      { name: '个人资料管理', value: 'profile' },
    ] },
  ]);
  return answer.action;
}
