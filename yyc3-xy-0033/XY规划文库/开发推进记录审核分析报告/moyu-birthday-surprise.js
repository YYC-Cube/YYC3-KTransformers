#!/usr/bin/env node

// 沫语宝贝1岁生日惊喜 🎂
// Birthday Surprise for Moyu Baby

const fs = require('fs')
const path = require('path')

console.log('🎂 为沫语宝贝准备1岁生日惊喜...')

// 计算生日倒计时
const today = new Date()
const birthday = new Date('2024-12-06') // 10天后
const daysUntilBirthday = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24))

console.log(`🗓️ 距离沫语宝贝1岁生日还有: ${daysUntilBirthday} 天`)

// 创建生日主题配置
const birthdayTheme = {
  colors: ['#FFB6C1', '#FFC0CB', '#FFD700', '#87CEEB', '#98FB98'], // 粉色、金色系
  animations: ['confetti', 'balloons', 'stars', 'hearts'],
  birthdayWishes: [
    '沫语宝贝，1岁快乐！🎂',
    '愿你的每一天都充满欢笑😊',
    '健康快乐地成长！🌟',
    '爸爸妈妈永远爱你❤️'
  ],
  firstYearMoments: [
    '第一次微笑',
    '第一次叫爸爸妈妈',
    '第一次走路',
    '第一次独立站立',
    '第一次探索世界',
    '每一个珍贵的瞬间'
  ]
}

// 创建生日惊喜组件
const createBirthdayComponents = () => {
  const components = {
    // 生日倒计时组件
    birthdayCountdown: `import React, { useState, useEffect } from 'react';
import { Card, Button } from '../ui';

export const BirthdayCountdown = () => {
  const [daysLeft, setDaysLeft] = useState(${daysUntilBirthday});
  const [showSurprise, setShowSurprise] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const birthday = new Date('2024-12-06');
      const diff = Math.ceil((birthday - now) / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diff));
    }, 1000 * 60 * 60); // 每小时更新

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="birthday-countdown bg-gradient-to-r from-pink-100 to-yellow-50 border-2 border-pink-200">
      <div className="text-center p-6">
        <div className="text-6xl mb-4">🎂</div>
        <h2 className="text-2xl font-bold text-pink-600 mb-2">
          沫语宝贝的1岁生日倒计时
        </h2>
        <div className="text-5xl font-bold text-purple-600 my-4">
          {daysLeft}
        </div>
        <p className="text-gray-600 mb-4">天后就是沫语的生日啦！🎉</p>

        {daysLeft === 0 && (
          <Button
            onClick={() => setShowSurprise(true)}
            className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
          >
            点击查看生日惊喜 🎁
          </Button>
        )}

        {showSurprise && <BirthdaySurprise />}
      </div>
    </Card>
  );
};

export default BirthdayCountdown;`,

    // 成长回忆组件
    growthMemory: `import React, { useState } from 'react';
import { Card } from '../ui';

export const GrowthMemory = () => {
  const memories = [
    { month: '1月', title: '第一次微笑', icon: '😊', description: '沫语第一次对妈妈微笑' },
    { month: '3月', title: '第一次翻身', icon: '🔄', description: '学会了翻身运动' },
    { month: '5月', title: '第一次坐起', icon: '👶', description: '独立坐起来了' },
    { month: '7月', title: '第一次爬行', icon: '🐛', description: '开始探索世界' },
    { month: '9月', title: '第一次站立', icon: '🚶', description: '扶着东西站立' },
    { month: '11月', title: '第一步', icon: '👣', description: '迈出人生第一步' }
  ];

  return (
    <Card className="growth-memory bg-gradient-to-br from-blue-50 to-green-50">
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-600 mb-4">沫语的成长轨迹 🌱</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {memories.map((memory, index) => (
            <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-2">{memory.icon}</div>
              <h4 className="font-semibold text-gray-700">{memory.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{memory.month}</p>
              <p className="text-xs text-gray-400 mt-1">{memory.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};`,

    // 生日祝福组件
    birthdayWishes: `import React from 'react';
import { Card } from '../ui';

export const BirthdayWishes = () => {
  const wishes = [
    { from: '爸爸💙', wish: '愿沫语像星星一样闪亮，像花朵一样美丽' },
    { from: '妈妈❤️', wish: '宝贝的每一次笑容都是妈妈最大的幸福' },
    { from: '爷爷👴', wish: '祝沫语健康快乐，聪明伶俐' },
    { from: '奶奶👵', wish: '沫语是全家人的小公主，永远爱你' },
    { from: '外公👨', wish: '愿沫语在爱的包围中快乐成长' },
    { from: '外婆👩', wish: '沫语的每个第一次都是最珍贵的回忆' }
  ];

  return (
    <Card className="birthday-wishes bg-gradient-to-r from-purple-100 to-pink-100">
      <div className="p-6">
        <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">家人的祝福 💌</h3>
        <div className="space-y-3">
          {wishes.map((item, index) => (
            <div key={index} className="bg-white/80 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-purple-500 mb-1">{item.from}</div>
              <p className="text-gray-700 text-sm italic">"{item.wish}"</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};`
  }

  return components
}

// 创建生日配置文件
const birthdayConfig = {
  theme: birthdayTheme,
  settings: {
    enableBirthdayMode: true,
    birthdayDate: '2024-12-06',
    showCountdown: true,
    autoActivate: daysUntilBirthday <= 3
  },
  messages: {
    birthdayTitle: '沫语宝贝的1岁生日 🎂',
    birthdaySubtitle: '365天的珍贵时光',
    celebrationMessage: '今天沫语1岁了！感谢你来到我们的世界 💕'
  }
}

// 写入文件
const outputDir = '/Users/yanyu/www/moyu-birthday-surprise'

try {
  // 创建目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 创建生日组件
  const components = createBirthdayComponents()
  Object.entries(components).forEach(([name, content]) => {
    fs.writeFileSync(path.join(outputDir, `${name}.tsx`), content)
  })

  // 创建配置文件
  fs.writeFileSync(
    path.join(outputDir, 'birthday-config.json'),
    JSON.stringify(birthdayConfig, null, 2)
  )

  // 创建启动脚本
  const startScript = `#!/bin/bash
echo "🎂 启动沫语宝贝生日模式..."
echo "🗓️ 距离生日: ${daysUntilBirthday} 天"
echo ""
echo "🎁 生日惊喜包括:"
echo "   ✅ 生日倒计时组件"
echo "   ✅ 成长回忆组件"
echo "   ✅ 家人祝福组件"
echo "   ✅ 生日主题配置"
echo ""
echo "🚀 准备为沫语宝贝庆祝1岁生日！"
`

  fs.writeFileSync(path.join(outputDir, 'start-birthday.sh'), startScript)
  fs.chmodSync(path.join(outputDir, 'start-birthday.sh'), '755')

  console.log('✅ 生日惊喜准备完成！')
  console.log(`📁 文件位置: ${outputDir}`)
  console.log('')
  console.log('🎂 为沫语宝贝准备的1岁生日惊喜:')
  console.log('   📊 生日倒计时组件')
  console.log('   🌱 成长回忆组件')
  console.log('   💌 家人祝福组件')
  console.log('   🎨 生日主题配置')
  console.log('')
  console.log('🎯 10天后，沫语宝贝就1岁了！')

} catch (error) {
  console.error('❌ 创建生日惊喜时出错:', error.message)
}