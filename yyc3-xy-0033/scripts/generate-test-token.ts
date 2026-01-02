#!/usr/bin/env bun
/**
 * JWT测试Token生成工具
 * 用于生成测试认证API的JWT token
 */

import jwt from 'jsonwebtoken';

// 从环境变量读取JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-key-for-yyc3-xiaoyu-local-development-32chars';

// 测试用户数据
const testUser = {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@yyc3.com',
  role: 'parent',
  name: '测试用户',
};

// 生成token
const token = jwt.sign(
  testUser,
  JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('='.repeat(60));
console.log('YYC³-XIAOYU 测试Token生成器');
console.log('='.repeat(60));
console.log('');
console.log('📋 测试用户信息:');
console.log(`   用户ID: ${testUser.userId}`);
console.log(`   邮箱: ${testUser.email}`);
console.log(`   角色: ${testUser.role}`);
console.log(`   姓名: ${testUser.name}`);
console.log('');
console.log('🔑 生成的JWT Token:');
console.log('');
console.log(token);
console.log('');
console.log('='.repeat(60));
console.log('📖 使用方法:');
console.log('');
console.log('1. 使用curl测试API:');
console.log(`   curl -H "Authorization: Bearer ${token}" \\`);
console.log('         http://localhost:1228/api/children');
console.log('');
console.log('2. 设置环境变量:');
console.log(`   export TEST_TOKEN="${token}"`);
console.log('');
console.log('3. 在浏览器中使用:');
console.log('   打开开发者工具 → Console → 输入:');
console.log(`   localStorage.setItem('auth_token', '${token}')`);
console.log('');
console.log('='.repeat(60));
