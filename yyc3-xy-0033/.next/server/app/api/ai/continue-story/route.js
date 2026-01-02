"use strict";(()=>{var e={};e.id=3473,e.ids=[3473],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},94239:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>g,patchFetch:()=>S,requestAsyncStorage:()=>d,routeModule:()=>h,serverHooks:()=>m,staticGenerationAsyncStorage:()=>y});var o={};t.r(o),t.d(o,{POST:()=>p});var n=t(49303),i=t(88716),s=t(60670),a=t(87070),u=t(50984),c=t(44890);let l={fairy_tale:"使用童话故事的叙事风格，加入魔法元素、王子公主、神奇生物等，语言优美富有想象力",adventure:"使用冒险故事的叙事风格，加入探险、挑战、勇气等元素，节奏紧凑充满悬念",science:"使用科幻故事的叙事风格，加入宇宙、机器人、未来科技等元素，充满想象又有科学基础",humor:"使用幽默诙谐的叙事风格，加入搞笑情节、有趣对话，让人捧腹大笑",mystery:"使用悬疑故事的叙事风格，加入线索、推理、揭秘等元素，但保持适合儿童的轻松氛围",fable:"使用寓言故事的叙事风格，通过小故事传递道理，角色多为动物，结尾有启示",daily:"使用日常生活的叙事风格，描述普通家庭、学校、朋友间的温馨故事"};async function p(e){try{let{keywords:r,style:t,previousContent:o,userInput:n}=await e.json(),i=l[t]||l.fairy_tale,s=`你是一位专业的儿童故事作家，擅长创作适合3-12岁儿童的故事。

创作要求：
1. ${i}
2. 语言简洁生动，适合儿童阅读
3. 内容积极向上，传递正能量
4. 每段续写100-150字
5. 提供3个不同发展方向的续写选项
6. 严禁任何暴力、恐怖、不适当的内容

关键词：${r.join("、")}

请根据已有内容和用户输入，提供3个不同方向的故事续写选项。每个选项包含续写内容和发展方向标签。

输出格式(JSON):
{
  "options": [
    { "id": "1", "content": "续写内容...", "direction": "方向标签" },
    { "id": "2", "content": "续写内容...", "direction": "方向标签" },
    { "id": "3", "content": "续写内容...", "direction": "方向标签" }
  ]
}`,p=`已有故事内容：
${o||"（故事刚开始）"}

${n?`孩子新写的内容：${n}`:"请开始故事"}

请提供3个续写选项：`;try{let{text:e}=await (0,u._4)({model:"openai/gpt-4o-mini",system:s,prompt:p,maxOutputTokens:1e3,temperature:.8}),r=e.match(/\{[\s\S]*\}/);if(r){let e=JSON.parse(r[0]);return a.NextResponse.json(e)}}catch(e){(0,c.eK)(e,{component:"AIStoryAPI",action:"generateText",endpoint:"/api/ai/continue-story"})}let h=function(e,r,t){let o=e[0]||"小朋友";return[{id:"1",content:`就在这时，${o}发现了一个闪闪发光的神秘宝盒，宝盒上刻满了奇怪的符号。"这是什么呢？"${o}好奇地凑近看，宝盒突然发出温暖的光芒...`,direction:"发现宝藏"},{id:"2",content:`一只毛茸茸的小动物从草丛里跳了出来，它有着亮晶晶的大眼睛。"你好呀！"小动物开口说话了，"我叫小星，我们做朋友好吗？"${o}惊喜极了...`,direction:"遇见朋友"},{id:"3",content:`天空中飘来一朵彩色的云，云朵慢慢降落，变成了一座漂亮的彩虹桥。桥的那头传来美妙的音乐，${o}忍不住想要走过去看看...`,direction:"奇幻旅程"}]}(r,0,0);return a.NextResponse.json({options:h})}catch(e){return(0,c.eK)(e,{component:"AIStoryAPI",action:"continueStory",endpoint:"/api/ai/continue-story"}),a.NextResponse.json({error:"故事续写失败"},{status:500})}}let h=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/ai/continue-story/route",pathname:"/api/ai/continue-story",filename:"route",bundlePath:"app/api/ai/continue-story/route"},resolvedPagePath:"/Users/yanyu/yyc3-xiaoyu/yyc3-xiaoyu-unified/app/api/ai/continue-story/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:y,serverHooks:m}=h,g="/api/ai/continue-story/route";function S(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:y})}},44890:(e,r,t)=>{t.d(r,{eK:()=>i});class o{constructor(){this.errorQueue=[],this.isOnline=!0,this.maxQueueSize=50}static getInstance(){return o.instance||(o.instance=new o),o.instance}reportError(e,r){let t={error:e,context:r,timestamp:new Date().toISOString(),userAgent:"Server",url:"Unknown"};this.isOnline?this.sendErrorReport(t):this.queueErrorReport(t)}async sendErrorReport(e){try{let r=await fetch("http://localhost:1228/api/error-report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({error:{message:e.error.message,stack:e.error.stack,name:e.error.name},context:e.context,userAgent:e.userAgent,url:e.url,timestamp:e.timestamp})});if(!r.ok)throw Error(`HTTP error! status: ${r.status}`);console.log("Error report sent successfully")}catch(r){console.warn("Failed to send error report, queuing for later:",r),this.queueErrorReport(e)}}queueErrorReport(e){this.errorQueue.push(e),this.errorQueue.length>this.maxQueueSize&&this.errorQueue.shift(),this.saveErrorQueueToStorage()}async flushErrorQueue(){if(0===this.errorQueue.length)return;let e=[...this.errorQueue];for(let r of(this.errorQueue=[],e))try{await this.sendErrorReport(r)}catch(e){console.warn("Failed to send queued error report:",e),this.errorQueue.push(r)}0===this.errorQueue.length&&this.clearErrorQueueFromStorage()}saveErrorQueueToStorage(){try{localStorage.setItem("yyc3_error_queue",JSON.stringify(this.errorQueue))}catch(e){console.warn("Failed to save error queue to localStorage:",e)}}clearErrorQueueFromStorage(){try{localStorage.removeItem("yyc3_error_queue")}catch(e){console.warn("Failed to clear error queue from localStorage:",e)}}loadErrorQueueFromStorage(){try{let e=localStorage.getItem("yyc3_error_queue");e&&(this.errorQueue=JSON.parse(e))}catch(e){console.warn("Failed to load error queue from localStorage:",e)}}getErrorStats(){return{totalErrors:this.errorQueue.length,queuedErrors:this.errorQueue.length,isOnline:this.isOnline}}clearErrors(){this.errorQueue=[],this.clearErrorQueueFromStorage()}}let n=o.getInstance(),i=(e,r)=>{n.reportError(e,r)}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[8948,5972,1585,984],()=>t(94239));module.exports=o})();