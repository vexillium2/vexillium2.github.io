
(function(){
'use strict';
/* ============ 任务面板 · 专注控制室 v2 ============
   模块一 碎片/纯度/锁定/中断/聚合/2分钟
   模块二 双轴时间轴/跨午夜/双层渲染/红指针/空隙/三状态/专注底纹
   模块三 预估与每日可用分离/日收工与整体完成/剩余提醒/滚动分流
   模块四 睡眠圆形平均与柱状图
   模块五 注意力曲线/横向条形图/评估/时钟
   模块六 娱乐标签/像素背景                                       */
var MOBILE=!!(typeof window!=='undefined'&&window.__TP_MOBILE__);
var PROJECT_DIR=MOBILE?'':'/Users/jacobdu/Dev/playground/TaskTable/';
var DATA_PATH=MOBILE?'':PROJECT_DIR+'tasktable-data.json';
var CAL_PATH=MOBILE?'feishu-calendar.json':PROJECT_DIR+'feishu-calendar.json';
var LS_KEY=MOBILE?'tasktable.mobile.v3':'tasktable.v2';
var IDB_NAME='tasktable-mobile',IDB_STORE='kv',idbPromise=null;
var WEEK=['周日','周一','周二','周三','周四','周五','周六'];
var TAGS={deep:'专注',shallow:'浅度',distracted:'分散',entertainment:'娱乐'};
var ENT_ID='__entertainment__';
var DEF_ENT_TAGS=['打球','出门吃饭','逛街','游戏','电影','社交','刷手机'];
var S=null,CAL={events:[],updatedAt:null},tab='today',viewDate=null;
var pendingReport=null,pendingReeval=null,pendingSleep=null,pendingFragment=null,pendingReevalTask=null;
var saveTimer=null,ticking=null,hiddenAt=null,cp=null,lastSwitchToast=0,dragIndex=-1,dragEl=null,dragKey=null,selectedKey=null,ptr=null,lastTimelineDate=null;

/* ---------- 基础工具 ---------- */
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function pad2(n){return (n<10?'0':'')+n;}
function dateKey(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function todayKey(){return dateKey(new Date());}
function parseKey(k){var p=String(k).split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function addDays(key,n){var d=parseKey(key);d.setDate(d.getDate()+n);return dateKey(d);}
function fmtMin(m){m=Math.round(m||0);var neg=m<0;m=Math.abs(m);var s;if(m<60)s=m+'m';else{var h=Math.floor(m/60),r=m%60;s=r?h+'h'+r+'m':h+'h';}return neg?'-'+s:s;}
function fmtHM(m){m=Math.round(((m%1440)+1440)%1440);return pad2(Math.floor(m/60))+':'+pad2(m%60);}
function localInput(ms){var d=new Date(ms);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+'T'+pad2(d.getHours())+':'+pad2(d.getMinutes());}
function clockHMS(ms){var s=Math.max(0,Math.floor(ms/1000));var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),x=s%60;return (h?h+':':'')+pad2(m)+':'+pad2(x);}
function wallHMS(d){return pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds());}
function uid(p){return (p||'t')+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function minutesOfDay(str){var p=String(str||'0:0').split(':');return (+p[0])*60+(+(p[1]||0));}
function getTask(id){if(!S)return null;for(var i=0;i<S.tasks.length;i++){if(S.tasks[i].id===id)return S.tasks[i];}return null;}
function settings(){return S.settings;}
function clump(arr,fn){var o={};(arr||[]).forEach(function(x){var k=fn(x);(o[k]=o[k]||[]).push(x);});return o;}
function sum(arr,fn){var t=0;(arr||[]).forEach(function(x){t+=(fn?fn(x):x)||0;});return t;}

/* ---------- 手机本地存储 ---------- */
function idbOpen(){
  if(idbPromise)return idbPromise;
  idbPromise=new Promise(function(resolve,reject){
    try{
      var factory=window.indexedDB||window.webkitIndexedDB;
      if(!factory){reject(new Error('no indexedDB'));return;}
      var req=factory.open(IDB_NAME,1);
      req.onupgradeneeded=function(){var db=req.result;if(!db.objectStoreNames.contains(IDB_STORE))db.createObjectStore(IDB_STORE);};
      req.onsuccess=function(){resolve(req.result);};
      req.onerror=function(){reject(req.error||new Error('idb open failed'));};
    }catch(e){reject(e);}
  });
  return idbPromise;
}
function idbGet(key){
  return idbOpen().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(IDB_STORE,'readonly');
    var r=tx.objectStore(IDB_STORE).get(key);
    r.onsuccess=function(){resolve(r.result||null);};
    r.onerror=function(){reject(r.error);};
  });});
}
function idbSet(key,val){
  return idbOpen().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(IDB_STORE,'readwrite');
    tx.objectStore(IDB_STORE).put(val,key);
    tx.oncomplete=function(){resolve(true);};
    tx.onerror=function(){reject(tx.error);};
  });});
}
function localLoadState(){
  function fromLs(){try{var raw=localStorage.getItem(LS_KEY);if(raw)return JSON.parse(raw);}catch(e){}return null;}
  if(!MOBILE)return Promise.resolve(fromLs()||defaultState());
  return idbGet(LS_KEY).then(function(v){return v||fromLs()||defaultState();}).catch(function(){return fromLs()||defaultState();});
}
function localSaveState(state){
  if(!MOBILE)return;
  try{localStorage.setItem(LS_KEY,JSON.stringify(state));}catch(e){}
  idbSet(LS_KEY,state).catch(function(){});
}

/* ---------- 状态与迁移 ---------- */
function defaultSettings(){
  return {
    projectDir:PROJECT_DIR,
    targetWake:'09:00', targetSleep:'01:30',
    workStart:'09:00', workEnd:'23:30',
    dailyOverheadMin:120, maxDeepMin:480,
    decompMaxStepMin:90, decompMaxChildren:7,
    idleAutoPause:false, idleMin:20, distractedCountsAsWork:false,
    entLimitMin:120, entCheckpointMin:40,
    taskTimeboxMin:90, timeboxEnabled:true,
    morningRampMin:45,
    lockDeepBlock:false,
    bg:'fuji',
    entTags:DEF_ENT_TAGS.slice(),
    switchWarnCount:3, switchWindowMin:30,
    mobileWelcomeDone:false
  };
}
function defaultState(){
  return {version:3,updatedAt:new Date().toISOString(),settings:defaultSettings(),tasks:[],days:{},sleeps:{},activeSession:null,activeFragmentId:null,fragments:[],thoughts:[],laterPool:[],switchLog:[],triageAck:{}};
}
function ensureEntertainment(){
  var t=getTask(ENT_ID);
  if(!t){
    t={id:ENT_ID,title:'娱乐时间',description:'固定计时项：电影/打球/社交/新idea 等。不计入工作预算与工作指标。',deadline:null,deadlineKind:'soft',estimateMin:0,actualMin:0,distractedMin:0,sessions:[],state:'doing',plannedFor:null,parentId:null,priorityOverride:null,kind:'entertainment',createdAt:new Date().toISOString()};
    S.tasks.unshift(t);
  }
  t.kind='entertainment';
  return t;
}
function ensureState(){
  var dflt=defaultSettings();
  if(!S.settings||typeof S.settings!=='object')S.settings={};
  var hadWake=S.settings.targetWake!==undefined,hadSleep=S.settings.targetSleep!==undefined;
  var legacyWake=S.settings.sleepTargetWake,legacyBed=S.settings.sleepTargetBed;
  for(var k in dflt){ if(S.settings[k]===undefined)S.settings[k]=dflt[k]; }
  if(!hadWake&&legacyWake)S.settings.targetWake=legacyWake;
  if(!hadSleep&&legacyBed)S.settings.targetSleep=legacyBed;
  S.version=3;
  if(!Array.isArray(S.settings.entTags)||!S.settings.entTags.length)S.settings.entTags=DEF_ENT_TAGS.slice();
  if(!Array.isArray(S.tasks))S.tasks=[];
  if(!S.days||typeof S.days!=='object')S.days={};
  if(!S.sleeps||typeof S.sleeps!=='object')S.sleeps={};
  if(!Array.isArray(S.fragments))S.fragments=[];
  if(!Array.isArray(S.thoughts)){
    S.thoughts=(S.fragments||[]).map(function(f){
      var st=f.state;
      var state=(st==='inbox'||st==='later'||st==='batched')?'inbox':(st==='done'?'done':(st==='assigned'?'converted':'inbox'));
      var desc=f.description||((f.context&&f.context!=='general')?f.context:'');
      return {id:f.id||uid('th'),title:f.title||'思绪',description:desc||'',createdAt:f.createdAt||new Date().toISOString(),dayKey:f.dayKey||dateKey(new Date(f.createdAt||Date.now())),state:state,convertedTaskId:f.assignedTo||null,duringTaskId:null,duringSessionId:null,duringPaused:false,legacyMode:f.mode||'capture',legacyActualMin:f.actualMin||0,legacyEstMin:f.estMin||0};
    });
  }
  S.thoughts.forEach(function(th){if(!th.id)th.id=uid('th');if(!th.state)th.state='inbox';if(!th.dayKey)th.dayKey=dateKey(new Date(th.createdAt||Date.now()));if(th.duringPaused===undefined)th.duringPaused=false;});
  S.activeFragmentId=null;
  if(!Array.isArray(S.laterPool))S.laterPool=[];
  if(!Array.isArray(S.switchLog))S.switchLog=[];
  if(!S.triageAck||typeof S.triageAck!=='object')S.triageAck={};
  S.tasks.forEach(function(t){
    if(!Array.isArray(t.sessions))t.sessions=[];
    t.sessions.forEach(function(s){
      if(!Array.isArray(s.interruptions))s.interruptions=[];
      if(!Array.isArray(s.pauses))s.pauses=[];
      if(s.selfScore===undefined||s.selfScore===null)s.selfScore=tagScore(s.tag);
      if(s.thoughtCount===undefined)s.thoughtCount=0;
    });
  });
  Object.keys(S.days).forEach(function(k){
    var day=S.days[k];
    if(!day||typeof day!=='object'){S.days[k]={committed:[],plan:[]};day=S.days[k];}
    if(!Array.isArray(day.committed))day.committed=[];
    if(!Array.isArray(day.plan))day.plan=[];
    if(!Array.isArray(day.laterQueue))day.laterQueue=[];else day.laterQueue=[];
    if(!day.dailyDone||typeof day.dailyDone!=='object')day.dailyDone={};
    if(!day.plan.length&&day.committed.length)buildPlanFromCommitted(k);
  });
  ensureEntertainment();
}
function buildPlanFromCommitted(key){
  var day=S.days[key];if(!day)return;
  var ids=day.committed.map(getTask).filter(Boolean).sort(sortTasks).map(function(t){return t.id;});
  day.plan=ids.map(function(id){return {type:'task',taskId:id,minutes:defaultDaily(getTask(id))};});
}
function entTask(){return getTask(ENT_ID);}
function tagScore(tag){return tag==='deep'?80:tag==='distracted'?20:tag==='entertainment'?50:50;}
function thoughtsOn(key){return (S.thoughts||[]).filter(function(t){return t.dayKey===key;});}
function thoughtCountOn(key){return thoughtsOn(key).length;}
function thoughtPenaltyCountOn(key){return (S.thoughts||[]).filter(function(t){return t.dayKey===key&&t.duringTaskId&&!t.duringPaused;}).length;}
function scoreTag(score){score=+score||0;return score>=67?'deep':score>=34?'shallow':'distracted';}

/* ---------- 优先级 ---------- */
function derivePriority(t){
  if(!t)return {p:'—',reason:'无'};
  if(t.state==='done')return {p:'—',reason:'已完成'};
  if(t.state==='dropped')return {p:'—',reason:'已取消'};
  if(t.priorityOverride)return {p:t.priorityOverride,reason:'手动覆盖'};
  if(t.state==='blocked')return {p:'P1',reason:'阻塞中'};
  if(!t.deadline)return {p:'P2',reason:'无截止'};
  var dl=new Date(t.deadline).getTime(),now=Date.now();
  var remain=Math.max(0,(t.estimateMin||0)-(t.actualMin||0));
  if(dl<=now)return {p:'P0',reason:'已过期',over:true};
  var until=(dl-now)/60000,danger=until>0?remain/until:9;
  var p=danger>=0.6?'P0':danger>=0.25?'P1':'P2';
  if(t.deadlineKind==='hard'){ if(p==='P2')p='P1'; else if(p==='P1')p='P0'; }
  return {p:p,reason:'需 '+fmtMin(remain)+' / 剩 '+fmtMin(until)+'（'+Math.round(Math.min(9,danger)*100)+'%）',danger:danger};
}
function prank(p){return p==='P0'?0:p==='P1'?1:p==='P2'?2:3;}
function sortTasks(a,b){
  var pa=derivePriority(a).p,pb=derivePriority(b).p;
  if(prank(pa)!==prank(pb))return prank(pa)-prank(pb);
  var da=a.deadline?new Date(a.deadline).getTime():9e15;
  var db=b.deadline?new Date(b.deadline).getTime():9e15;
  if(da!==db)return da-db;
  return (a.createdAt||'')<(b.createdAt||'')?-1:1;
}

/* ---------- 时间窗口（跨午夜）---------- */
function wakeMin(){return minutesOfDay(settings().targetWake||'09:00');}
function windowLen(){var w=wakeMin(),s2=minutesOfDay(settings().targetSleep||'01:30');var len=(s2-w+1440)%1440;if(len<=0)len+=1440;return len;}
function relMin(dt){var d=(dt instanceof Date)?dt:new Date(dt);var m=d.getHours()*60+d.getMinutes();var rel=m-wakeMin();if(rel<0)rel+=1440;return rel;}
function clampRel(r){return Math.max(0,Math.min(windowLen(),r));}
function sleepTargetDur(){return 1440-windowLen();}
function nowRel(){return relMin(new Date());}
function relToClock(rel){return fmtHM((wakeMin()+rel)%1440);}
function firstStartMinOf(key){
  var day=S.days[key]||{};
  var ft=day.firstTaskId?getTask(day.firstTaskId):null;if(!ft)return null;
  var best=null;
  (ft.sessions||[]).forEach(function(s){if(dateKey(new Date(s.start))!==key)return;var d=new Date(s.start);var m=d.getHours()*60+d.getMinutes();if(best===null||m<best)best=m;});
  if(S.activeSession&&S.activeSession.taskId===ft.id){var d2=new Date(S.activeSession.start);if(dateKey(d2)===key){var m2=d2.getHours()*60+d2.getMinutes();if(best===null||m2<best)best=m2;}}
  return best;
}
function busySegments(key){
  var len=windowLen(),segs=[];
  (CAL.events||[]).forEach(function(e){
    if(e.allDay)return;
    var s=new Date(e.start),t=new Date(e.end);
    if(isNaN(s.getTime())||isNaN(t.getTime()))return;
    var sd=dateKey(s),ed=dateKey(t);
    if(sd!==key&&ed!==key)return;
    var a=relMin(s),b=relMin(t);
    if(sd!==key)a=0;
    if(ed!==key)b=len;
    if(b<=a)a=0;
    a=clampRel(a);b=clampRel(b);
    if(b>a)segs.push({start:a,end:b,title:e.summary||'(无标题)'});
  });
  segs.sort(function(x,y){return x.start-y.start;});
  var m=[];
  segs.forEach(function(g){var last=m[m.length-1];if(last&&g.start<=last.end){last.end=Math.max(last.end,g.end);if(last.title!==g.title)last.title=last.title+' / '+g.title;}else m.push({start:g.start,end:g.end,title:g.title});});
  return m;
}
function eventsForDay(key){return (CAL.events||[]).filter(function(e){return e.start&&dateKey(new Date(e.start))===key;}).sort(function(a,b){return new Date(a.start)-new Date(b.start);});}

/* ---------- 日计划与容量 ---------- */
function ensureDay(key){
  if(!S.days[key])S.days[key]={committed:[],plan:[]};
  var d=S.days[key];
  if(!Array.isArray(d.committed))d.committed=[];
  if(!Array.isArray(d.plan))d.plan=[];
  if(!Array.isArray(d.laterQueue))d.laterQueue=[];
  if(!d.dailyDone||typeof d.dailyDone!=='object')d.dailyDone={};
  if(!d.plan.length&&d.committed.length)buildPlanFromCommitted(key);
  return d;
}
function defaultDaily(t){var rem=Math.round(Math.max(0,(t.estimateMin||0)-(t.actualMin||0)));return rem>0?rem:Math.round(t.estimateMin||0);}
function planEntry(key,id){var d=ensureDay(key);for(var i=0;i<d.plan.length;i++){var b=d.plan[i];if(b.type==='task'&&b.taskId===id)return b;}return null;}
function addToDay(key,id,force,minutes){
  var t=getTask(id);if(!t)return false;
  if(isContainer(t))return {error:'父任务是容器，不能加入今日；请把它的子任务加入今日。'};
  var d=ensureDay(key);
  var mt=minutes!=null?Math.max(0,Math.round(minutes)):defaultDaily(t);
  if(planEntry(key,id))return true;
  var cap=dayCapacity(key);
  var room=cap.cap-cap.planned;
  if(!force&&room<mt){
    return {error:'预算不足：还需要 '+fmtMin(mt)+'，可用只剩 '+fmtMin(Math.max(0,room))+'. 可减少每日可用时间、移除任务或减小固定占用。'};
  }
  d.committed.push(id);
  d.plan.push({type:'task',taskId:id,minutes:mt});
  t.plannedFor=key;
  save();return true;
}
function removeFromDay(key,id){
  var d=ensureDay(key);
  d.committed=d.committed.filter(function(x){return x!==id;});
  d.plan=d.plan.filter(function(b){return !(b.type==='task'&&b.taskId===id);});
  var t=getTask(id);if(t&&t.plannedFor===key)t.plannedFor=null;
  save();
}
function dayCapacity(key){
  var len=windowLen();
  var busy=sum(busySegments(key),function(g){return g.end-g.start;});
  var overhead=settings().dailyOverheadMin||0;
  var cap=Math.max(0,len-busy-overhead);
  if(settings().maxDeepMin)cap=Math.min(cap,settings().maxDeepMin);
  var day=S.days[key];
  if(day&&!Array.isArray(day.plan)&&Array.isArray(day.committed)&&day.committed.length)buildPlanFromCommitted(key);
  var plan=(day&&Array.isArray(day.plan))?day.plan:[];
  var dailyDone=(day&&day.dailyDone)||{};
  var planned=0;
  plan.forEach(function(b){
    if(b.type!=='task')return;
    var t=getTask(b.taskId);if(!t)return;
    if(t.state==='done'||t.state==='dropped')return;
    if(dailyDone[b.taskId])return;
    planned+=Math.max(0,b.minutes||0);
  });
  return {win:len,busy:busy,overhead:overhead,cap:cap,planned:planned,free:cap-planned};
}

/* ---------- 会话 / 纯度 ---------- */
function sessionMetrics(s){
  var wall=Math.max(0,(new Date(s.end)-new Date(s.start))/60000);
  var pauses=(s.pauses||[]).filter(function(p){return p&&p.start;});
  var intrs=(s.interruptions||[]).filter(function(p){return p&&p.start;});
  var pauseMin=0,pauseCount=0;
  function addGap(p){
    if(!p||!p.start)return;
    var e=p.end?new Date(p.end):new Date();
    var d=(e-new Date(p.start))/60000;
    if(d>0){pauseMin+=d;pauseCount++;}
  }
  pauses.forEach(addGap);intrs.forEach(addGap);
  var thoughtCount=(s.thoughtCount!=null)?+s.thoughtCount:thoughtPenaltyForSession(s.sid);
  var self=(s.selfScore!=null)?+s.selfScore:tagScore(s.tag);
  self=Math.max(0,Math.min(100,self));
  var real=Math.max(0,wall-pauseMin-2*pauseCount-2*thoughtCount);
  var realRatio=wall>0?real/wall:0;
  var purity=0.5*(self/100)+0.5*realRatio;
  return {wall:wall,pauseMin:pauseMin,pauseCount:pauseCount,thoughtCount:thoughtCount,self:self,real:real,realRatio:realRatio,purity:purity,active:Math.max(0,wall-pauseMin)};
}
function thoughtPenaltyForSession(sid){
  if(!sid)return 0;
  var n=0;(S.thoughts||[]).forEach(function(t){if(t.duringSessionId===sid&&!t.duringPaused)n++;});
  return n;
}
function sessionPurity(s){
  var m=sessionMetrics(s);
  return {total:m.wall,interrupted:m.pauseMin,real:m.real,count:m.pauseCount,purity:m.purity,self:m.self,realRatio:m.realRatio,active:m.active,thoughtCount:m.thoughtCount};
}
function isPaused(a){
  if(!a)return false;
  var p=a.pauses||[];
  return p.length>0&&!p[p.length-1].end;
}
function activeElapsedMs(a,now){
  if(!a)return 0;now=now||Date.now();
  var start=new Date(a.start).getTime(),paused=0;
  (a.pauses||[]).forEach(function(p){
    if(!p||!p.start)return;
    var s=new Date(p.start).getTime(),e=p.end?new Date(p.end).getTime():now;
    if(e>s)paused+=e-s;
  });
  return Math.max(0,now-start-paused);
}
function addSession(taskId,startMs,endMs,tag,note,interruptions,rest,opts){
  var t=getTask(taskId);if(!t)return;
  if(!t.sessions)t.sessions=[];
  var d2=(endMs-startMs)/60000;if(d2<=0)return;
  opts=opts||{};
  var pauses=(opts.pauses||[]).map(function(p){return {start:p.start,end:p.end||new Date(endMs).toISOString()};});
  var thoughtCount=opts.thoughtCount||0;
  var sid=opts.sid||uid('s');
  var selfScore=(opts.selfScore!=null)?Math.max(0,Math.min(100,+opts.selfScore)):tagScore(tag);
  var rec={start:new Date(startMs).toISOString(),end:new Date(endMs).toISOString(),tag:tag,note:note||'',rest:!!rest,sid:sid,selfScore:selfScore,thoughtCount:thoughtCount,pauses:pauses,interruptions:(interruptions||[]).map(function(x){return {start:x.start,end:x.end,reason:x.reason||''};})};
  var m=sessionMetrics(rec);
  rec.purity=m.purity;rec.realMin=m.real;rec.realRatio=m.realRatio;rec.pauseMin=m.pauseMin;rec.pauseCount=m.pauseCount;rec.activeMin=m.active;rec.wallMin=m.wall;rec.interruptMin=m.pauseMin;rec.interruptCount=m.pauseCount;
  t.sessions.push(rec);
  t.actualMin=(t.actualMin||0)+m.active;
  if(selfScore<34)t.distractedMin=(t.distractedMin||0)+m.active;
  if(t.state==='todo'||t.state==='inbox')t.state='doing';
  return rec;
}
function activeTask(){return S.activeSession?getTask(S.activeSession.taskId):null;}
function taskActualOn(taskId,key){
  var t=getTask(taskId);if(!t)return 0;var m=0;
  (t.sessions||[]).forEach(function(s){if(dateKey(new Date(s.start))===key)m+=sessionMetrics(s).active;});
  if(S.activeSession&&S.activeSession.taskId===taskId&&dateKey(new Date(S.activeSession.start))===key)m+=activeElapsedMs(S.activeSession)/60000;
  return m;
}
function ownActual(t){
  var ss=t.sessions||[];
  if(ss.length){var m=0;ss.forEach(function(s){m+=sessionMetrics(s).active;});return m;}
  return t.actualMin||0;
}
function directChildren(id){return (S.tasks||[]).filter(function(t){return t.parentId===id&&t.state!=='dropped';});}
function isContainer(t){return !!(t&&directChildren(t.id).length);}
function allDescendantsDone(id){
  var kids=directChildren(id);
  if(!kids.length)return true;
  return kids.every(function(c){return c.state==='done'&&allDescendantsDone(c.id);});
}
function taskActualRollup(t){
  if(!t)return 0;
  var m=ownActual(t);
  directChildren(t.id).forEach(function(c){m+=taskActualRollup(c);});
  return m;
}
function reopenAncestors(taskId){
  var t=getTask(taskId);if(!t)return;
  var pid=t.parentId,guard=0;
  while(pid&&guard++<20){
    var p=getTask(pid);if(!p)break;
    if(p.state==='done'){p.state='doing';p.completedAt=null;p.updatedAt=new Date().toISOString();}
    pid=p.parentId;
  }
}
function taskPurityOn(taskId,key){
  var t=getTask(taskId);if(!t)return null;var tot=0,pur=0,cnt=0,self=0,real=0;
  (t.sessions||[]).forEach(function(s){ if(dateKey(new Date(s.start))!==key)return; var m=sessionMetrics(s);if(m.wall<=0)return;tot+=m.wall;pur+=m.purity*m.wall;self+=m.self*m.wall;real+=m.realRatio*m.wall;cnt+=m.pauseCount+m.thoughtCount; });
  if(tot<=0)return null;
  return {purity:pur/tot,self:self/tot,real:real/tot,total:tot,count:cnt};
}
function noteSwitch(id){
  if(!S.switchLog)S.switchLog=[];
  var win=(settings().switchWindowMin||30)*60000;
  S.switchLog.push({at:Date.now(),taskId:id});
  S.switchLog=S.switchLog.filter(function(x){return x.at>=Date.now()-win;});
  checkSwitchCost();
}
function switchCost(){
  var win=(settings().switchWindowMin||30)*60000;
  var recent=(S.switchLog||[]).filter(function(x){return x.at>=Date.now()-win;});
  var ids={};recent.forEach(function(x){ids[x.taskId]=1;});
  return {n:Object.keys(ids).length,raw:recent.length};
}
function checkSwitchCost(){
  var need=+settings().switchWarnCount||3;
  var c=switchCost();
  if(c.n<need)return;
  if(Date.now()-lastSwitchToast<8*60000)return;
  lastSwitchToast=Date.now();
  toast('过去 '+settings().switchWindowMin+' 分钟切换了 '+c.n+' 个任务，注意力恢复需要时间。要回到主任务吗？','warn',[{label:'回到主任务',act:'focusMain'},{label:'知道了',act:'dismiss'}]);
}
function startTimer(id){
  var t=getTask(id);if(!t)return;
  if(isContainer(t)){toast('父任务是容器，不能直接开始；请开始它的子任务。','warn',[{label:'知道了',act:'dismiss'}]);return;}
  if(S.activeSession&&S.activeSession.taskId===id){stopTimer();return;}
  if(S.activeSession){toast('当前有计时在进行，先停止后再开始任务。','warn',[{label:'知道了',act:'dismiss'}]);return;}
  if(t.state==='todo'||t.state==='inbox')t.state='doing';
  S.activeSession={taskId:id,start:new Date().toISOString(),interruptions:[],pauses:[],sid:uid('s')};
  cp=null;noteSwitch(id);save();render();
}
function startMediaSession(isRest,tag){
  if(S.activeSession){toast('当前有计时在进行，先停止后再加入娱乐/休息。','warn',[{label:'知道了',act:'dismiss'}]);return;}
  S.activeSession={taskId:ENT_ID,start:new Date().toISOString(),interruptions:[],pauses:[],sid:uid('s'),rest:!!isRest,entTag:tag||''};
  cp=null;save();render();
}
function closeOpenPause(a){
  if(!a||!Array.isArray(a.pauses))return;
  var p=a.pauses[a.pauses.length-1];
  if(p&&!p.end)p.end=new Date().toISOString();
}
function pauseTimer(){
  var a=S.activeSession;if(!a||a.taskId===ENT_ID)return;
  if(isPaused(a))return;
  if(!Array.isArray(a.pauses))a.pauses=[];
  a.pauses.push({start:new Date().toISOString(),end:null});
  save();render();
}
function resumeTimer(){
  var a=S.activeSession;if(!a)return;
  var p=(a.pauses||[])[(a.pauses||[]).length-1];
  if(p&&!p.end)p.end=new Date().toISOString();
  save();render();
}
function pauseToggle(){
  var a=S.activeSession;if(!a)return;
  if(a.taskId===ENT_ID)return;
  if(isPaused(a))resumeTimer();else pauseTimer();
}
function stopTimer(){
  if(!S.activeSession)return;
  var a=S.activeSession;
  closeOpenPause(a);
  var thoughtCount=thoughtPenaltyForSession(a.sid);
  var isEnt=a.taskId===ENT_ID;
  S.activeSession=null;cp=null;save();
  pendingReport={taskId:a.taskId,start:new Date(a.start).getTime(),end:Date.now(),tag:isEnt?'entertainment':'deep',note:'',auto:false,interruptions:a.interruptions||[],pauses:a.pauses||[],sid:a.sid,thoughtCount:thoughtCount,rest:!!a.rest,entTag:a.entTag||''};
  render();openReport();
}
function finishReport(){
  if(!pendingReport)return;
  var st=new Date($('rpStart').value).getTime();
  var en=new Date($('rpEnd').value).getTime();
  if(!(en>st)){
    if(pendingReport.end>pendingReport.start){st=pendingReport.start;en=pendingReport.end;}
    else{alert('结束时间必须晚于开始时间');return;}
  }
  var isEntTask=!!(getTask(pendingReport.taskId)&&getTask(pendingReport.taskId).kind==='entertainment');
  var note=$('rpNote')?$('rpNote').value:'';
  var isRest=isEntTask?($('rpRest')?$('rpRest').value==='rest':!!pendingReport.rest):false;
  var entTag=(isEntTask&&!isRest&&$('rpEntTag'))?$('rpEntTag').value:'';
  var selfScore=isEntTask?null:(($('rpSelf')?+$('rpSelf').value:60));
  var tag=isEntTask?'entertainment':scoreTag(selfScore==null?60:selfScore);
  addSession(pendingReport.taskId,st,en,tag,note,pendingReport.interruptions||[],isRest,{pauses:pendingReport.pauses||[],selfScore:selfScore,sid:pendingReport.sid,thoughtCount:pendingReport.thoughtCount||0});
  if(tag==='entertainment'&&!isRest&&entTag){var last=sessLast(pendingReport.taskId);if(last)last.entTag=entTag;}
  var wasTask=!isEntTask;
  pendingReport=null;closeModal();save();render();
  if(wasTask)setTimeout(openRestPrompt,220);
}
function openRestPrompt(){
  if(!S||S.activeSession)return;
  var h='<h2 class="dshell-title">休息一下？</h2>';
  h+='<p class="dshell-sub">刚结束一个专注块。建议 10–20 分钟不看屏幕，给注意力留恢复时间。要不要现在开始休息计时？</p>';
  h+='<div class="tpRow" style="margin-top:16px"><button class="dshell-btn" data-act="restConfirm">确认，开始休息计时</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消，不计时</button></div>';
  openModal(h);
}
function sessLast(id){var t=getTask(id);if(!t||!t.sessions||!t.sessions.length)return null;return t.sessions[t.sessions.length-1];}
function nextTaskId(excludeId){
  var cand=S.tasks.filter(function(t){return t.kind!=='entertainment'&&!isContainer(t)&&t.state!=='done'&&t.state!=='dropped'&&t.id!==excludeId;}).sort(sortTasks);
  return cand.length?cand[0].id:null;
}
function rotateNow(){
  if(S.activeSession){stopTimer();return;}
  var n=nextTaskId(null);if(n)startTimer(n);else render();
}

/* ---------- 碎片 ---------- */
function activeFragment(){if(!S.activeFragmentId)return null;return fragById(S.activeFragmentId);}
function fragById(id){for(var i=0;i<(S.fragments||[]).length;i++){if(S.fragments[i].id===id)return S.fragments[i];}return null;}
function startFragmentExec(title){
  var now=new Date();
  if(S.activeSession){
    if(!Array.isArray(S.activeSession.interruptions))S.activeSession.interruptions=[];
    S.activeSession.interruptions.push({start:now.toISOString(),end:null,reason:'碎片执行'});
  }
  var f={id:uid('f'),title:title||'碎片',createdAt:now.toISOString(),start:now.toISOString(),end:null,estMin:0,context:'general',mode:'execute',state:'running',actualMin:0,dayKey:todayKey()};
  S.fragments.push(f);S.activeFragmentId=f.id;save();render();
}
function stopFragment(){
  var f=activeFragment();if(!f)return;
  var now=new Date();
  f.end=now.toISOString();f.actualMin=Math.max(0,(now-new Date(f.start))/60000);f.state='inbox';
  if(S.activeSession&&Array.isArray(S.activeSession.interruptions)){
    S.activeSession.interruptions.forEach(function(x){if(!x.end)x.end=now.toISOString();});
  }
  S.activeFragmentId=null;save();render();
  pendingFragment=f.id;openFragmentAttrib(f.id);
}
function captureFragment(title,est,context){
  est=Math.max(0,Math.round(est||0));
  if(est<=2){toast('≤2 分钟：直接做掉就好，不用记进队列。','good',[{label:'知道了',act:'dismiss'}]);return;}
  var f={id:uid('f'),title:title||'碎片',createdAt:new Date().toISOString(),start:null,end:null,estMin:est,context:context||'general',mode:'capture',state:'inbox',actualMin:0,dayKey:todayKey()};
  if(settings().lockDeepBlock){f.state='later';ensureDay(todayKey()).laterQueue.push(f.id);toast('深度块锁定中：已静默加入稍后队列。','good',[{label:'知道了',act:'dismiss'}]);}
  else toast('已捕获到碎片收件箱。','good',[{label:'知道了',act:'dismiss'}]);
  S.fragments.push(f);save();render();
}
function fragmentMinutesOn(key){var m=0;(S.fragments||[]).forEach(function(f){if(f.dayKey===key)m+=f.actualMin||0;});return m;}
function fragmentsOn(key){return (S.fragments||[]).filter(function(f){return f.dayKey===key;});}
function laterQueueCount(){var d=ensureDay(todayKey());return (d.laterQueue||[]).filter(function(id){var f=fragById(id);return f&&f.state==='later';}).length;}
function clearLaterQueue(){var d=ensureDay(todayKey());(d.laterQueue||[]).forEach(function(id){var f=fragById(id);if(f&&f.state==='later')f.state='inbox';});d.laterQueue=[];save();}
function aggregateSuggestions(key){
  var frags=(S.fragments||[]).filter(function(f){return f.dayKey===key&&(f.state==='inbox'||f.state==='later');});
  var g=clump(frags,function(f){return f.context||'general';});
  var out=[];
  Object.keys(g).forEach(function(c){if(g[c].length>=2){var total=Math.max(5,Math.round(sum(g[c],function(f){return f.estMin||2;})/5)*5);out.push({context:c,items:g[c],total:total});}});
  return out;
}
function applyBatch(key,context){
  var s=aggregateSuggestions(key).filter(function(x){return x.context===context;})[0];if(!s)return;
  var bid=uid('b');
  s.items.forEach(function(f){f.state='batched';f.batchId=bid;});
  ensureDay(key).plan.push({type:'gap',id:uid('g'),kind:'batch',label:'批处理 · '+context+'（'+s.items.length+' 件）',minutes:s.total,startMin:null});
  toast('已合并成 1 个 '+fmtMin(s.total)+' 的批处理块。','good',[{label:'知道了',act:'dismiss'}]);
  save();render();
}

/* ---------- 布局（轴 B）---------- */
function overlapsBusy(a,b,busy){for(var i=0;i<busy.length;i++){if(a<busy[i].end&&b>busy[i].start)return busy[i];}return null;}
function overlapsAny(a,b,occ){for(var i=0;i<occ.length;i++){if(a<occ[i].end&&b>occ[i].start)return occ[i];}return null;}
function copyBlock(b){var c={};for(var kk in b)c[kk]=b[kk];return c;}
/* 计划块布局：有 startMin 的块按绝对时间落位，其余按队列顺序自动填进空位。
   轴 B 仍然串行：落位时避开硬约束与已放块，重叠则顺延到最近的空档。 */
function layoutPlan(key){
  var len=windowLen(),busy=busySegments(key),plan=ensureDay(key).plan;
  var anchored=[],flow=[],results=new Array(plan.length),occupied=[];
  plan.forEach(function(b,i){if(b.startMin!=null)anchored.push({b:b,i:i});else flow.push({b:b,i:i});});
  function findFree(start,dur){
    var s=Math.max(0,Math.min(start,Math.max(0,len-dur))),guard=0;
    while(guard++<200){
      var hit=overlapsBusy(s,s+dur,busy);
      if(!hit)hit=overlapsAny(s,s+dur,occupied);
      if(!hit)break;
      s=hit.end;
    }
    return Math.max(0,Math.min(s,Math.max(0,len-dur)));
  }
  function put(o,start){
    var c=copyBlock(o.b);
    c._start=start;c._end=start+o.b.minutes;c._idx=o.i;
    results[o.i]=c;occupied.push({start:start,end:start+o.b.minutes});
  }
  anchored.forEach(function(o){put(o,findFree(clampRel(o.b.startMin),o.b.minutes));});
  var cursor=0;
  flow.forEach(function(o){
    var s=findFree(Math.max(cursor,0),o.b.minutes);
    put(o,s);cursor=Math.max(cursor,s+o.b.minutes);
  });
  return {len:len,busy:busy,blocks:results.filter(Boolean)};
}

/* ---------- 指标与睡眠 ---------- */
function circMean(vals){
  if(!vals||!vals.length)return null;
  var x=0,y=0;
  vals.forEach(function(m){var a=m/1440*2*Math.PI;x+=Math.cos(a);y+=Math.sin(a);});
  if(Math.abs(x)<1e-9&&Math.abs(y)<1e-9)return null;
  var ang=Math.atan2(y,x),mm=ang/(2*Math.PI)*1440;
  return ((mm%1440)+1440)%1440;
}
function circStdMin(vals){
  var m=circMean(vals);if(m==null)return null;
  var x=0,y=0;
  vals.forEach(function(v){var a=(v-m)/1440*2*Math.PI;x+=Math.cos(a);y+=Math.sin(a);});
  var R=Math.sqrt(x*x+y*y)/vals.length;
  if(R<=0)return 720;
  return Math.sqrt(-2*Math.log(Math.min(1,R)))/(2*Math.PI)*1440;
}
function sleepRec(key){return (S.sleeps&&S.sleeps[key])||null;}
function sleepDurMin(rec){if(!rec||!rec.bed||!rec.wake)return null;var b=minutesOfDay(rec.bed),w=minutesOfDay(rec.wake);if(w<=b)w+=1440;return w-b;}
function last7Keys(endKey){var out=[];for(var i=6;i>=0;i--)out.push(addDays(endKey,-i));return out;}
function focusMinutesOn(key){
  var deep=0,total=0,longSeg=0;
  S.tasks.forEach(function(t){
    if(t.kind==='entertainment')return;
    (t.sessions||[]).forEach(function(s){
      if(dateKey(new Date(s.start))!==key)return;
      var m=sessionMetrics(s);
      total+=m.active;
      if(m.purity>=0.7){deep+=m.active;if(m.active>=25)longSeg++;}
    });
  });
  if(S.activeSession&&getTask(S.activeSession.taskId)&&getTask(S.activeSession.taskId).kind!=='entertainment'){
    var akey=dateKey(new Date(S.activeSession.start));
    if(akey===key)total+=activeElapsedMs(S.activeSession)/60000;
  }
  return {deep:deep,total:total,longSeg:longSeg};
}
function mediaMinutesOn(key,isRest){
  var t=entTask();if(!t)return 0;var m=0;
  (t.sessions||[]).forEach(function(s){if(!!s.rest!==isRest)return;if(dateKey(new Date(s.start))===key)m+=(new Date(s.end)-new Date(s.start))/60000;});
  if(S.activeSession&&S.activeSession.taskId===ENT_ID&&!!S.activeSession.rest===isRest&&dateKey(new Date(S.activeSession.start))===key)m+=(Date.now()-new Date(S.activeSession.start).getTime())/60000;
  return m;
}
function entMinutesOn(key){return mediaMinutesOn(key,false);}
function restMinutesOn(key){return mediaMinutesOn(key,true);}
function gapMinutesOn(key,kind){
  var d=S.days[key];if(!d||!Array.isArray(d.plan))return 0;var m=0;
  d.plan.forEach(function(b){if(b.type==='gap'&&b.kind===kind)m+=b.minutes||0;});
  return m;
}
function entTagBreakdown(keys){
  var t=entTask();if(!t)return {};
  var o={};
  (t.sessions||[]).forEach(function(s){
    if(s.rest)return;
    if(keys.indexOf(dateKey(new Date(s.start)))<0)return;
    var k=s.entTag||'未分类';
    o[k]=(o[k]||0)+((new Date(s.end)-new Date(s.start))/60000);
  });
  return o;
}
function sleepStats(keys){
  var beds=[],wakes=[],durs=[];
  keys.forEach(function(k){var r=sleepRec(k);if(!r)return;if(r.bed)beds.push(minutesOfDay(r.bed));if(r.wake)wakes.push(minutesOfDay(r.wake));var d2=sleepDurMin(r);if(d2!=null)durs.push(d2);});
  return {n:beds.length,avgBed:circMean(beds),avgWake:circMean(wakes),avgDur:durs.length?sum(durs)/durs.length:null,stdBed:circStdMin(beds),stdWake:circStdMin(wakes),durs:durs};
}
function scoreSleep(keys){
  var st=sleepStats(keys);if(!st.n||st.avgDur==null)return null;
  var target=sleepTargetDur();
  var durScore=Math.max(0,100-Math.abs(st.avgDur-target)/60*12);
  var regScore=st.stdBed==null?70:Math.max(0,100-(st.stdBed/60)*14);
  return Math.round(Math.max(0,Math.min(100,durScore*0.6+regScore*0.4)));
}
function scoreStudy(keys){
  var tot=0,longSeg=0,days=0;
  keys.forEach(function(k){var f=focusMinutesOn(k);if(f.total>0)days++;tot+=f.total;longSeg+=f.longSeg;});
  if(!tot)return null;
  var volScore=Math.min(100,tot/(keys.length*240)*100);
  var longScore=Math.min(100,longSeg/(keys.length*2)*100);
  return Math.round(Math.max(0,Math.min(100,volScore*0.6+longScore*0.4)));
}
function scoreEnt(keys){
  var tot=0,tags={},over=0,limit=+settings().entLimitMin||0;
  keys.forEach(function(k){var m=entMinutesOn(k);tot+=m;if(limit&&m>limit)over++;});
  var bt=entTagBreakdown(keys);Object.keys(bt).forEach(function(t){if(bt[t]>0)tags[t]=1;});
  if(!tot)return {score:null,minutes:0,tags:0,over:0};
  var limitScore=limit?Math.max(0,100-(tot/keys.length)/limit*60):70;
  var divScore=Math.min(100,Object.keys(tags).length*22);
  var overPenalty=over*10;
  return {score:Math.round(Math.max(0,Math.min(100,limitScore*0.6+divScore*0.4-overPenalty))),minutes:tot,tags:Object.keys(tags).length,over:over};
}
function hardHit(){
  var now=Date.now();
  var arr=S.tasks.filter(function(t){return t.deadlineKind==='hard'&&t.deadline&&t.state!=='dropped'&&(t.state==='done'||new Date(t.deadline).getTime()<=now);});
  if(!arr.length)return {rate:null,n:0,hit:0};
  var hit=arr.filter(function(t){return t.state==='done'&&t.completedAt&&new Date(t.completedAt).getTime()<=new Date(t.deadline).getTime();}).length;
  return {rate:hit/arr.length,n:arr.length,hit:hit};
}
function calibration(){
  var r=S.tasks.filter(function(t){return t.state==='done'&&t.estimateMin>0&&t.actualMin>0;}).map(function(t){return t.actualMin/t.estimateMin;}).sort(function(a,b){return a-b;});
  if(!r.length)return {med:null,n:0};
  var m=r.length%2?r[(r.length-1)/2]:(r[r.length/2-1]+r[r.length/2])/2;
  return {med:m,n:r.length};
}
function needsReeval(t){return t.state!=='done'&&t.state!=='dropped'&&!!t.deadline&&new Date(t.deadline).getTime()<Date.now();}
function feasibility(){
  var horizon=7,keys=[];
  for(var i=0;i<horizon;i++)keys.push(addDays(todayKey(),i));
  var avail=0;keys.forEach(function(k){avail+=dayCapacity(k).cap;});
  var end=new Date(parseKey(keys[keys.length-1]).getTime()+86399000);
  var req=0,soft=[];
  S.tasks.forEach(function(t){
    if(t.state==='done'||t.state==='dropped'||t.kind==='entertainment'||isContainer(t))return;
    var rem=Math.max(0,(t.estimateMin||0)-taskActualRollup(t));if(!rem)return;
    if(t.deadline&&new Date(t.deadline)<=end){req+=rem;if(t.deadlineKind!=='hard')soft.push({id:t.id,rem:rem,p:derivePriority(t).p});}
    else if(!t.deadline){req+=rem;soft.push({id:t.id,rem:rem,p:derivePriority(t).p});}
  });
  var overload=req-avail;
  soft.sort(function(a,b){return (prank(b.p)-prank(a.p))||(b.rem-a.rem);});
  var cuts=[],acc=0;
  for(var j=0;j<soft.length&&acc<overload;j++){cuts.push(soft[j]);acc+=soft[j].rem;}
  return {avail:avail,req:req,overload:overload,cuts:cuts,horizon:horizon};
}

/* ---------- 滚动分流 ---------- */
function triageCandidates(){
  var y=addDays(todayKey(),-1),d=S.days[y];if(!d)return [];
  var out=[];
  (d.committed||[]).forEach(function(id){var t=getTask(id);if(t&&t.state!=='done'&&t.state!=='dropped'&&!isContainer(t))out.push(t);});
  return out;
}
function classifyTriage(t){
  var pr=derivePriority(t);
  if(t.deadlineKind==='hard'&&(pr.p==='P0'||pr.p==='P1'))return {route:'tomorrow',rank:0,tone:'red',label:'硬 DDL · 置顶明日'};
  if(pr.p==='P0')return {route:'tomorrow',rank:1,tone:'orange',label:'P0 · 延到明日'};
  if(!t.deadline)return {route:'later',rank:3,tone:'blue',label:'无 DDL · 回稍后池'};
  return {route:'tomorrow',rank:2,tone:'orange',label:'软 DDL · 延到明日'};
}
function applyTriage(){
  var cands=triageCandidates(),tomorrow=addDays(todayKey(),1),day=ensureDay(tomorrow);
  cands.sort(function(a,b){return classifyTriage(a).rank-classifyTriage(b).rank;});
  var pool=S.laterPool||[];
  cands.forEach(function(t){
    var c=classifyTriage(t);
    if(c.route==='later'){
      if(pool.indexOf(t.id)<0)pool.push(t.id);
      removeFromDay(addDays(todayKey(),-1),t.id);
    }else{
      var d2=ensureDay(tomorrow);
      if(!planEntry(tomorrow,t.id)){
        d2.committed.unshift(t.id);
        d2.plan.unshift({type:'task',taskId:t.id,minutes:defaultDaily(t)});
        t.plannedFor=tomorrow;
      }
    }
  });
  S.laterPool=pool;
  S.triageAck[todayKey()]=true;
  toast('已按建议分流 '+cands.length+' 项。','good',[{label:'知道了',act:'dismiss'}]);
  save();render();
}

/* ---------- 像素背景 ---------- */
function pixelSvg(kind){
  var c=[];
  function rect(x,y,w,h,f){c.push('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'"/>');}
  if(kind==='fuji'){
    rect(0,0,64,36,'#0f1730');
    var stars=[[5,3],[12,6],[22,2],[30,5],[41,3],[52,6],[58,2],[16,9],[47,9],[36,7]];
    stars.forEach(function(p){rect(p[0],p[1],1,1,'#39466a');});
    rect(45,6,7,7,'#e2564d');rect(46,5,5,1,'#e2564d');rect(44,7,1,5,'#e2564d');rect(52,7,1,5,'#e2564d');
    for(var y=11;y<=30;y++){var t=(y-11)/19;var hw=Math.round(2+t*23);rect(32-hw,y,hw*2,1,y<16?'#8fa3c8':'#3b4a6b');}
    for(var y2=11;y2<=15;y2++){var t2=(y2-11)/19;var hw2=Math.round(2+t2*23);rect(32-hw2,y2,hw2*2,1,'#e8eefc');}
    rect(29,16,3,2,'#e8eefc');rect(34,16,3,1,'#e8eefc');
    rect(0,31,64,5,'#1b2233');rect(22,32,20,1,'#2b3a5c');
  }else if(kind==='aquarium'){
    rect(0,0,64,11,'#0e3a4d');rect(0,11,64,10,'#0b2f42');rect(0,21,64,10,'#092636');rect(0,31,64,5,'#0a1e2b');
    rect(0,31,64,5,'#3a3222');
    var bub=[[10,28],[11,25],[9,22],[30,29],[31,26],[50,27],[51,24],[19,18],[44,14]];
    bub.forEach(function(p){rect(p[0],p[1],1,1,'#2f6f86');});
    function fish(x,y,f){rect(x,y,4,2,f);rect(x-1,y+1,1,1,f);rect(x+4,y,1,1,f);}
    fish(13,11,'#f2a33c');fish(39,17,'#e2564d');fish(26,7,'#6fd3c7');fish(50,9,'#d98cf0');
    [5,6,7,28,29,30,54,55,56].forEach(function(x){rect(x,24,1,8,'#2f7a5c');rect(x,21,1,3,'#3f9a72');});
    rect(8,33,3,2,'#5a4d33');rect(48,33,4,2,'#5a4d33');
  }else{return 'none';}
  var top=[];
  var base=kind==='fuji'?'#0f1730':'#0e3a4d';
  var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">'
    +'<rect width="64" height="96" fill="'+base+'"/>'
    +top.join('')
    +'<g transform="translate(0,60)">'+c.join('')+'</g>'
    +'</svg>';
  return 'url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
}
function currentBg(){
  var m=/[?&]bg=([a-z]+)/.exec(location.search);
  if(m&&['fuji','aquarium','cream','none'].indexOf(m[1])>=0)return m[1];
  return (settings()&&settings().bg)||'fuji';
}
function renderBg(){
  var kind=currentBg();
  document.documentElement.setAttribute('data-bg',kind);
  var el=$('tpBg');if(!el)return;
  el.style.backgroundImage=pixelSvg(kind);
}

/* ---------- 通用渲染片段 ---------- */
var fragMode='capture';
function pBadge(p){var cls=p==='P0'?'tpP0':p==='P1'?'tpP1':'tpP2';return '<span class="tpTag '+cls+'">'+p+'</span>';}
function kindBadge(k){return k==='hard'?'<span class="tpTag tpP0">硬DDL</span>':'<span class="tpTag">软DDL</span>';}
function stateBadge(st){var map={inbox:'收集箱',todo:'待办',doing:'进行中',blocked:'阻塞',done:'已完成',dropped:'已取消'};var cls=st==='done'?'dshell-badgeDone':(st==='doing'?'dshell-badgeWait':'');return '<span class="dshell-badge '+cls+'">'+(map[st]||st)+'</span>';}
function ddlText(t){
  if(!t.deadline)return '无截止';
  var d=new Date(t.deadline),diff=d.getTime()-Date.now();
  var s=(d.getMonth()+1)+'/'+d.getDate()+' '+pad2(d.getHours())+':'+pad2(d.getMinutes());
  if(diff<0)return '<span class="tpOver">逾期 '+s+'</span>';
  var h=Math.round(diff/3600000);
  return s+(h<48?'（剩'+h+'h）':'（剩'+Math.round(h/24)+'d）');
}
function remainText(t){
  var rem=Math.round((t.estimateMin||0)-(t.actualMin||0));
  if(rem<0)return '<span class="tpOver">超出 '+fmtMin(-rem)+' · 重设预期？</span>';
  return '剩余 '+fmtMin(rem);
}
function taskLine(t,ctx,key){
  key=key||viewDate||todayKey();
  var pr=derivePriority(t);
  var active=S.activeSession&&S.activeSession.taskId===t.id;
  var container=isContainer(t);
  var kids=directChildren(t.id);
  var kidsDone=kids.filter(function(c){return c.state==='done';}).length;
  var entry=planEntry(key,t.id);
  var dailyMin=entry?entry.minutes:defaultDaily(t);
  var day=ensureDay(key);
  var done=!!day.dailyDone[t.id];
  var act=taskActualOn(t.id,key);
  var total=taskActualRollup(t);
  var rem=Math.round((t.estimateMin||0)-total);
  var over=rem<0&&(t.estimateMin||0)>0;
  var h='<div class="tpLine" data-id="'+t.id+'">';
  h+='<div class="tpRow" style="flex:none">'+pBadge(pr.p)+kindBadge(t.deadlineKind)+(container?'<span class="tpTag tpGold">容器</span>':'')+'</div>';
  h+='<div class="tpGrow">';
  h+='<div class="tpEllip" style="font-weight:600">'+(done?'✓ ':'')+esc(t.title)+(t.parentId?(getTask(t.parentId)?' <span class="tpSmall">↳ 子任务</span>':' <span class="tpTag tpP1">父任务缺失</span>'):'')+'</div>';
  h+='<div class="tpSmall tpEllip">'+ddlText(t)+' · 总预估 '+fmtMin(t.estimateMin)+' · 累计 '+fmtMin(total)+(container?'（含子任务）':'')+(t.distractedMin?' · 低专注'+fmtMin(t.distractedMin):'')+'</div>';
  h+='<div class="tpSmall tpEllip">'+(over?'<span class="tpOver">超出 '+fmtMin(-rem)+' · 重设预期？</span>':'剩余 '+fmtMin(rem))+' · 今日实际 '+fmtMin(act)+' · '+esc(pr.reason)+'</div>';
  if(container)h+='<div class="tpSmall tpGold">容器 · 子任务 '+kidsDone+'/'+kids.length+' 完成 · 不可开始 / 不可加入今日</div>';
  if(container&&t.state==='done'&&!allDescendantsDone(t.id))h+='<div class="tpSmall tpOver">⚠ 历史完成，但仍有子任务未完成</div>';
  if(ctx==='today'&&!container){
    h+='<div class="tpRow" style="margin-top:4px"><span class="tpSmall">今日可用</span>';
    h+='<input class="tpInp tpDaily" data-id="'+t.id+'" type="number" min="0" step="15" value="'+dailyMin+'" style="max-width:88px" />';
    h+='<span class="tpSmall">min</span>';
    var pu=taskPurityOn(t.id,key);
    if(pu)h+='<span class="tpSmall tpGold">综合 '+Math.round(pu.purity*100)+'%（自评 '+Math.round(pu.self*100)+' / 真实 '+Math.round(pu.real*100)+'）</span>';
    h+='</div>';
  }
  h+='</div>';
  h+='<div class="tpRow" style="flex:none;justify-content:flex-end">'+stateBadge(t.state);
  if(t.state!=='done'&&t.state!=='dropped'){
    if(!container&&ctx==='today')h+='<button class="dshell-btn '+(active?'dshell-btnDanger':'')+' tpBtn" data-act="'+(active?'stop':'start')+'" data-id="'+t.id+'">'+(active?'■ 停止':'▶ 开始')+'</button>';
    if(ctx==='all'&&!container)h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="addday" data-id="'+t.id+'">加入今日</button>';
    if(ctx==='today'){
      if(!container){
        if(!done)h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="dailyDone" data-id="'+t.id+'">日收工</button>';
        else h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="undoDailyDone" data-id="'+t.id+'">撤销收工</button>';
      }
      h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="rmday" data-id="'+t.id+'">移出</button>';
    }
    var canDone=!container||allDescendantsDone(t.id);
    h+='<button class="dshell-btn tpBtn" data-act="taskDone" data-id="'+t.id+'" style="font-weight:700"'+(canDone?'':' disabled title="子任务未全部完成，不能标记父任务完成"')+'>整体完成</button>';
  }
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="edit" data-id="'+t.id+'">编辑</button>';
  h+='</div></div>';
  return h;
}

/* ---------- 时间轴渲染 ---------- */
function pctOf(m,len){return Math.max(0,Math.min(100,m/len*100));}
function sessionActiveSegments(s){
  var start=new Date(s.start).getTime(),end=new Date(s.end).getTime();
  if(!(end>start))return [];
  var gaps=[];
  (s.pauses||[]).forEach(function(p){if(p&&p.start)gaps.push({start:new Date(p.start).getTime(),end:p.end?new Date(p.end).getTime():end});});
  (s.interruptions||[]).forEach(function(p){if(p&&p.start)gaps.push({start:new Date(p.start).getTime(),end:p.end?new Date(p.end).getTime():end});});
  gaps=gaps.filter(function(g){return g.end>g.start;}).sort(function(a,b){return a.start-b.start;});
  var segs=[],cur=start;
  gaps.forEach(function(g){
    var gs=Math.max(start,g.start),ge=Math.min(end,g.end);
    if(ge<=cur)return;
    if(gs>cur)segs.push({start:cur,end:Math.min(gs,end)});
    cur=Math.max(cur,ge);
  });
  if(cur<end)segs.push({start:cur,end:end});
  return segs;
}
function actualBlocksFor(key){
  var out=[];
  S.tasks.forEach(function(t){
    (t.sessions||[]).forEach(function(s){
      if(dateKey(new Date(s.start))!==key)return;
      var isEnt=t.kind==='entertainment';
      var kind=isEnt?(s.rest?'rest':'ent'):'task';
      var label=isEnt?(s.rest?'休息':(s.entTag||'娱乐')):t.title;
      sessionActiveSegments(s).forEach(function(g){out.push({start:g.start,end:g.end,kind:kind,label:label,task:t,live:false});});
    });
  });
  if(S.activeSession&&dateKey(new Date(S.activeSession.start))===key){
    var a=S.activeSession,t=getTask(a.taskId);
    var tmp={start:a.start,end:new Date().toISOString(),pauses:a.pauses||[],interruptions:a.interruptions||[]};
    var isEnt=a.taskId===ENT_ID;
    var kind=isEnt?(a.rest?'rest':'ent'):'task';
    var label=isEnt?(a.rest?'休息':(a.entTag||'娱乐')):(t?t.title:'进行中');
    sessionActiveSegments(tmp).forEach(function(g){out.push({start:g.start,end:g.end,kind:kind,label:label,task:t,live:true});});
  }
  return out.sort(function(a,b){return a.start-b.start;});
}
function renderTimeline(key){
  var lay=layoutPlan(key),len=lay.len;
  var pc=function(m){return pctOf(m,len).toFixed(3);};
  var h='<div class="tpTimelineWrap"><div class="tpTimeline tpTwoLane" id="tpTimeline" data-key="'+key+'">';
  var step=len>960?120:60;
  h+='<div class="tpGridLines">';
  for(var r=0;r<=len;r+=step){
    var lstyle=(r===0)?'left:0;transform:none':(r>=len?'left:auto;right:0;transform:none':'');
    h+='<i style="left:'+pc(r)+'%"></i><span style="left:'+pc(r)+'%;'+lstyle+'">'+relToClock(r)+'</span>';
  }
  h+='</div>';
  h+='<div class="tpLaneDivider"></div>';
  lay.busy.forEach(function(g){h+='<div class="tpBusy" style="left:'+pc(g.start)+'%;width:'+pc(g.end-g.start)+'%"><div class="tpBusyLabel">🔒 '+esc(g.title)+'</div></div>';});
  lay.blocks.forEach(function(b){
    var left=pc(b._start),w=pc(b.minutes),bi=b._idx;
    if(b.type==='task'){
      var t=getTask(b.taskId);if(!t)return;
      var isEnt=t.kind==='entertainment';
      var act=taskActualOn(b.taskId,key);
      var done=!!ensureDay(key).dailyDone[b.taskId];
      var selT=selectedKey===('t:'+b.taskId);
      h+='<div class="tpBlock tpBlockPlan'+(isEnt?' tpKindEnt':'')+(done?' tpBlockDone':'')+(selT?' tpSelected':'')+'" data-bi="'+bi+'" data-tid="'+esc(t.id)+'" data-type="task" title="理想 · '+esc(t.title)+' · 计划 '+fmtMin(b.minutes)+' · 实际 '+fmtMin(act)+'" style="left:'+left+'%;width:'+w+'%">';
      h+='<div class="tpBlockTitle">'+(done?'✓ ':'')+esc(t.title)+'</div>';
      h+='<div class="tpBlockMeta">计划 '+fmtMin(b.minutes)+(b.startMin!=null?' · 已定位':'')+'</div>';
      if(b.startMin!=null)h+='<span class="tpAuto" data-act="blockAuto" data-id="'+esc(t.id)+'" title="恢复自动排">↺</span>';
      h+='</div>';
    }else{
      var selG=selectedKey===('g:'+b.id);
      h+='<div class="tpBlock tpGap'+(b.kind==='ent'?' tpKindEnt':'')+(b.kind==='batch'?' tpKindBatch':'')+(selG?' tpSelected':'')+'" data-bi="'+bi+'" data-gid="'+esc(b.id)+'" data-type="gap" title="'+esc(b.label||'空隙')+' · '+fmtMin(b.minutes)+' · '+relToClock(b._start)+'–'+relToClock(b._end)+'" style="left:'+left+'%;width:'+w+'%">';
      h+='<div class="tpBlockTitle">'+esc(b.label||(b.kind==='rest'?'休息':b.kind==='ent'?'娱乐':'空隙'))+'</div>';
      h+='<div class="tpBlockMeta">'+fmtMin(b.minutes)+' · '+relToClock(b._start)+'–'+relToClock(b._end)+'</div>';
      h+='<span class="tpDel" data-act="gapDelete" data-id="'+esc(b.id)+'" title="删除">×</span>';
      h+='<span class="tpResizeL" title="拖动改开始"></span><span class="tpResizeR" title="拖动改长度"></span>';
      h+='</div>';
    }
  });
  actualBlocksFor(key).forEach(function(g){
    var a=relMin(new Date(g.start)),b=relMin(new Date(g.end));
    if(b<=a)b=a+(g.end-g.start)/60000;
    var s=clampRel(a),e=clampRel(b);
    if(e<=s)return;
    var plan=g.task?planEntry(key,g.task.id):null;
    var over=plan&&g.kind==='task'&&taskActualOn(g.task.id,key)>plan.minutes;
    var cls=g.kind==='rest'?'tpActRest':g.kind==='ent'?'tpActEnt':'tpActTask';
    h+='<div class="tpActualBlock '+cls+(over?' tpActOver':'')+(g.live?' tpLive':'')+'" data-actual="1" style="left:'+pc(s)+'%;width:'+pc(e-s)+'%" title="实际 · '+esc(g.label)+' · '+relToClock(a)+'–'+relToClock(b)+'">';
    h+='<div class="tpActualTitle">'+esc(g.label)+'</div>';
    h+='<div class="tpActualMeta">'+relToClock(a)+'–'+relToClock(b)+'</div>';
    h+='</div>';
  });
  if(key===todayKey()){var nr=nowRel();if(nr>=0&&nr<=len){h+='<div class="tpNow" style="left:'+pc(nr)+'%"></div><div class="tpNowTag" style="left:'+pc(nr)+'%">'+relToClock(nr)+'</div>';}}
  h+='</div><div class="tpSmall" style="margin-top:4px">上：理想轴（可拖 / 拉边缘改长度 / 双击编辑） · 下：实际轴（按计时生成，暂停处留空档）</div></div>';
  return h;
}

/* ---------- 今日视图 ---------- */
function renderToday(){
  var key=viewDate,tk=todayKey(),d=parseKey(key),cap=dayCapacity(key),day=ensureDay(key);
  var h='';

  /* 思绪寄存 */
  var actT=S.activeSession?getTask(S.activeSession.taskId):null;
  var pausedNow=!!(S.activeSession&&isPaused(S.activeSession));
  var inboxN=(S.thoughts||[]).filter(function(x){return x.state==='inbox';}).length;
  h+='<div class="dshell-card tpCardTight" style="border-color:rgba(139,92,246,.5)">';
  h+='<div class="tpBetween"><strong>🧠 思绪寄存</strong><span class="tpSmall">记录一条 = 分心一次 · 专注 −2min</span></div>';
  h+='<div class="tpSmall" style="margin-top:4px">想到什么先寄存，不切换任务。'+(actT?('当前记到：<b>'+esc(actT.title)+'</b>'+(pausedNow?'（已暂停，本次不扣专注）':'（本次 −2min）')):'当前没有进行中的任务，本次不扣专注')+'</div>';
  h+='<div class="tpRow" style="margin-top:8px"><button class="dshell-btn tpBigBtn" data-act="thoughtNew">＋ 寄存一条思绪</button>';
  h+='<span class="tpSmall">待处理 <b>'+inboxN+'</b> 条 · 收件箱在「全部任务」页</span></div>';
  h+='</div>';

  /* 专注度曲线（今日） */
  h+=renderFocusCurveCard(key);

  /* 时间轴 */
  h+='<div class="dshell-card">';
  h+='<div class="tpBetween"><div class="tpRow"><strong>🧭 时间轴</strong>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="navday" data-d="-1">‹</button>';
  h+='<strong>'+d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+' '+WEEK[d.getDay()]+'</strong>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="navday" data-d="1">›</button>';
  if(key!==tk)h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="navday" data-d="0">回到今天</button>';
  else h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="navday" data-d="1">为明天排计划</button>';
  h+='</div><div class="tpRow">';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="addGap" data-kind="rest">＋休息</button>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="addGap" data-kind="ent">＋娱乐</button>';
  h+='</div></div>';
  h+='<div class="tpSmall" style="margin-top:4px">窗口 '+esc(settings().targetWake)+' → 次日 '+esc(settings().targetSleep)+'（'+fmtMin(cap.win)+'）· 灰色为飞书硬约束（只读）· 上理想 / 下实际</div>';
  h+=renderTimeline(key);
  var pct=cap.cap>0?Math.min(100,Math.round(cap.planned/cap.cap*100)):0;
  var over=cap.free<0;
  h+='<div class="tpBar" style="margin-top:8px"><i style="width:'+pct+'%;background:'+(over?'#f85149':'#3fb950')+'"></i></div>';
  h+='<div class="tpSmall" style="margin-top:4px">已排 '+fmtMin(cap.planned)+' / 可用 '+fmtMin(cap.cap)+' · '+(over?'<span class="tpOver">超出 '+fmtMin(-cap.free)+'</span>':'剩余 '+fmtMin(cap.free))+' · 固定占用 '+fmtMin(cap.overhead)+'</div>';
  h+='</div>';

  /* 第一个任务 */
  h+=renderFirstTask(key);

  /* 早间分流 */
  var tri=(key===tk)?TriageCard():'';
  if(tri)h+=tri;

  /* 日任务 */
  var committed=(day.committed||[]).map(getTask).filter(Boolean);
  var todo=committed.filter(function(t){return t.state!=='done'&&t.state!=='dropped'&&!isContainer(t);}).sort(sortTasks);
  h+='<div class="dshell-card"><div class="tpBetween"><strong>📋 日任务（'+committed.length+'）</strong><div class="tpRow">';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="rotate">'+(S.activeSession?'■ 停止当前':'⇄ 轮换下一个')+'</button>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="picker">＋ 加入</button></div></div>';
  h+='<div class="tpLockWrap">';
  if(!committed.length)h+='<p class="dshell-sub" style="margin:8px 0 0">还没有安排。点「加入今日」按优先级挑选，超预算会被挡下。</p>';
  else{
    var nowT=todo[0];
    if(nowT)h+='<div class="tpLine" style="margin-top:8px;border-color:rgba(79,142,247,.5)"><div class="tpGrow"><div class="tpSmall">现在做</div><div class="tpEllip" style="font-weight:700">'+esc(nowT.title)+'</div></div>'+pBadge(derivePriority(nowT).p)+'</div>';
    committed.slice().sort(sortTasks).forEach(function(t){h+=taskLine(t,'today',key);});
  }
  if(S.activeSession){
    var isP=isPaused(S.activeSession);
    var isRestNow=!!S.activeSession.rest,isEntNow=S.activeSession.taskId===ENT_ID&&!isRestNow;
    var lkTitle=isP?'已暂停 · 其他任务仍锁定':(isRestNow?'休息计时中 · 先停止休息':(isEntNow?'娱乐计时中 · 先停止娱乐':'任务进行中 · 其他任务已锁定'));
    var lkHint=isP?'继续或停止当前任务后解锁':(isRestNow?'用上方计时条停止休息后再开始任务':(isEntNow?'用上方计时条停止娱乐后再开始任务':'用上方计时条暂停 / 停止后再切换'));
    h+='<div class="tpLockOverlay"><div class="tpLockIcon">'+(isP?'⏸':'🔒')+'</div><div class="tpLockTitle">'+lkTitle+'</div><div class="tpSmall">'+lkHint+'</div></div>';
  }
  h+='</div></div>';

  /* 娱乐 */
  h+=renderEntertainment(key);

  /* 睡眠 */
  h+=renderSleepCard(key);

  /* 排期体检 */
  var fz=feasibility();
  if(fz.overload>0&&fz.cuts.length){
    h+='<div class="dshell-card" style="border-color:rgba(210,153,34,.55)"><strong class="tpWarn">排期体检：未来 '+fz.horizon+' 天超载 '+fmtMin(fz.overload)+'</strong>';
    h+='<div class="tpSmall" style="margin-top:4px">可用 '+fmtMin(fz.avail)+'，必做 '+fmtMin(fz.req)+'。硬 ddl 优先，下面这些软性任务建议淘汰或延后：</div>';
    fz.cuts.forEach(function(c){var ct=getTask(c.id);if(!ct)return;
      h+='<div class="tpLine" style="margin-top:6px"><div class="tpGrow tpEllip">'+pBadge(derivePriority(ct).p)+' '+esc(ct.title)+' · 还需 '+fmtMin(c.rem)+'</div><div class="tpRow"><button class="dshell-btn dshell-btnDanger tpBtn" data-act="cutDrop" data-id="'+c.id+'">取消</button><button class="dshell-btn dshell-btnGhost tpBtn" data-act="cutDefer" data-id="'+c.id+'">延后7天</button></div></div>';
    });
    h+='</div>';
  }

  /* 稍后池 */
  if((S.laterPool||[]).length){
    h+='<div class="dshell-card"><strong>🕐 稍后池（'+S.laterPool.length+'）</strong><div class="tpSmall">无 DDL 的学习类不占明天队首，有空再捞。</div>';
    S.laterPool.forEach(function(id){var t=getTask(id);if(!t)return;h+='<div class="tpLine" style="margin-top:6px"><div class="tpGrow tpEllip">'+esc(t.title)+'</div><div class="tpRow"><button class="dshell-btn dshell-btnGhost tpBtn" data-act="poolPick" data-id="'+id+'">捞回今日</button><button class="dshell-btn dshell-btnGhost tpBtn" data-act="poolRemove" data-id="'+id+'">移除</button></div></div>';});
    h+='</div>';
  }

  /* 飞书日程 */
  var evs=eventsForDay(key);
  h+='<div class="dshell-card"><strong>🗓 飞书硬约束（'+evs.length+'）</strong><span class="tpSmall"> 轴 A · 只读</span>';
  if(!evs.length)h+='<p class="dshell-sub" style="margin:8px 0 0">无固定日程（或日历数据未刷新）。</p>';
  else{h+='<div style="margin-top:8px">';evs.forEach(function(e){var s=new Date(e.start),t2=new Date(e.end);h+='<div class="dshell-listItem"><span class="dshell-listItemTitle">'+esc(e.summary||'(无标题)')+'</span><span class="dshell-listItemMeta">'+pad2(s.getHours())+':'+pad2(s.getMinutes())+'–'+pad2(t2.getHours())+':'+pad2(t2.getMinutes())+'</span></div>';});h+='</div>';}
  h+='<div class="tpRow" style="margin-top:8px;justify-content:space-between"><span class="tpSmall">数据源：'+esc(CAL.updatedAt||'未刷新')+'</span><button class="dshell-btn dshell-btnGhost tpBtn" data-act="refreshCal">⟳ 刷新飞书日历</button></div></div>';
  return h;
}

function renderFocusCurveCard(key){
  var h='<div class="dshell-card"><div class="tpBetween"><strong>🎯 专注度曲线</strong><span class="tpSmall">自评 50% + 真实 50% · 跟随日期</span></div>';
  h+=renderAttentionCurve(key);
  h+='<div class="tpLegend"><span><i style="background:linear-gradient(90deg,#f7e7a1,#e3b341,#b8860b)"></i>金色 · 实际专注度（流淌）</span><span><i style="background:transparent;border-top:1px dashed var(--tpTarget,rgba(255,255,255,.3));height:0"></i>虚线 · 理想目标</span></div>';
  var kp=curveKeyPoints(key);
  h+='<div class="tpGrid2" style="margin-top:10px">';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">最长高纯度段</div><div class="dshell-statValue">'+fmtMin(kp.longest)+'</div><div class="tpSmall">综合纯度 ≥70% 的最长一段</div></div>';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">首任务启动</div><div class="dshell-statValue">'+(kp.first==null?'—':relToClock(kp.first))+'</div><div class="tpSmall">当天第一次开始计时</div></div>';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">睡前投入</div><div class="dshell-statValue">'+fmtMin(kp.preSleep)+'</div><div class="tpSmall">睡前 3 小时内的活跃时长</div></div>';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">思绪打断</div><div class="dshell-statValue">'+kp.thoughts+'</div><div class="tpSmall">每条 −2min 专注</div></div>';
  h+='</div></div>';
  return h;
}
function thoughtCard(t,archived){
  var pen=!!(t.duringTaskId&&!t.duringPaused);
  var h='<div class="tpThought"><div class="tpRow" style="justify-content:space-between"><div class="tpThoughtTitle tpEllip">'+esc(t.title)+'</div><span class="tpSmall">'+esc((t.createdAt||'').slice(0,16).replace('T',' '))+'</span></div>';
  if(t.description)h+='<div class="tpThoughtDesc">'+esc(t.description)+'</div>';
  h+='<div class="tpRow" style="margin-top:5px">';
  if(pen)h+='<span class="tpTag tpP0">−2min 专注</span>';
  if(t.state==='converted')h+='<span class="tpTag tpP2">已转任务</span>';
  if(t.state==='done')h+='<span class="tpTag">已完成</span>';
  if(t.state==='inbox'){
    h+='<button class="dshell-btn tpBtn" data-act="thoughtConvert" data-id="'+t.id+'">归位新任务</button>';
    h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="thoughtEdit" data-id="'+t.id+'">编辑</button>';
    h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="thoughtDone" data-id="'+t.id+'">完成</button>';
    h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="thoughtDelete" data-id="'+t.id+'">删除</button>';
  }else{
    h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="thoughtEdit" data-id="'+t.id+'">编辑</button>';
    if(t.convertedTaskId&&getTask(t.convertedTaskId))h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="openTask" data-id="'+t.convertedTaskId+'">打开任务</button>';
    h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="thoughtDelete" data-id="'+t.id+'">删除</button>';
  }
  h+='</div></div>';
  return h;
}
function renderThoughtInbox(){
  var all=S.thoughts||[];
  var inbox=all.filter(function(x){return x.state==='inbox';}).sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});
  var archived=all.filter(function(x){return x.state!=='inbox';}).sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});
  var h='<div class="dshell-card"><div class="tpBetween"><strong>🧠 思绪收件箱（'+inbox.length+'）</strong><button class="dshell-btn tpBtn" data-act="thoughtNew">＋ 寄存</button></div>';
  h+='<div class="tpSmall">记录一条 = 分心一次 · 专注 −2min。这里只收「先记下来、不立刻做」的念头。</div>';
  if(!inbox.length)h+='<p class="dshell-sub" style="margin:8px 0 0">收件箱空了。</p>';
  else inbox.forEach(function(t){h+=thoughtCard(t,false);});
  if(archived.length)h+='<details style="margin-top:10px"><summary class="tpSmall">已归位 / 已完成（'+archived.length+'）</summary>'+archived.map(function(t){return thoughtCard(t,true);}).join('')+'</details>';
  h+='</div>';
  return h;
}
function renderFirstTask(key){
  var day=ensureDay(key),ft=day.firstTaskId?getTask(day.firstTaskId):null;
  var committed=(day.committed||[]).map(getTask).filter(function(t){return t&&!isContainer(t)&&t.state!=='done'&&t.state!=='dropped';});
  var h='<div class="dshell-card tpCardTight" style="border-color:rgba(79,142,247,.5)"><div class="tpBetween"><strong>🌅 第一个任务</strong>';
  if(ft)h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="clearfirst">清除</button>';
  h+='</div>';
  if(!ft){
    h+='<div class="tpSmall" style="margin-top:6px">还没定（建议前一晚定）。标准：最重要、且能在 15 分钟内出现第一个物理动作。</div>';
    if(committed.length){h+='<div class="tpRow" style="margin-top:6px;flex-wrap:wrap">';committed.forEach(function(t){h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="setfirst" data-id="'+t.id+'">'+esc(t.title)+'</button>';});h+='</div>';}
  }else{
    var fStart=firstStartMinOf(key);
    var wakeM=sleepRec(key)&&sleepRec(key).wake?minutesOfDay(sleepRec(key).wake):minutesOfDay(settings().targetWake);
    var lat=fStart===null?null:(fStart>=wakeM?fStart-wakeM:fStart+1440-wakeM);
    h+='<div class="tpRow" style="justify-content:space-between;margin-top:6px"><strong class="tpEllip">'+esc(ft.title)+'</strong>'+pBadge(derivePriority(ft).p)+'</div>';
    h+='<div class="tpSmall">'+ddlText(ft)+' · 还需 '+fmtMin(Math.max(0,(ft.estimateMin||0)-taskActualRollup(ft)))+'</div>';
    if(lat!==null)h+='<div class="tpSmall" style="margin-top:4px">起床 → 启动：<strong'+(lat>90?' class="tpOver"':'')+'>'+fmtMin(lat)+'</strong>'+(lat>90?'（偏晚，先做 15 分钟的启动动作）':'')+'</div>';
    else h+='<div class="tpSmall tpOver" style="margin-top:4px">今日还没启动这个任务</div>';
    h+='<div class="tpRow" style="margin-top:6px">';
    if(S.activeSession&&S.activeSession.taskId===ft.id)h+='<button class="dshell-btn dshell-btnDanger tpBtn" data-act="stop">■ 停止并记录</button>';
    else if(S.activeSession)h+='<button class="dshell-btn tpBtn" disabled title="先停止当前计时">▶ 开始</button>';
    else h+='<button class="dshell-btn tpBtn" data-act="start" data-id="'+ft.id+'">▶ 开始</button>';
    h+='</div>';
  }
  h+='</div>';
  return h;
}
function TriageCard(){
  if(S.triageAck[todayKey()])return '';
  var cands=triageCandidates();if(!cands.length)return '';
  var hard=0,soft=0,pool=0;
  cands.forEach(function(t){var c=classifyTriage(t);if(c.route==='later')pool++;else if(c.tone==='red')hard++;else soft++;});
  var h='<div class="dshell-card tpCardTight" style="border-color:rgba(210,153,34,.55)">';
  h+='<div class="tpBetween"><strong class="tpWarn">🌅 早间 1 分钟分流</strong><span class="tpSmall">昨天未完成 '+cands.length+' 项</span></div>';
  h+='<div class="tpSmall" style="margin-top:4px">'
    +(hard?'<span class="tpOver">'+hard+' 硬 ddl 已置顶明日</span> · ':'')
    +(soft?soft+' 项延到明日 · ':'')
    +(pool?pool+' 项 P2 回稍后池 · ':'')+'扫一眼确认即可。</div>';
  h+='<div style="margin-top:6px">';
  cands.forEach(function(t){var c=classifyTriage(t);
    h+='<div class="tpLine" style="margin-top:5px"><div class="tpGrow tpEllip">'+esc(t.title)+'</div><span class="tpTag '+(c.tone==='red'?'tpP0':c.tone==='orange'?'tpP1':'tpP2')+'">'+esc(c.label)+'</span></div>';
  });
  h+='</div><div class="tpRow" style="margin-top:8px"><button class="dshell-btn tpBtn" data-act="triageApply">按建议处理</button><button class="dshell-btn dshell-btnGhost tpBtn" data-act="triageLater">稍后再说</button><button class="dshell-btn dshell-btnGhost tpBtn" data-act="triageEdit">逐项调整</button></div>';
  h+='</div>';
  return h;
}

function renderEntertainment(key){
  var ent=ensureEntertainment();
  var entToday=entMinutesOn(key),restToday=restMinutesOn(key);
  var entPlan=gapMinutesOn(key,'ent'),restPlan=gapMinutesOn(key,'rest');
  var active=S.activeSession&&S.activeSession.taskId===ENT_ID;
  var locked=!!S.activeSession;
  var activeRest=!!(active&&S.activeSession.rest),activeEnt=!!(active&&!activeRest);
  var tags=settings().entTags||[],bt=entTagBreakdown([key]),lim=+settings().entLimitMin||0;
  var h='<div class="dshell-card"><div class="tpBetween"><strong>🎮 娱乐 / 🧘 休息</strong><span class="tpSmall">分开统计 · 休息无上限 · 同一条时间轴不同颜色</span></div>';
  /* 娱乐 */
  h+='<div class="tpMediaRow">';
  h+='<div class="tpMediaHead"><span class="tpDotGold"></span><b>娱乐</b><span class="tpSmall">计划 '+fmtMin(entPlan)+'（时间轴块）</span><span class="tpGrow"></span><span class="tpMediaVal">'+fmtMin(entToday)+'</span><span class="tpSmall">实际</span></div>';
  var entScale=lim>0?lim:Math.max(60,entPlan,entToday);
  var eo=lim>0&&entToday>lim;
  h+='<div class="tpBar" style="margin-top:5px"><i style="width:'+Math.min(100,Math.round(entToday/entScale*100))+'%;background:'+(eo?'#f85149':'#d29922')+'"></i><span class="tpPlanMark" style="left:'+Math.min(100,Math.round(entPlan/entScale*100))+'%" title="计划 '+fmtMin(entPlan)+'"></span></div>';
  if(lim>0)h+='<div class="tpSmall" style="margin-top:3px">'+(eo?'<span class="tpOver">已超上限 '+fmtMin(entToday-lim)+'</span>':'上限 '+fmtMin(lim)+'，剩余 '+fmtMin(lim-entToday))+' · 竖线为时间轴计划</div>';
  else h+='<div class="tpSmall" style="margin-top:3px">未设上限 · 竖线为时间轴计划</div>';
  var bk=Object.keys(bt);if(bk.length){h+='<div class="tpRow" style="margin-top:6px">';bk.forEach(function(t){h+='<span class="tpTag tpP2">'+esc(t)+' '+fmtMin(bt[t])+'</span>';});h+='</div>';}
  h+='<div class="tpRow" style="margin-top:7px">';
  if(activeEnt)h+='<button class="dshell-btn dshell-btnDanger tpBtn" data-act="stop">■ 停止娱乐</button>';
  else if(locked)h+='<button class="dshell-btn tpBtn" disabled title="任务进行中，先停止当前任务">▶ 开始娱乐</button>';
  else h+='<button class="dshell-btn tpBtn" data-act="entStart">▶ 开始娱乐</button>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="manual" data-id="'+ENT_ID+'">补录</button></div></div>';
  /* 休息 */
  h+='<div class="tpMediaRow" style="margin-top:10px;border-top:1px solid var(--dsw-alias-border-l1,#262b36);padding-top:10px">';
  h+='<div class="tpMediaHead"><span class="tpDotPurple"></span><b>休息</b><span class="tpSmall">计划 '+fmtMin(restPlan)+'（时间轴块）</span><span class="tpGrow"></span><span class="tpMediaVal">'+fmtMin(restToday)+'</span><span class="tpSmall">实际</span></div>';
  var restMax=Math.max(60,restPlan,restToday);
  h+='<div class="tpBar" style="margin-top:5px"><i style="width:'+Math.round(restToday/restMax*100)+'%;background:#8b5cf6"></i><span class="tpPlanMark" style="left:'+Math.round(restPlan/restMax*100)+'%" title="计划 '+fmtMin(restPlan)+'"></span></div>';
  h+='<div class="tpSmall" style="margin-top:3px">无上限 · 发呆/思考/不摄入信息，用来恢复注意力 · 竖线为时间轴计划</div>';
  h+='<div class="tpRow" style="margin-top:7px">';
  if(activeRest)h+='<button class="dshell-btn dshell-btnDanger tpBtn" data-act="stop">■ 停止休息</button>';
  else if(locked)h+='<button class="dshell-btn tpBtn" disabled title="任务进行中，先停止当前任务" style="background:#8b5cf6">▶ 开始休息</button>';
  else h+='<button class="dshell-btn tpBtn" data-act="restStart" style="background:#8b5cf6">▶ 开始休息</button>';
  h+='</div></div>';
  h+='<div class="tpSmall" style="margin-top:8px">娱乐标签：'+tags.map(function(t){return esc(t);}).join(' · ')+'（设置页可增删）· 休息不参与标签与上限</div>';
  h+='</div>';
  return h;
}
function renderSleepCard(key){
  var sl=sleepRec(key),dur=sleepDurMin(sl);
  var keys=last7Keys(key),recs=keys.map(sleepRec).filter(Boolean);
  var st=sleepStats(keys);
  var target=sleepTargetDur();
  var h='<div class="dshell-card tpCardTight"><div class="tpBetween"><strong>😴 睡眠</strong><button class="dshell-btn dshell-btnGhost tpBtn" data-act="sleepEdit" data-d="'+key+'">记录/编辑</button></div>';
  if(!sl)h+='<div class="tpSmall" style="margin-top:6px">还没有记录「'+key+'」这一觉（按醒来的日期记）。</div>';
  else{
    var dBed=null,dWake=null;
    h+='<div class="tpRow" style="margin-top:6px"><span style="font-size:24px;font-weight:700">'+(dur==null?'—':Math.floor(dur/60)+'h'+pad2(dur%60))+'</span><span class="tpSmall">'+esc(sl.bed)+' → '+esc(sl.wake)+'</span>';
    h+=Math.abs(dur-target)>=5?'<span class="tpSmall '+(dur<target?'tpOver':'')+'">'+(dur<target?'少睡 '+fmtMin(target-dur):'多睡 '+fmtMin(dur-target))+'</span>':'<span class="tpSmall tpOk">时长达标</span>';
    h+='</div>';
  }
  if(recs.length){
    h+='<div class="tpRow" style="margin-top:8px;align-items:flex-start;gap:12px">';
    h+='<div style="flex:none;min-width:108px"><div class="tpSmall">近7天平均</div><div style="font-variant-numeric:tabular-nums">'+(st.avgBed==null?'—':'入睡 '+fmtHM(st.avgBed))+'</div><div style="font-variant-numeric:tabular-nums">'+(st.avgWake==null?'—':'起床 '+fmtHM(st.avgWake))+'</div><div class="tpSmall">时长 '+(st.avgDur==null?'—':fmtMin(st.avgDur))+'</div></div>';
    var maxDur=1;keys.forEach(function(k){var r=sleepRec(k);var v=r?Math.round(sleepDurMin(r)||0):0;if(v>maxDur)maxDur=v;});
    h+='<div class="tpChart tpGrow" style="height:96px">';
    keys.forEach(function(k){var r=sleepRec(k);var v=r?Math.round(sleepDurMin(r)||0):0;h+='<div class="tpCol"><div class="tpAxis">'+(v?Math.floor(v/60)+'h':'')+'</div><div class="tpColBar" style="height:'+Math.max(2,Math.round(v/maxDur*100))+'%;background:#8b5cf6"></div><div class="tpAxis">'+k.slice(5)+'</div></div>';});
    h+='</div></div>';
    h+='<div class="tpSmall" style="margin-top:4px">'+recs.length+'/7 天有记录 · 入睡波动 '+(st.stdBed==null?'—':fmtMin(st.stdBed))+' · 起床波动 '+(st.stdWake==null?'—':fmtMin(st.stdWake))+'（圆形平均，已修正跨午夜）</div>';
  }
  h+='</div>';
  return h;
}

/* ---------- 全部任务 ---------- */
var filterState='active',filterKind='all',filterQ='';
function renderAll(){
  var h=renderThoughtInbox();
  h+='<div class="dshell-card tpCardTight"><div class="tpRow">';
  h+='<select class="tpInp" id="fState" style="width:auto">';
  [['active','未完成'],['todo','待办'],['doing','进行中'],['inbox','收集箱'],['blocked','阻塞'],['done','已完成'],['dropped','已取消'],['all','全部']].forEach(function(o){h+='<option value="'+o[0]+'"'+(filterState===o[0]?' selected':'')+'>'+o[1]+'</option>';});
  h+='</select>';
  h+='<select class="tpInp" id="fKind" style="width:auto">';
  [['all','硬+软 DDL'],['hard','仅硬 DDL'],['soft','仅软 DDL'],['none','无截止']].forEach(function(o){h+='<option value="'+o[0]+'"'+(filterKind===o[0]?' selected':'')+'>'+o[1]+'</option>';});
  h+='</select>';
  h+='<input class="tpInp tpGrow" id="fQ" placeholder="搜索标题/描述" value="'+esc(filterQ)+'" />';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="toggleAdd">＋ 新任务</button>';
  h+='</div></div>';
  var arr=S.tasks.filter(function(t){return t.kind!=='entertainment';});
  if(filterState==='active')arr=arr.filter(function(t){return t.state!=='done'&&t.state!=='dropped';});
  else if(filterState!=='all')arr=arr.filter(function(t){return t.state===filterState;});
  if(filterKind==='hard')arr=arr.filter(function(t){return t.deadlineKind==='hard';});
  else if(filterKind==='soft')arr=arr.filter(function(t){return t.deadlineKind==='soft';});
  else if(filterKind==='none')arr=arr.filter(function(t){return !t.deadline;});
  if(filterQ){var q=filterQ.toLowerCase();arr=arr.filter(function(t){return (t.title||'').toLowerCase().indexOf(q)>=0||(t.description||'').toLowerCase().indexOf(q)>=0;});}
  arr.sort(sortTasks);
  h+='<div class="dshell-card"><div class="tpBetween"><strong>任务（'+arr.length+'）</strong><span class="tpSmall">P0/P1/P2 由 DDL 距离 + 剩余预估 + 硬度推导，可手动覆盖</span></div>';
  if(!arr.length)h+='<p class="dshell-sub" style="margin:8px 0 0">没有匹配任务。</p>';
  else{
    var roots=arr.filter(function(t){return !t.parentId||arr.indexOf(getTask(t.parentId))<0;});
    h+='<div style="margin-top:8px">';
    roots.forEach(function(t){h+=taskLine(t,'all');arr.filter(function(c){return c.parentId===t.id;}).forEach(function(c){h+='<div class="tpSub">'+taskLine(c,'all')+'</div>';});});
    h+='</div>';
  }
  h+='</div>';
  return h;
}

/* ---------- 注意力曲线 ---------- */
function attTarget(rel){
  var len=windowLen();
  var v=42+52*Math.exp(-Math.pow((rel-140)/160,2));
  var tail=len-200;
  if(rel>tail)v=Math.min(v,58-(rel-tail)/200*46);
  return Math.max(12,Math.min(96,v));
}
function attentionActual(key){
  var len=windowLen(),step=15,bins=[];
  for(var i=0;i*step<len+step;i++)bins.push(0);
  function put(a,b,v){a=clampRel(a);b=clampRel(b);var i0=Math.floor(a/step),i1=Math.floor(b/step);for(var i=Math.max(0,i0);i<=Math.min(bins.length-1,i1);i++)bins[i]=Math.max(bins[i],v);}
  S.tasks.forEach(function(t){
    if(t.kind==='entertainment')return;
    (t.sessions||[]).forEach(function(s){
      if(dateKey(new Date(s.start))!==key)return;
      var m=sessionMetrics(s);
      var v=Math.round(m.purity*100);
      sessionActiveSegments(s).forEach(function(g){
        var a=relMin(new Date(g.start)),b=relMin(new Date(g.end));
        if(b<=a)b=a+(g.end-g.start)/60000;
        put(a,b,v);
      });
    });
  });
  return {bins:bins,step:step};
}
function smoothCurve(pts){
  if(!pts.length)return '';
  if(pts.length===1)return 'M '+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
  var d='M '+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
  for(var i=0;i<pts.length-1;i++){
    var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    var c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6;
    var c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=' C '+c1x.toFixed(1)+','+c1y.toFixed(1)+' '+c2x.toFixed(1)+','+c2y.toFixed(1)+' '+p2[0].toFixed(1)+','+p2[1].toFixed(1);
  }
  return d;
}
function renderAttentionCurve(key){
  var len=windowLen(),W=720,H=240,padL=44,padR=18,padT=20,padB=36;
  var dat=attentionActual(key),bins=dat.bins,step=dat.step;
  function X(r){return padL+(r/len)*(W-padL-padR);}
  function Y(v){return H-padB-(v/100)*(H-padT-padB);}
  var tpts=[],apts=[];
  for(var r=0;r<=len;r+=15)tpts.push([X(r),Y(attTarget(r))]);
  for(var i=0;i<bins.length;i++)apts.push([X(i*step),Y(bins[i])]);
  if(apts.length<2)apts.push([X(len),Y(0)]);
  var tpath=smoothCurve(tpts),apath=smoothCurve(apts);
  var g='<svg class="tpCurveSvg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="专注度曲线">';
  g+='<defs>';
  g+='<linearGradient id="tpGold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f7e7a1"/><stop offset="45%" stop-color="#e3b341"/><stop offset="100%" stop-color="#b8860b"/></linearGradient>';
  g+='<filter id="tpGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  g+='</defs>';
  g+='<rect x="'+padL+'" y="'+padT+'" width="'+(W-padL-padR)+'" height="'+(H-padT-padB)+'" fill="var(--tpPlotBg,rgba(255,255,255,.015))" rx="7"/>';
  [0,25,50,75,100].forEach(function(v){
    var dash=v===0?'':' stroke-dasharray="3 5"';
    g+='<line x1="'+padL+'" y1="'+Y(v)+'" x2="'+(W-padR)+'" y2="'+Y(v)+'" stroke="var(--tpGrid,rgba(255,255,255,.08))" stroke-width="1"'+dash+'/>';
    g+='<text x="'+(padL-8)+'" y="'+(Y(v)+4)+'" fill="var(--tpAxisText,#6b7280)" font-size="10" text-anchor="end">'+v+'</text>';
  });
  g+='<text x="12" y="'+(padT+4)+'" fill="var(--tpAxisText,#6b7280)" font-size="10">专注度</text>';
  var stepH=len>960?180:120;
  for(var r2=0;r2<=len;r2+=stepH){
    g+='<line x1="'+X(r2)+'" y1="'+padT+'" x2="'+X(r2)+'" y2="'+(H-padB)+'" stroke="var(--tpGrid,rgba(255,255,255,.08))" stroke-width="1"/>';
    g+='<text x="'+X(r2)+'" y="'+(H-padB+16)+'" fill="var(--tpAxisText,#6b7280)" font-size="10" text-anchor="middle">'+relToClock(r2)+'</text>';
  }
  g+='<text x="'+(W-padR)+'" y="'+(H-6)+'" fill="var(--tpAxisText,#6b7280)" font-size="9" text-anchor="end">目标入睡 '+esc(settings().targetSleep)+'</text>';
  g+='<path d="'+tpath+'" fill="none" stroke="var(--tpTarget,rgba(255,255,255,.22))" stroke-width="1.3" stroke-dasharray="4 6"/>';
  g+='<path d="'+apath+'" fill="none" stroke="url(#tpGold)" stroke-width="3" stroke-linecap="round" filter="url(#tpGlow)"/>';
  g+='<path class="tpFlowLine" d="'+apath+'" fill="none" stroke="#fff6d6" stroke-width="3.2" stroke-linecap="round"/>';
  var peak=0;for(var pi=0;pi<bins.length;pi++){if(bins[pi]>bins[peak])peak=pi;}
  if(bins[peak]>0){g+='<circle cx="'+X(peak*step).toFixed(1)+'" cy="'+Y(bins[peak]).toFixed(1)+'" r="3.4" fill="#fff6d6" stroke="#b8860b" stroke-width="1.4"/>';}
  if(key===todayKey()){var nr=nowRel();if(nr>=0&&nr<=len){g+='<line x1="'+X(nr)+'" y1="'+padT+'" x2="'+X(nr)+'" y2="'+(H-padB)+'" stroke="#f85149" stroke-width="1" stroke-dasharray="3 4" opacity=".8"/>';}}
  g+='</svg>';
  return g;
}
function curveKeyPoints(key){
  var longest=0,first=null,preSleep=0,thoughts=thoughtPenaltyCountOn(key);
  S.tasks.forEach(function(t){
    if(t.kind==='entertainment')return;
    (t.sessions||[]).forEach(function(s){
      if(dateKey(new Date(s.start))!==key)return;
      var m=sessionMetrics(s);
      if(m.purity>=0.7&&m.active>longest)longest=m.active;
      var st=new Date(s.start).getTime();
      if(first===null||st<first)first=st;
      var endRel=relMin(new Date(s.end));
      if(endRel>windowLen()-180)preSleep+=m.active;
    });
  });
  return {longest:longest,first:first==null?null:relMin(new Date(first)),preSleep:preSleep,thoughts:thoughts};
}
function renderMetrics(){
  var key=todayKey(),fs=focusMinutesOn(key),hh=hardHit(),cal=calibration();
  var st=sleepStats(last7Keys(key));
  var h='';
  var dayScore={sleep:scoreSleep([key]),study:scoreStudy([key]),ent:scoreEnt([key])};
  var wk=last7Keys(key);
  var wkScore={sleep:scoreSleep(wk),study:scoreStudy(wk),ent:scoreEnt(wk)};
  function scoreRow(label,obj){
    function cell(name,v,extra){var s=v==null?'—':v;var col=s==null?'#6b7280':(s>=80?'#3fb950':s>=60?'#d29922':'#f85149');return '<div class="tpScore"><b style="color:'+col+'">'+s+'</b><small>'+name+'</small><div class="tpScoreBar"><i style="width:'+(s==null?0:s)+'%;background:'+col+'"></i></div><small style="margin-top:4px">'+extra+'</small></div>';}
    return '<div style="margin-top:10px"><div class="tpSmall" style="font-weight:600;color:#e6e8eb">'+label+'</div><div class="tpScoreGrid" style="margin-top:6px">'
      +cell('睡眠',obj.sleep,'时长+规律性')
      +cell('学习',obj.study,'时长+长段次数')
      +cell('娱乐',obj.ent.score,'时长+多样性+是否过度')
      +'</div></div>';
  }
  h+='<div class="dshell-card"><strong>🏅 评估指标</strong>'+scoreRow('今日',dayScore)+scoreRow('本周',wkScore);
  h+='<div class="tpSmall" style="margin-top:8px">睡眠分按圆形平均的时长与规律性计算；学习分 = 专注总时长 + 连续≥25分钟段数；娱乐分看时长、标签多样性与是否超限。</div></div>';

  /* 每日专注横向条形图 */
  var keys=[];for(var i=13;i>=0;i--)keys.push(addDays(key,-i));
  var vals=keys.map(function(k){return focusMinutesOn(k).total;});
  var maxV=Math.max.apply(null,vals.concat([1]));
  h+='<div class="dshell-card"><strong>📊 每日专注时长（近14天）</strong>';
  keys.slice().reverse().forEach(function(k,ri){var idx=keys.length-1-ri;var v=vals[idx];
    h+='<div class="tpHBarRow"><span class="tpHBarLabel">'+k.slice(5)+'</span><span class="tpHBarTrack"><i class="tpHBarFill" style="display:block;height:100%;width:'+Math.round(v/maxV*100)+'%"></i></span><span class="tpHBarVal">'+fmtMin(v)+'</span></div>';
  });
  h+='</div>';

  /* 娱乐标签分布 */
  var bt=entTagBreakdown(last7Keys(key)),bk=Object.keys(bt).sort(function(a,b){return bt[b]-bt[a];});
  h+='<div class="dshell-card"><strong>🎮 近7天娱乐活动分布</strong>';
  if(!bk.length)h+='<p class="dshell-sub" style="margin:8px 0 0">暂无娱乐记录。</p>';
  else{var eMax=Math.max.apply(null,bk.map(function(t){return bt[t];}));
    bk.forEach(function(t){h+='<div class="tpHBarRow"><span class="tpHBarLabel" style="width:72px">'+esc(t)+'</span><span class="tpHBarTrack"><i class="tpHBarFill" style="display:block;height:100%;width:'+Math.round(bt[t]/eMax*100)+'%;background:#d29922"></i></span><span class="tpHBarVal">'+fmtMin(bt[t])+'</span></div>';});
  }
  h+='</div>';

  h+='<div class="tpGrid2">';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">硬 DDL 按时完成率</div><div class="dshell-statValue" style="'+(hh.rate!==null&&hh.rate<1?'color:#f85149':'')+'">'+(hh.rate===null?'—':Math.round(hh.rate*100)+'%')+'</div><div class="tpSmall">'+(hh.n?hh.hit+'/'+hh.n:'暂无样本')+'</div></div>';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">预估校准中位数</div><div class="dshell-statValue">'+(cal.med===null?'—':cal.med.toFixed(2)+'×')+'</div><div class="tpSmall">'+(cal.med===null?'暂无回填':(cal.med>1?'平均低估 '+Math.round((cal.med-1)*100)+'%':'平均高估 '+Math.round((1-cal.med)*100)+'%'))+'</div></div>';
  h+='<div class="dshell-stat"><div class="dshell-statLabel">近7天平均睡眠</div><div class="dshell-statValue">'+(st.avgDur==null?'—':fmtMin(st.avgDur))+'</div><div class="tpSmall">平均入睡 '+(st.avgBed==null?'—':fmtHM(st.avgBed))+' · 起床 '+(st.avgWake==null?'—':fmtHM(st.avgWake))+'</div></div>';
  h+='</div>';
  return h;
}

/* ---------- 设置 ---------- */
function renderSettings(){
  var s=settings();
  function row(label,id,val,type,step){return '<div class="dshell-kvRow"><span class="dshell-kvKey">'+label+'</span><input class="tpInp tpInpSm" id="'+id+'" type="'+(type||'text')+'"'+(step?' step="'+step+'"':'')+' value="'+esc(val)+'" /></div>';}
  var h='<div class="dshell-card"><strong>时间窗口（跨午夜）</strong><div class="dshell-kv" style="margin-top:8px">';
  h+=row('目标起床','sWake',s.targetWake,'time');
  h+=row('目标入睡（次日）','sSleep',s.targetSleep,'time');
  h+=row('固定占用(分钟/天)','sOverhead',s.dailyOverheadMin,'number');
  h+=row('每日深度上限(分钟)','sMaxDeep',s.maxDeepMin,'number');
  h+='</div><div class="tpSmall" style="margin-top:6px">时间轴窗口 = 目标起床 → 次日目标入睡，内部按「相对起床的分钟数」计算，正确处理跨午夜。</div><button class="dshell-btn tpBtn" style="margin-top:10px" data-act="saveSettings">保存设置</button></div>';

  h+='<div class="dshell-card"><strong>专注度</strong>';
  h+='<div class="tpSmall" style="margin-top:6px">综合 = 自评 50% + 真实专注 50%。真实专注 = max(0, 墙钟 − 暂停 − 2×暂停次数 − 2×思绪条数)。每次结束深度块自评 0–100。</div>';
  h+='<div class="dshell-kv" style="margin-top:8px">'+row('中断提醒：切换数阈值','sSwitchN',s.switchWarnCount,'number')+row('统计窗口(分钟)','sSwitchWin',s.switchWindowMin,'number')+'</div>';
  h+='<div class="tpSmall" style="margin-top:6px">'+(''+s.switchWindowMin)+' 分钟内切换到 ≥'+s.switchWarnCount+' 个任务时给一条可忽略的温和提醒。</div><button class="dshell-btn tpBtn" style="margin-top:10px" data-act="saveSettings">保存设置</button></div>';

  h+='<div class="dshell-card"><strong>拆解约束（AI 拆解时必须遵守）</strong><div class="dshell-kv" style="margin-top:8px">';
  h+=row('单个子任务上限(分钟)','sStep',s.decompMaxStepMin,'number');
  h+=row('子任务数上限','sChildren',s.decompMaxChildren,'number');
  h+='</div><div class="tpSmall" style="margin-top:6px">规则：拆到「能立刻动手的第一个物理动作」即停。</div><button class="dshell-btn tpBtn" style="margin-top:10px" data-act="saveSettings">保存设置</button></div>';

  h+='<div class="dshell-card"><strong>娱乐</strong><div class="dshell-kv" style="margin-top:8px">';
  h+=row('每日娱乐上限(分钟,0=关)','sEntLimit',s.entLimitMin,'number');
  h+=row('娱乐检查点(分钟,0=关)','sEntCp',s.entCheckpointMin,'number');
  h+='</div><div class="dshell-kvRow" style="margin-top:8px;align-items:flex-start"><span class="dshell-kvKey">活动标签</span><input class="tpInp" id="sEntTags" value="'+esc((s.entTags||[]).join(','))+'" style="max-width:280px" /></div>';
  h+='<div class="tpSmall" style="margin-top:6px">逗号分隔。仅娱乐使用标签；休息不参与标签与上限。</div><button class="dshell-btn tpBtn" style="margin-top:10px" data-act="saveSettings">保存设置</button></div>';

  h+='<div class="dshell-card"><strong>单任务时间盒 / 轮换</strong><div class="dshell-kv" style="margin-top:8px">'+row('单任务时间盒(分钟)','sTimebox',s.taskTimeboxMin,'number')+'</div>';
  h+='<div class="tpRow" style="margin-top:8px"><label class="tpRow"><input type="checkbox" id="sTimeboxOn"'+(s.timeboxEnabled?' checked':'')+' /> 启用时间盒检查点</label></div>';
  h+='<button class="dshell-btn tpBtn" style="margin-top:10px" data-act="saveSettings">保存设置</button></div>';

  h+='<div class="dshell-card"><strong>计时器</strong><div class="tpRow" style="margin-top:8px"><label class="tpRow"><input type="checkbox" id="sIdle"'+(s.idleAutoPause?' checked':'')+' /> 离开页面超时自动停</label>';
  h+=row('超时(分钟)','sIdleMin',s.idleMin,'number')+'</div>';
  h+='<button class="dshell-btn tpBtn" style="margin-top:10px" data-act="saveSettings">保存设置</button></div>';

  h+='<div class="dshell-card"><strong>背景</strong><div class="tpRow" style="margin-top:8px">';
  [['fuji','像素富士山'],['aquarium','像素水族馆'],['cream','米白'],['none','纯色']].forEach(function(o){h+='<button class="dshell-btn '+(currentBg()===o[0]?'':'dshell-btnGhost')+' tpBtn" data-act="setBg" data-v="'+o[0]+'">'+o[1]+'</button>';});
  h+='</div></div>';

  if(MOBILE){
    h+='<div class="dshell-card"><strong>飞书日历</strong><div class="tpSmall" style="margin-top:6px">手机版不直连飞书桥接；时间轴只使用本地数据。任务/思绪/睡眠都在本机，建议定期「导出 JSON」备份。</div><div class="tpRow" style="margin-top:10px"><button class="dshell-btn dshell-btnGhost tpBtn" data-act="reloadCal">从静态文件重载</button></div></div>';
  }else{
    h+='<div class="dshell-card"><strong>飞书日历</strong><div class="dshell-kv" style="margin-top:8px">';
    h+='<div class="dshell-kvRow"><span class="dshell-kvKey">已载入事件</span><span class="dshell-kvValue">'+(CAL.events||[]).length+'</span></div>';
    h+='<div class="dshell-kvRow"><span class="dshell-kvKey">刷新时间</span><span class="dshell-kvValue">'+esc(CAL.updatedAt||'未刷新')+'</span></div>';
    h+='<div class="dshell-kvRow"><span class="dshell-kvKey">本地桥接地址</span><input class="tpInp tpInpSm" id="sBridge" value="'+esc(s.bridgeUrl||'http://127.0.0.1:8787')+'" /></div>';
    h+='</div><div class="tpSmall tpWarn" style="margin-top:6px">DSH Desktop 上桥接暂时不可用；刷新会记录请求，但不会阻塞其他功能。</div><div class="tpRow" style="margin-top:10px"><button class="dshell-btn tpBtn" data-act="refreshCal">⟳ 刷新飞书日历</button><button class="dshell-btn dshell-btnGhost tpBtn" data-act="reloadCal">从文件重新载入</button></div></div>';
  }

  h+='<div class="dshell-card"><strong>数据</strong><div class="dshell-kv" style="margin-top:8px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">真值文件</span><span class="dshell-kvValue" style="word-break:break-all">'+esc(MOBILE?'本机存储（IndexedDB）':DATA_PATH)+'</span></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">任务/日期/会话/思绪</span><span class="dshell-kvValue">'+S.tasks.length+' / '+Object.keys(S.days).length+' / '+sum(S.tasks,function(t){return (t.sessions||[]).length;})+' / '+S.thoughts.length+'（旧碎片 '+S.fragments.length+'）</span></div>';
  h+='</div><div class="tpRow" style="margin-top:10px">';
  h+='<button class="dshell-btn tpBtn" data-act="saveNow">立即保存</button>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="export">导出 JSON</button>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="import">导入 JSON</button>';
  h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="seed">载入示例</button>';
  h+='<button class="dshell-btn dshell-btnDanger tpBtn" data-act="reset">清空全部</button>';
  h+='</div><input type="file" id="importFile" accept="application/json" style="display:none" /></div>';
  return h;
}

/* ---------- 主渲染 ---------- */
function render(){
  if(!viewDate)viewDate=(new Date().getHours()>=20)?addDays(todayKey(),1):todayKey();
  var tabs=$('tabs').children;
  for(var i=0;i<tabs.length;i++)tabs[i].className='dshell-tab'+(tabs[i].getAttribute('data-v')===tab?' dshell-tabOn':'');
  renderActiveBar();
  var v=$('view');
  var prevWrap=v.querySelector('.tpTimelineWrap');
  var prevScroll=prevWrap?prevWrap.scrollLeft:null;
  var prevDate=lastTimelineDate;
  if(tab==='today')v.innerHTML=renderToday();
  else if(tab==='all')v.innerHTML=renderAll();
  else if(tab==='metrics')v.innerHTML=renderMetrics();
  else v.innerHTML=renderSettings();
  if(MOBILE&&tab==='today'){
    var nw=v.querySelector('.tpTimelineWrap');
    if(nw){
      if(prevScroll!=null&&prevDate===viewDate)nw.scrollLeft=prevScroll;
      else setTimeout(scrollTimelineToNow,0);
    }
    lastTimelineDate=viewDate;
  }
}
function scrollTimelineToNow(){
  var tl=$('tpTimeline');if(!tl)return;
  var wrap=tl.parentNode;if(!wrap)return;
  var max=Math.max(0,wrap.scrollWidth-wrap.clientWidth);
  if(viewDate!==todayKey()){wrap.scrollLeft=0;return;}
  var len=windowLen();
  var x=(clampRel(nowRel())/len)*tl.scrollWidth;
  wrap.scrollLeft=Math.max(0,Math.min(max,x-wrap.clientWidth/2));
}
function renderActiveBar(){
  var bar=$('activeBar');if(!bar)return;
  var html='';
  if(S.activeSession){
    var a=S.activeSession;
    var t=getTask(a.taskId);
    var start=new Date(a.start).getTime();
    var stale=(Date.now()-start)>6*3600000;
    var isRest=!!a.rest,isEnt=a.taskId===ENT_ID;
    var paused=isPaused(a);
    var pu=sessionPurity({start:a.start,end:new Date().toISOString(),pauses:a.pauses||[],interruptions:a.interruptions||[],thoughtCount:thoughtPenaltyForSession(a.sid)});
    var label=isRest?'🧘 休息中':(isEnt?'🎮 娱乐计时中':(paused?'⏸ 已暂停':'🎯 深度块计时中'));
    var meta=isRest||isEnt?'':(' · 真实专注占比 '+Math.round(pu.realRatio*100)+'% · 暂停 '+pu.count+' 次 · 思绪 '+pu.thoughtCount+' 条 · 结束后自评');
    var border=stale?'rgba(248,81,73,.6)':(isRest?'rgba(139,92,246,.6)':isEnt?'rgba(210,153,34,.6)':(paused?'rgba(140,150,165,.6)':'rgba(227,179,65,.75)'));
    var sparks='';
    for(var si=0;si<10;si++){var sl=(6+si*9.3)%96;var sd=(si*0.19).toFixed(2);var sdu=(1.7+(si%4)*0.35).toFixed(2);sparks+='<i style="left:'+sl.toFixed(1)+'%;animation-delay:'+sd+'s;animation-duration:'+sdu+'s"></i>';}
    html+='<div class="dshell-card tpCardTight tpSticky tpActiveCard'+(paused?' tpPaused':'')+(isRest?' tpActiveRest':isEnt?' tpActiveEnt':'')+'" style="margin-bottom:10px;border-color:'+border+'">'
      +'<div class="tpParticles">'+sparks+'</div>'
      +'<div class="tpRow" style="justify-content:space-between">'
      +'<div class="tpGrow"><div class="tpSmall">'+(stale?'⚠ 计时器已运行超 6 小时，疑似忘记停止':label)+meta+'</div>'
      +'<div class="tpEllip" style="font-weight:600">'+esc(t?t.title:'(已删除任务)')+'</div></div>'
      +'<div class="tpClockSmall" id="tickClock">'+clockHMS(activeElapsedMs(a))+'</div>';
    if(!isRest&&!isEnt)html+='<button class="dshell-btn '+(paused?'':'dshell-btnGhost')+' tpBtn" data-act="pauseToggle">'+(paused?'▶ 继续':'⏸ 暂停打断')+'</button>';
    html+='<button class="dshell-btn dshell-btnDanger tpBtn" data-act="stop">停止并记录</button></div></div>';
  }
  if(cp){
    html+='<div class="dshell-card tpCardTight" style="border-color:rgba(210,153,34,.7);margin-bottom:10px">'
      +'<div class="tpRow" style="justify-content:space-between"><strong class="tpWarn">'+(cp.kind==='ent'?'娱乐检查点':'任务时间盒')+' · 已累计 '+fmtMin(cp.total)+'</strong></div>'
      +'<div class="tpSmall">'+(cp.kind==='ent'?'到点了。想继续需要你明确点一次——默认是停。':'这个任务今天已投入 '+cp.n+' 个时间盒。别让它拖住硬 ddl 和后面的排期。')+'</div>'
      +'<div class="tpRow" style="margin-top:6px"><button class="dshell-btn tpBtn" data-act="cpContinue">再继续一轮</button>'
      +'<button class="dshell-btn dshell-btnGhost tpBtn" data-act="cpRotate">停止并记录</button>'
      +(cp.kind==='task'?'<button class="dshell-btn dshell-btnGhost tpBtn" data-act="cpDrop">取消此任务</button>':'')
      +'</div></div>';
  }
  bar.innerHTML=html;
}

/* ---------- 提示 / 庆祝 ---------- */
function toast(msg,tone,actions){
  var w=$('toastWrap');if(!w)return;
  var el=document.createElement('div');
  el.className='tpToast'+(tone==='good'?' tpToastGood':tone==='warn'?' tpToastWarn':'');
  var h='<div class="tpGrow">'+msg+'</div>';
  (actions||[]).forEach(function(a){h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="'+(a.act||'dismiss')+'"'+(a.id?' data-id="'+a.id+'"':'')+(a.v?' data-v="'+a.v+'"':'')+'>'+a.label+'</button>';});
  if(!actions||!actions.length)h+='<button class="dshell-btn dshell-btnGhost tpBtn" data-act="dismiss">知道了</button>';
  el.innerHTML=h;
  w.appendChild(el);
  setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},12000);
}
function celebrate(msg){
  var c=$('celebrate');if(!c)return;
  c.innerHTML='';
  for(var i=0;i<30;i++){var d=document.createElement('i');d.className='tpConfetti';d.style.left=(Math.random()*100)+'%';d.style.background=['#3fb950','#e3b341','#4f8ef7','#8b5cf6','#f85149'][i%5];d.style.animationDuration=(1.4+Math.random()*1.4)+'s';d.style.animationDelay=(Math.random()*.4)+'s';c.appendChild(d);}
  var box=document.createElement('div');box.className='tpCelebrateBox';box.innerHTML='<b>🎉 整体完成</b><div style="margin-top:6px;font-size:14px">'+esc(msg)+'</div><div class="tpSmall" style="margin-top:6px">整件事结束，才是唯一的大爽感。</div>';
  c.appendChild(box);c.classList.add('on');
  setTimeout(function(){c.classList.remove('on');c.innerHTML='';},2600);
}
function beep(){
  try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;var ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=880;g.gain.value=0.06;o.start();o.stop(ctx.currentTime+0.18);setTimeout(function(){try{ctx.close();}catch(e){}},500);}catch(e){}
}

/* ---------- 模态 ---------- */
function openModal(html){$('modalBody').innerHTML=html;$('modalWrap').classList.add('on');}
function openMobileWelcome(){
  var h='<h2 class="dshell-title">任务面板 · 手机版</h2>';
  h+='<p class="dshell-sub">数据只存在这台手机，不上传、不同步。第一次使用可以导入之前的 tasktable-data.json。</p>';
  h+='<div class="tpSmall" style="margin-top:6px">导入后会自动迁移旧数据：碎片→思绪、旧标签→自评分、暂停/中断→专注度扣减。</div>';
  h+='<div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="mobileImport">导入旧数据</button><button class="dshell-btn dshell-btnGhost" data-act="mobileBlank">从空白开始</button></div>';
  openModal(h);
}
function closeModal(){$('modalWrap').classList.remove('on');pendingReport=null;pendingReeval=null;pendingSleep=null;pendingFragment=null;pendingReevalTask=null;}

function openSleep(key){
  var rec=sleepRec(key)||{};
  pendingSleep={date:key};
  var h='<h2 class="dshell-title">记录睡眠</h2><p class="dshell-sub">'+esc(key)+'（按「这一觉醒来的日期」记）</p>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">入睡时间</span><input class="tpInp tpInpSm" id="slBed" type="time" value="'+esc(rec.bed||settings().targetSleep)+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">起床时间</span><input class="tpInp tpInpSm" id="slWake" type="time" value="'+esc(rec.wake||settings().targetWake)+'" /></div>';
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="sleepSave">保存</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
}
function openReport(){
  if(!pendingReport)return;
  var t=getTask(pendingReport.taskId);
  var dur=Math.max(0,(pendingReport.end-pendingReport.start)/60000);
  var isEnt=!!(t&&t.kind==='entertainment');
  var isRest=!!pendingReport.rest;
  var pauseMin=0;(pendingReport.pauses||[]).forEach(function(p){if(p&&p.start){var e=p.end?new Date(p.end):new Date(pendingReport.end);var d=(e-new Date(p.start))/60000;if(d>0)pauseMin+=d;}});
  var pc=(pendingReport.pauses||[]).length,tc=pendingReport.thoughtCount||0;
  var h='<h2 class="dshell-title">'+(isEnt?(isRest?'记录这段休息':'记录这段娱乐'):'记录这个深度块')+'</h2>';
  h+='<p class="dshell-sub">'+(t?esc(t.title):'(任务已删除)')+' · 墙钟 '+fmtMin(dur)+(isEnt?'':(' · 暂停 '+fmtMin(pauseMin)+'（'+pc+' 次）· 思绪打断 '+tc+' 条'))+'</p>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">开始</span><input class="tpInp tpInpSm" id="rpStart" type="datetime-local" value="'+localInput(pendingReport.start)+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">结束</span><input class="tpInp tpInpSm" id="rpEnd" type="datetime-local" value="'+localInput(pendingReport.end)+'" /></div>';
  if(isEnt){
    if(!isRest){
      h+='<div class="dshell-kvRow"><span class="dshell-kvKey">这段属于</span><select class="tpInp tpInpSm" id="rpRest"><option value="ent" selected>娱乐</option><option value="rest">休息</option></select></div>';
      h+='<div class="dshell-kvRow" id="rpTagRow"><span class="dshell-kvKey">活动标签</span><select class="tpInp tpInpSm" id="rpEntTag">';
      (settings().entTags||[]).forEach(function(x){h+='<option value="'+esc(x)+'">'+esc(x)+'</option>';});
      h+='</select></div>';
    }else{
      h+='<div class="tpSmall" style="margin-top:4px">休息 = 不刷手机不娱乐的思考时间，不需要标签分类。</div>';
    }
  }else{
    h+='<div class="dshell-kvRow" style="flex-direction:column;align-items:stretch;gap:4px"><div class="tpBetween"><span class="tpSmall">自评（0 = 分散，100 = 深度）</span><b id="rpSelfVal">50</b></div>';
    h+='<input class="tpRange" id="rpSelf" type="range" min="0" max="100" step="1" value="50" />';
    h+='<div class="tpRangeLabels"><span>分散</span><span>深度</span></div></div>';
    h+='<div class="tpPurityPreview" id="rpPurity">—</div>';
    h+='<div class="tpSmall" id="rpParts"></div>';
  }
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">备注</span><input class="tpInp tpInpSm" id="rpNote" value="'+esc(pendingReport.note||'')+'" /></div>';
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="reportSave">保存</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
  if(!isEnt){
    var sl=$('rpSelf');if(sl)sl.addEventListener('input',updateReportPurity);
    ['rpStart','rpEnd'].forEach(function(id){var el=$(id);if(el)el.addEventListener('change',updateReportPurity);});
    updateReportPurity();
  }
  var rr=$('rpRest');
  if(rr)rr.addEventListener('change',function(){var row=$('rpTagRow');if(row)row.style.display=rr.value==='rest'?'none':'';});
}
function updateReportPurity(){
  if(!pendingReport||!$('rpSelf'))return;
  var st=new Date($('rpStart').value).getTime(),en=new Date($('rpEnd').value).getTime();
  if(!(en>st)&&pendingReport.end>pendingReport.start){st=pendingReport.start;en=pendingReport.end;}
  if(!(en>st)){if($('rpPurity'))$('rpPurity').textContent='—';return;}
  var wall=(en-st)/60000;
  var pauseMin=0,pc=0;(pendingReport.pauses||[]).forEach(function(p){if(p&&p.start){var e=p.end?new Date(p.end).getTime():en;var d=(e-new Date(p.start).getTime())/60000;if(d>0){pauseMin+=d;pc++;}}});
  var tc=pendingReport.thoughtCount||0;
  var self=+($('rpSelf').value||0);
  var real=Math.max(0,wall-pauseMin-2*pc-2*tc);
  var ratio=wall>0?real/wall:0;
  var purity=0.5*(self/100)+0.5*ratio;
  if($('rpSelfVal'))$('rpSelfVal').textContent=self;
  if($('rpPurity'))$('rpPurity').innerHTML='综合 <b>'+Math.round(purity*100)+'%</b> <span class="tpSmall">（自评 '+self+'% · 真实 '+Math.round(ratio*100)+'%）</span>';
  if($('rpParts'))$('rpParts').textContent='真实专注 = max(0, 墙钟 '+fmtMin(wall)+' − 暂停 '+fmtMin(pauseMin)+' − 2×'+pc+' 次暂停 − 2×'+tc+' 条思绪) = '+fmtMin(real);
}
function openManual(id){
  var t=getTask(id);if(!t)return;
  pendingReport={taskId:id,start:Date.now()-30*60000,end:Date.now(),tag:(t.kind==='entertainment')?'entertainment':'deep',note:'手动补录',auto:false,interruptions:[],pauses:[],sid:uid('s'),thoughtCount:0,rest:false,entTag:''};
  openReport();
}
function openReeval(id){
  var t=getTask(id);if(!t)return;
  pendingReeval=id;
  var def=new Date();def.setDate(def.getDate()+1);def.setHours(23,59,0,0);
  var h='<h2 class="dshell-title">重新评估</h2><p class="dshell-sub">'+esc(t.title)+'：累计投入 '+Math.round(taskActualRollup(t))+' 分钟，预估 '+fmtMin(t.estimateMin)+'。重设不是失败，是校准。</p>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">新截止（可空）</span><input class="tpInp tpInpSm" id="reDdl" type="datetime-local" value="'+(t.deadline?localInput(new Date(t.deadline).getTime()):localInput(def.getTime()))+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">硬度</span><select class="tpInp tpInpSm" id="reKind"><option value="hard"'+(t.deadlineKind==='hard'?' selected':'')+'>硬 DDL</option><option value="soft"'+(t.deadlineKind==='soft'?' selected':'')+'>软 DDL</option></select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">重估预估(分钟)</span><input class="tpInp tpInpSm" id="reEst" type="number" value="'+Math.max(t.estimateMin||0,Math.round(taskActualRollup(t)))+'"/></div>';
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="reevalSave">重设</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
}
function openPicker(){
  var key=viewDate||todayKey(),cap=dayCapacity(key),day=ensureDay(key);
  var cand=S.tasks.filter(function(t){return t.kind!=='entertainment'&&!isContainer(t)&&t.state!=='done'&&t.state!=='dropped'&&!planEntry(key,t.id);}).sort(sortTasks);
  var h='<h2 class="dshell-title">加入 '+key+' 的日任务</h2><p class="dshell-sub">剩余预算 '+fmtMin(Math.max(0,cap.free))+'。默认填入「剩余预估」作为今日可用，可再改。</p>';
  h+='<div style="margin-top:10px;max-height:52vh;overflow:auto">';
  if(!cand.length)h+='<p class="dshell-sub">没有可加入的任务。</p>';
  cand.forEach(function(t){var pr=derivePriority(t),rem=Math.max(0,(t.estimateMin||0)-taskActualRollup(t));
    h+='<div class="tpLine"><div class="tpRow" style="flex:none">'+pBadge(pr.p)+'</div><div class="tpGrow"><div class="tpEllip">'+esc(t.title)+'</div><div class="tpSmall">'+ddlText(t)+' · 剩余 '+fmtMin(rem)+'</div></div><button class="dshell-btn tpBtn" data-act="pick" data-id="'+t.id+'">加入</button></div>';
  });
  h+='</div><div class="tpRow" style="margin-top:12px"><button class="dshell-btn dshell-btnGhost" data-act="closeModal">关闭</button></div>';
  openModal(h);
}
function openTaskModal(id,prefill){
  var t=id?getTask(id):null,isNew=!t,fromThought=(isNew&&prefill&&prefill.thoughtId)?prefill.thoughtId:null;
  if(isNew){t={id:'',title:(prefill&&prefill.title)||'',description:(prefill&&prefill.description)||'',deadline:'',deadlineKind:'soft',estimateMin:60,actualMin:0,distractedMin:0,sessions:[],state:'todo',plannedFor:null,parentId:null,priorityOverride:null};}
  var parents=S.tasks.filter(function(x){return x.id!==t.id&&!x.parentId&&x.kind!=='entertainment';});
  var h='<h2 class="dshell-title">'+(isNew?'新建任务':'编辑任务')+'</h2><div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">标题 *</span><input class="tpInp" id="txTitle" value="'+esc(t.title)+'" style="max-width:320px"/></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">描述</span><textarea class="tpInp" id="txDesc" rows="2" style="max-width:320px">'+esc(t.description)+'</textarea></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">截止</span><input class="tpInp" id="txDdl" type="datetime-local" value="'+(t.deadline?localInput(new Date(t.deadline).getTime()):'')+'" style="max-width:320px"/></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">硬度</span><select class="tpInp" id="txKind" style="max-width:320px"><option value="hard"'+(t.deadlineKind==='hard'?' selected':'')+'>硬 DDL（不可协商）</option><option value="soft"'+(t.deadlineKind==='soft'?' selected':'')+'>软 DDL（可重估）</option></select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">预估总时长(分钟)</span><input class="tpInp" id="txEst" type="number" value="'+esc(t.estimateMin||0)+'" style="max-width:320px"/></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">状态</span><select class="tpInp" id="txState" style="max-width:320px">';
  [['inbox','收集箱'],['todo','待办'],['doing','进行中'],['blocked','阻塞'],['done','已完成'],['dropped','已取消']].forEach(function(o){h+='<option value="'+o[0]+'"'+(t.state===o[0]?' selected':'')+'>'+o[1]+'</option>';});
  h+='</select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">手动优先级</span><select class="tpInp" id="txPrio" style="max-width:320px"><option value="">自动推导</option>';
  ['P0','P1','P2'].forEach(function(p){h+='<option value="'+p+'"'+(t.priorityOverride===p?' selected':'')+'>'+p+'（覆盖）</option>';});
  h+='</select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">父任务</span><select class="tpInp" id="txParent" style="max-width:320px"><option value="">无</option>';
  parents.forEach(function(p){h+='<option value="'+p.id+'"'+(t.parentId===p.id?' selected':'')+'>'+esc(p.title)+'</option>';});
  h+='</select></div></div>';
  h+='<div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="taskSave" data-id="'+esc(t.id)+'" data-thought="'+esc(fromThought||'')+'">保存</button>';
  if(!isNew&&!MOBILE)h+='<button class="dshell-btn dshell-btnGhost" data-act="decomp" data-id="'+esc(t.id)+'">AI 拆解提示</button>';
  h+='<button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button>';
  if(!isNew)h+='<button class="dshell-btn dshell-btnDanger" style="margin-left:auto" data-act="del" data-id="'+esc(t.id)+'">删除</button>';
  h+='</div>';
  openModal(h);
  setTimeout(function(){var el=$('txTitle');if(el&&isNew)el.focus();},30);
}
function openDecomp(id){
  var t=getTask(id);if(!t)return;
  var s=settings(),lines=[];
  lines.push('请把下面这个任务拆解成子任务，并写入项目数据文件：'+DATA_PATH);lines.push('');
  lines.push('任务标题：'+t.title);if(t.description)lines.push('描述：'+t.description);
  lines.push('总预估：'+fmtMin(t.estimateMin)+'（'+(t.estimateMin||0)+' 分钟）');lines.push('父任务 id：'+t.id);lines.push('');
  lines.push('约束（必须遵守）：');
  lines.push('1. 子任务数不超过 '+s.decompMaxChildren+' 个；');
  lines.push('2. 单个子任务预估不超过 '+s.decompMaxStepMin+' 分钟；');
  lines.push('3. 拆到「能立刻动手的第一个物理动作」就停；');
  lines.push('4. 每个子任务写成 JSON 加入 tasks 数组，字段：id,title,description,deadline,deadlineKind,estimateMin,actualMin:0,sessions:[],state:"todo",parentId:"'+t.id+'",priorityOverride:null；');
  lines.push('5. 不要改动其它已有任务，保存整个 JSON 文件后回复「已写入」。');
  var h='<h2 class="dshell-title">AI 拆解提示</h2><p class="dshell-sub">复制发给 DSH，它会按上限拆解并写入数据文件。</p>';
  h+='<textarea class="tpInp" id="dcText" rows="12" style="margin-top:10px">'+esc(lines.join('\n'))+'</textarea>';
  h+='<div class="tpRow" style="margin-top:12px"><button class="dshell-btn" data-act="copyText">复制</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">关闭</button></div>';
  openModal(h);
}
function openFragmentCapture(){
  var h='<h2 class="dshell-title">捕获碎片</h2><p class="dshell-sub">默认只记录，不默认执行。先判断预计耗时。</p>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">内容</span><input class="tpInp tpInpSm" id="frTitle" placeholder="例如：回一条消息" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">预计耗时</span><select class="tpInp tpInpSm" id="frEst"><option value="2">≤2 分钟（直接做掉）</option><option value="10" selected>&gt;2 分钟（进队列）</option></select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">上下文</span><input class="tpInp tpInpSm" id="frCtx" value="general" /></div>';
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="fragCaptureSave">捕获</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
  setTimeout(function(){var el=$('frTitle');if(el)el.focus();},30);
}
function openFragmentAttrib(id){
  var f=fragById(id);if(!f)return;
  var opts=S.tasks.filter(function(t){return t.kind!=='entertainment'&&t.state!=='done'&&t.state!=='dropped';}).sort(sortTasks);
  var h='<h2 class="dshell-title">这一段归到哪里？</h2><p class="dshell-sub">碎片计时 '+fmtMin(f.actualMin)+'。默认收件箱；只有明确属于某任务时才归到任务。</p>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">标题</span><input class="tpInp tpInpSm" id="faTitle" value="'+esc(f.title)+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">类型</span><select class="tpInp tpInpSm" id="faType"><option value="frag" selected>碎片</option><option value="deep">专注</option><option value="rest">休息</option><option value="ent">娱乐</option></select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">归到</span><select class="tpInp tpInpSm" id="faTask"><option value="">碎片收件箱</option><option value="__done__">标记完成（不归任务）</option>';
  opts.forEach(function(t){h+='<option value="'+t.id+'">'+esc(t.title)+'</option>';});
  h+='</select></div></div>';
  h+='<div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="fragAttrSave" data-id="'+id+'">保存</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">留在收件箱</button></div>';
  openModal(h);
}
function openEntTag(){
  var h='<h2 class="dshell-title">这次娱乐是什么？</h2><p class="dshell-sub">标签用于统计，避免掉进「娱乐轮换但不开始工作」的循环。</p>';
  h+='<div class="tpMinuteGrid" style="margin-top:10px">';
  (settings().entTags||[]).forEach(function(t){h+='<button class="dshell-btn dshell-btnGhost" data-act="entTagPick" data-v="'+esc(t)+'">'+esc(t)+'</button>';});
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
}
function getThought(id){for(var i=0;i<(S.thoughts||[]).length;i++){if(S.thoughts[i].id===id)return S.thoughts[i];}return null;}
function openThoughtModal(id){
  var th=id?getThought(id):null;
  var a=S.activeSession,t=a?getTask(a.taskId):null,isP=!!(a&&isPaused(a));
  var h='<h2 class="dshell-title">'+(th?'编辑思绪':'寄存一条思绪')+'</h2>';
  h+='<p class="dshell-sub">只记名称和描述。记录一条 = 分心一次，当前专注 −2min。</p>';
  h+='<div class="tpSmall" style="margin-top:4px">'+(a?(isP?'当前已暂停，本次不扣专注。':'当前任务：'+esc(t?t.title:'进行中')+' · 本次 −2min。'):'当前没有进行中的任务，本次不扣专注。')+'</div>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">名称 *</span><input class="tpInp" id="thTitle" value="'+esc(th?th.title:'')+'" style="max-width:320px" placeholder="想到什么" /></div>';
  h+='<div class="dshell-kvRow" style="align-items:flex-start"><span class="dshell-kvKey">描述</span><textarea class="tpInp" id="thDesc" rows="3" style="max-width:320px" placeholder="补充两句，之后归位新任务时可直接用">'+esc(th?th.description:'')+'</textarea></div>';
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="thoughtSave" data-id="'+esc(th?th.id:'')+'">保存</button>';
  if(th)h+='<button class="dshell-btn dshell-btnGhost" data-act="thoughtDelete" data-id="'+esc(th.id)+'">删除</button>';
  h+='<button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
  setTimeout(function(){var el=$('thTitle');if(el)el.focus();},30);
}
function openGapEdit(id){
  var key=viewDate||todayKey(),d=ensureDay(key),b=null;
  d.plan.forEach(function(x){if(x.type==='gap'&&x.id===id)b=x;});
  if(!b)return;
  var lay=layoutPlan(key),placed=null;
  lay.blocks.forEach(function(x){if(x._idx!=null&&d.plan[x._idx]===b)placed=x;});
  var start=b.startMin!=null?b.startMin:(placed?placed._start:0);
  var h='<h2 class="dshell-title">编辑时间轴块</h2><p class="dshell-sub">休息/娱乐空隙块。改长度会同步到下方「娱乐/休息」统计条。</p>';
  h+='<div class="dshell-kv" style="margin-top:10px">';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">类型</span><select class="tpInp tpInpSm" id="gpKind">';
  [['rest','休息'],['ent','娱乐'],['batch','批处理']].forEach(function(o){h+='<option value="'+o[0]+'"'+(b.kind===o[0]?' selected':'')+'>'+o[1]+'</option>';});
  h+='</select></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">标签</span><input class="tpInp tpInpSm" id="gpLabel" value="'+esc(b.label||'')+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">开始时间</span><input class="tpInp tpInpSm" id="gpStart" type="time" value="'+relToClock(start)+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">时长(分钟)</span><input class="tpInp tpInpSm" id="gpMin" type="number" min="5" step="5" value="'+Math.round(b.minutes)+'" /></div>';
  h+='<div class="dshell-kvRow"><span class="dshell-kvKey">定位</span><label class="tpSmall"><input type="checkbox" id="gpAuto" '+(b.startMin==null?'checked':'')+' /> 跟随队列自动排</label></div>';
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="gapSave" data-id="'+esc(id)+'">保存</button><button class="dshell-btn dshell-btnGhost" data-act="gapDelete" data-id="'+esc(id)+'">删除</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
}

/* ---------- 持久化 ---------- */
function setChip(txt,cls){var c=$('saveChip');if(!c)return;c.textContent=txt;c.className='dshell-badge'+(cls?' '+cls:'');}
function apiGetFile(path){if(MOBILE)return fetch(path,{cache:'no-store'}).then(function(r){return r.ok?r.text():null;}).catch(function(){return null;});return fetch('/api/worktable/file?path='+encodeURIComponent(path)).then(function(r){return r.ok?r.text():null;}).catch(function(){return null;});}
function csrfHeaders(){
  var h={'content-type':'application/json'};
  try{var parts=document.cookie.split(';');for(var i=0;i<parts.length;i++){var v=parts[i].trim();if(v.indexOf('dsh_ma_csrf=')===0){h['x-dsh-mobile-csrf']=v.slice('dsh_ma_csrf='.length);break;}}}catch(e){}
  return h;
}
function apiWrite(path,text){if(MOBILE)return Promise.resolve(true);return fetch('/api/worktable/write',{method:'POST',headers:csrfHeaders(),body:JSON.stringify({path:path,content:text})}).then(function(r){if(!r.ok)return false;return r.json();}).then(function(j){return !!(j&&j.ok);}).catch(function(){return false;});}
function save(now){
  if(!S)return;
  S.updatedAt=new Date().toISOString();
  Object.keys(S.days||{}).forEach(function(k){var p=S.days[k]&&S.days[k].plan;if(Array.isArray(p))p.forEach(function(b){delete b._start;delete b._end;});});
  try{localStorage.setItem(LS_KEY,JSON.stringify(S));}catch(e){}
  if(saveTimer){clearTimeout(saveTimer);saveTimer=null;}
  if(MOBILE){localSaveState(S);setChip('已存本机','dshell-badgeDone');return;}
  var doRemote=function(){setChip('保存中…');apiWrite(DATA_PATH,JSON.stringify(S,null,2)).then(function(ok){setChip(ok?'已存入项目文件':'仅本地缓存',ok?'dshell-badgeDone':'dshell-badgeWait');});};
  if(now)doRemote();else saveTimer=setTimeout(doRemote,700);
}
function load(){
  if(MOBILE){
    return localLoadState().then(function(st){
      S=st;ensureState();
      return fetch(CAL_PATH,{cache:'no-store'}).then(function(r){return r.ok?r.text():null;}).then(function(t){try{if(t)CAL=JSON.parse(t);}catch(e){}}).catch(function(){});
    });
  }
  var local=null;
  try{var raw=localStorage.getItem(LS_KEY);if(raw)local=JSON.parse(raw);}catch(e){}
  return apiGetFile(DATA_PATH).then(function(txt){
    var file=null;try{if(txt)file=JSON.parse(txt);}catch(e){}
    if(file&&file.tasks&&file.updatedAt){if(local&&local.updatedAt&&local.updatedAt>file.updatedAt)return local;return file;}
    if(local)return local;
    return defaultState();
  }).then(function(st){
    S=st;ensureState();
    return apiGetFile(CAL_PATH).then(function(t){try{if(t)CAL=JSON.parse(t);}catch(e){}});
  });
}

/* ---------- 计时检查点 ---------- */
function todayTaskMinutes(id){var t=getTask(id);if(!t)return 0;var key=todayKey(),m=0;(t.sessions||[]).forEach(function(s){if(dateKey(new Date(s.start))===key)m+=sessionMetrics(s).active;});return m;}
function checkCheckpoints(){
  if(!S||!S.activeSession)return;
  if(S.activeSession.rest)return;
  if(isPaused(S.activeSession))return;
  if($('modalWrap')&&$('modalWrap').classList.contains('on'))return;
  var a=S.activeSession,t=getTask(a.taskId);if(!t)return;
  var running=activeElapsedMs(a)/60000,key=todayKey(),day=ensureDay(key);
  if(!day.cp)day.cp={};
  if(t.kind==='entertainment'){
    var iv=+settings().entCheckpointMin||0;if(iv<=0)return;
    var total=entMinutesOn(key)+running,n=Math.floor(total/iv);
    if(n>(day.cp[ENT_ID]||0)){day.cp[ENT_ID]=n;cp={kind:'ent',taskId:ENT_ID,n:n,total:total};save();render();beep();}
  }else{
    if(!settings().timeboxEnabled)return;
    var bx=+settings().timeboxMin||+settings().taskTimeboxMin||0;if(bx<=0)return;
    var total2=todayTaskMinutes(t.id)+running,n2=Math.floor(total2/bx);
    if(n2>(day.cp[t.id]||0)){day.cp[t.id]=n2;cp={kind:'task',taskId:t.id,n:n2,total:total2};save();render();beep();}
  }
}

/* ---------- 日历刷新 ---------- */
function refreshCalendar(){
  if(MOBILE){toast('手机版不连接飞书桥接；请用「从静态文件重载」或导入数据备份。','warn',[{label:'知道了',act:'dismiss'}]);return;}
  var base=(settings().bridgeUrl||'http://127.0.0.1:8787').replace(/\/$/,'');
  setChip('刷新日历中…');
  var to=setTimeout(function(){setChip('桥接超时','dshell-badgeWait');},10000);
  fetch(base+'/refresh',{method:'POST'}).then(function(r){return r.json();}).then(function(j){
    clearTimeout(to);if(!j||!j.ok)throw new Error((j&&j.error)||'刷新失败');
    return apiGetFile(CAL_PATH).then(function(t){try{if(t)CAL=JSON.parse(t);}catch(e){}});
  }).then(function(){setChip('日历已刷新','dshell-badgeDone');render();}).catch(function(e){
    clearTimeout(to);
    apiWrite(PROJECT_DIR+'calendar-refresh.request.json',JSON.stringify({requestedAt:new Date().toISOString(),reason:String((e&&e.message)||e)},null,2));
    setChip('桥接离线','dshell-badgeWait');
    toast('本地刷新桥接未运行（DSH Desktop 暂不可用），已记录刷新请求。','warn',[{label:'知道了',act:'dismiss'}]);
  });
}
function bridgeHealth(){if(MOBILE)return;var base=(settings().bridgeUrl||'http://127.0.0.1:8787').replace(/\/$/,'');fetch(base+'/health').then(function(r){return r.json();}).then(function(j){if(j&&j.ok)setChip('桥接在线','dshell-badgeDone');}).catch(function(){});}

/* ---------- 完成动作 ---------- */
function completeTask(id){
  var t=getTask(id);if(!t)return;
  if(t.kind==='entertainment'){alert('娱乐时间是固定计时项，不需要完成。');return;}
  if(S.activeSession&&S.activeSession.taskId===id){stopTimer();toast('先保存这段计时，再点整体完成。','warn',[{label:'知道了',act:'dismiss'}]);return;}
  if(isContainer(t)&&!allDescendantsDone(t.id)){toast('子任务未全部完成，不能完成父任务。','warn',[{label:'知道了',act:'dismiss'}]);return;}
  t.priorityAtCompletion=derivePriority(t).p;t.state='done';t.completedAt=new Date().toISOString();
  save();render();
  celebrate(t.title);
  var total=taskActualRollup(t);
  if(total>(t.estimateMin||0)&&(t.estimateMin||0)>0){
    var over=total-t.estimateMin;
    setTimeout(function(){toast('累计投入比预估多了 '+fmtMin(over)+'，要重设预期吗？','warn',[{label:'重设',act:'openReeval',id:id},{label:'忽略',act:'dismiss'}]);},700);
  }
}
function dailyDone(id){
  var key=viewDate||todayKey();
  ensureDay(key).dailyDone[id]=true;
  save();render();
  toast('今天投入够了，收工。停得干净，明天继续。','good',[{label:'好',act:'dismiss'}]);
}
function undoDailyDone(id){var key=viewDate||todayKey();delete ensureDay(key).dailyDone[id];save();render();}
function dropTask(id){var t=getTask(id);if(t){t.state='dropped';t.droppedAt=new Date().toISOString();}save();render();}
function emptyFrag(id){
  var f=fragById(id);if(!f)return;
  S.fragments=S.fragments.filter(function(x){return x.id!==id;});
  Object.keys(S.days).forEach(function(k){var d=S.days[k];if(d.laterQueue)d.laterQueue=d.laterQueue.filter(function(x){return x!==id;});});
}

/* ---------- 交互 ---------- */
document.addEventListener('click',function(ev){
  var el=ev.target.closest?ev.target.closest('[data-act]'):null;
  if(!el)return;
  var act=el.getAttribute('data-act'),id=el.getAttribute('data-id'),v=el.getAttribute('data-v');
  if(act==='tab'){tab=v;render();}
  else if(act==='navday'){var dd=+el.getAttribute('data-d');if(dd===0)viewDate=todayKey();else viewDate=addDays(viewDate,dd);render();}
  else if(act==='toggleAdd'){openTaskModal(null);}
  else if(act==='start'){startTimer(id);}
  else if(act==='stop'){stopTimer();}
  else if(act==='manual'){openManual(id);}
  else if(act==='edit'){openTaskModal(id);}
  else if(act==='taskDone'){completeTask(id);}
  else if(act==='dailyDone'){dailyDone(id);}
  else if(act==='undoDailyDone'){undoDailyDone(id);}
  else if(act==='addday'){var r=addToDay(todayKey(),id);if(r&&r.error)alert(r.error);else render();}
  else if(act==='rmday'){removeFromDay(viewDate||todayKey(),id);render();}
  else if(act==='picker'){openPicker();}
  else if(act==='pick'){var r2=addToDay(viewDate||todayKey(),id);if(r2&&r2.error)alert(r2.error);else{render();openPicker();}}
  else if(act==='reeval'){openReeval(id);}
  else if(act==='openReeval'){openReeval(id);}
  else if(act==='dismiss'){var t0=el.closest('.tpToast');if(t0&&t0.parentNode)t0.parentNode.removeChild(t0);}
  else if(act==='focusMain'){var t1=el.closest('.tpToast');if(t1&&t1.parentNode)t1.parentNode.removeChild(t1);var main=nextTaskId(null);if(main)startTimer(main);}
  else if(act==='closeModal'){closeModal();}
  else if(act==='reportSave'){finishReport();}
  else if(act==='reevalSave'){
    var t2=getTask(pendingReeval);if(!t2)return;
    var dv=$('reDdl').value;t2.deadline=dv?new Date(dv).toISOString():null;
    t2.deadlineKind=$('reKind').value;t2.estimateMin=+$('reEst').value||t2.estimateMin;t2.updatedAt=new Date().toISOString();
    closeModal();save();render();
  }
  else if(act==='taskSave'){
    var title=$('txTitle').value.trim();if(!title){alert('标题必填');return;}
    var t3=id?getTask(id):null;
    var oldState=t3?t3.state:null,newState=$('txState').value,newParent=$('txParent').value||null;
    if(!t3){t3={id:uid('t'),createdAt:new Date().toISOString(),actualMin:0,distractedMin:0,sessions:[]};S.tasks.push(t3);}
    t3.parentId=newParent;
    if(newState==='done'&&isContainer(t3)&&!allDescendantsDone(t3.id)){alert('子任务未全部完成，不能把父任务标记完成。');return;}
    t3.title=title;t3.description=$('txDesc').value;
    var dv2=$('txDdl').value;t3.deadline=dv2?new Date(dv2).toISOString():null;
    t3.deadlineKind=$('txKind').value;t3.estimateMin=+$('txEst').value||0;t3.state=newState;
    t3.priorityOverride=$('txPrio').value||null;t3.updatedAt=new Date().toISOString();
    if(newState==='done'&&oldState!=='done'){t3.completedAt=new Date().toISOString();t3.priorityAtCompletion=derivePriority(t3).p;}
    if(newState!=='done')t3.completedAt=null;
    if(oldState==='done'&&newState!=='done')reopenAncestors(t3.id);
    if(newParent&&newState!=='done')reopenAncestors(t3.id);
    var thoughtId=el.getAttribute('data-thought');
    if(thoughtId){var th=getThought(thoughtId);if(th){th.state='converted';th.convertedTaskId=t3.id;}}
    closeModal();save();render();
  }
  else if(act==='del'){
    if(id===ENT_ID){alert('娱乐时间是固定项，不能删除。');return;}
    var kids=directChildren(id);
    if(!confirm('删除该任务？'+(kids.length?' 它的子任务会变成根任务。':'')))return;
    kids.forEach(function(c){c.parentId=null;});
    S.tasks=S.tasks.filter(function(x){return x.id!==id;});
    S.laterPool=(S.laterPool||[]).filter(function(x){return x!==id;});
    Object.keys(S.days).forEach(function(k){var d=S.days[k];d.committed=(d.committed||[]).filter(function(x){return x!==id;});d.plan=(d.plan||[]).filter(function(b){return !(b.type==='task'&&b.taskId===id);});});
    if(S.activeSession&&S.activeSession.taskId===id)S.activeSession=null;
    closeModal();save();render();
  }
  else if(act==='decomp'){openDecomp(id);}
  else if(act==='copyText'){var ta=$('dcText');ta.select();try{document.execCommand('copy');}catch(e){}try{navigator.clipboard.writeText(ta.value);}catch(e){}alert('已复制');}
  else if(act==='cutDrop'){dropTask(id);}
  else if(act==='cutDefer'){var cdf=getTask(id);if(cdf){var b=cdf.deadline?new Date(cdf.deadline).getTime():Date.now();cdf.deadline=new Date(b+7*86400000).toISOString();}save();render();}
  else if(act==='rotate'){rotateNow();}
  else if(act==='sleepEdit'){openSleep(el.getAttribute('data-d')||viewDate||todayKey());}
  else if(act==='sleepSave'){var key=el.getAttribute('data-d')||(pendingSleep&&pendingSleep.date)||(viewDate||todayKey());if(!S.sleeps)S.sleeps={};S.sleeps[key]={bed:$('slBed').value,wake:$('slWake').value};pendingSleep=null;closeModal();save();render();}
  else if(act==='setfirst'){var sft=getTask(id);if(sft&&isContainer(sft)){toast('父任务是容器，不能做第一个任务。','warn',[{label:'知道了',act:'dismiss'}]);return;}ensureDay(viewDate||todayKey()).firstTaskId=id||null;save();render();}
  else if(act==='clearfirst'){if(S.days[viewDate])S.days[viewDate].firstTaskId=null;save();render();}
  else if(act==='cpContinue'){cp=null;render();}
  else if(act==='cpRotate'){rotateNow();}
  else if(act==='cpDrop'){var ctd=cp?getTask(cp.taskId):null;if(S.activeSession){var ca=S.activeSession;closeOpenPause(ca);addSession(ca.taskId,new Date(ca.start).getTime(),Date.now(),'deep','取消前结算',ca.interruptions||[],false,{pauses:ca.pauses||[],selfScore:60,sid:ca.sid,thoughtCount:thoughtPenaltyForSession(ca.sid)});}if(ctd){ctd.state='dropped';ctd.droppedAt=new Date().toISOString();}S.activeSession=null;cp=null;save();render();}
  else if(act==='saveNow'){save(true);}
  else if(act==='export'){downloadFile('tasktable-data.json',JSON.stringify(S,null,2));}
  else if(act==='mobileImport'){var mf=$('mobileImportFile');if(mf)mf.click();}
  else if(act==='mobileBlank'){S.settings.mobileWelcomeDone=true;save();closeModal();}
  else if(act==='import'){$('importFile').click();}
  else if(act==='seed'){seedExamples();save();render();}
  else if(act==='reset'){if(confirm('清空全部任务与设置？')){S=defaultState();ensureState();viewDate=null;save();renderBg();render();}}
  else if(act==='reloadCal'){apiGetFile(CAL_PATH).then(function(t){try{if(t)CAL=JSON.parse(t);}catch(e){}render();});}
  else if(act==='refreshCal'){refreshCalendar();}
  else if(act==='setBg'){settings().bg=v;save();renderBg();render();}
  else if(act==='saveSettings'){
    var s=settings();
    if($('sWake'))s.targetWake=$('sWake').value||s.targetWake;
    if($('sSleep'))s.targetSleep=$('sSleep').value||s.targetSleep;
    if($('sOverhead'))s.dailyOverheadMin=+$('sOverhead').value||0;
    if($('sMaxDeep'))s.maxDeepMin=+$('sMaxDeep').value||0;
    if($('sLock'))s.lockDeepBlock=$('sLock').checked;
    if($('sSwitchN'))s.switchWarnCount=Math.max(1,+$('sSwitchN').value||3);
    if($('sSwitchWin'))s.switchWindowMin=Math.max(5,+$('sSwitchWin').value||30);
    if($('sStep'))s.decompMaxStepMin=+$('sStep').value||90;
    if($('sChildren'))s.decompMaxChildren=+$('sChildren').value||7;
    if($('sEntLimit'))s.entLimitMin=+$('sEntLimit').value||0;
    if($('sEntCp'))s.entCheckpointMin=+$('sEntCp').value||0;
    if($('sEntTags'))s.entTags=$('sEntTags').value.split(/[,，]/).map(function(x){return x.trim();}).filter(Boolean);
    if($('sTimebox'))s.taskTimeboxMin=+$('sTimebox').value||0;
    if($('sTimeboxOn'))s.timeboxEnabled=$('sTimeboxOn').checked;
    if($('sIdle'))s.idleAutoPause=$('sIdle').checked;
    if($('sIdleMin'))s.idleMin=+$('sIdleMin').value||20;
    if($('sDistract'))s.distractedCountsAsWork=$('sDistract').checked;
    if($('sBridge'))s.bridgeUrl=$('sBridge').value.trim();
    save();renderBg();render();
  }
  /* 思绪 */
  else if(act==='thoughtNew'){openThoughtModal(null);}
  else if(act==='thoughtEdit'){openThoughtModal(id);}
  else if(act==='thoughtSave'){
    var thTitle=$('thTitle').value.trim();if(!thTitle){alert('写点什么');return;}
    var thDesc=$('thDesc').value.trim();
    if(id){var th0=getThought(id);if(th0){th0.title=thTitle;th0.description=thDesc;}}
    else{
      var th1={id:uid('th'),title:thTitle,description:thDesc,createdAt:new Date().toISOString(),dayKey:todayKey(),state:'inbox',convertedTaskId:null,duringTaskId:null,duringSessionId:null,duringPaused:false};
      if(S.activeSession){th1.duringTaskId=S.activeSession.taskId;th1.duringSessionId=S.activeSession.sid;th1.duringPaused=isPaused(S.activeSession);}
      S.thoughts.push(th1);
      if(S.activeSession&&!isPaused(S.activeSession))toast('思绪已寄存 · 当前专注 −2min','warn',[{label:'知道了',act:'dismiss'}]);
      else if(S.activeSession&&isPaused(S.activeSession))toast('思绪已寄存 · 已暂停，本次不扣专注','good',[{label:'知道了',act:'dismiss'}]);
      else toast('思绪已寄存','good',[{label:'知道了',act:'dismiss'}]);
    }
    closeModal();save();render();
  }
  else if(act==='thoughtDone'){var th2=getThought(id);if(th2)th2.state='done';save();render();}
  else if(act==='thoughtDelete'){S.thoughts=(S.thoughts||[]).filter(function(x){return x.id!==id;});save();render();}
  else if(act==='thoughtConvert'){var th3=getThought(id);if(th3)openTaskModal(null,{title:th3.title,description:th3.description,thoughtId:th3.id});}
  else if(act==='openTask'){openTaskModal(id);}
  else if(act==='pauseToggle'){pauseToggle();}
  else if(act==='restConfirm'){closeModal();startMediaSession(true,'休息');}
  /* 时间轴空隙 */
  else if(act==='addGap'){
    var k=viewDate||todayKey(),d2=ensureDay(k),kind=el.getAttribute('data-kind');
    var lay=layoutPlan(k);var start=null;
    if(k===todayKey())start=Math.round(nowRel()/5)*5;
    d2.plan.push({type:'gap',id:uid('g'),kind:kind,label:kind==='ent'?'娱乐空隙':'休息空隙',minutes:kind==='ent'?60:30,startMin:start});
    save();render();
  }
  else if(act==='gapDelete'){
    var gk=viewDate||todayKey(),gd=ensureDay(gk);
    gd.plan=gd.plan.filter(function(x){return !(x.type==='gap'&&x.id===id);});
    selectedKey=null;closeModal();save();render();
  }
  else if(act==='gapSave'){
    var gk2=viewDate||todayKey(),gd2=ensureDay(gk2),gb=null;
    gd2.plan.forEach(function(x){if(x.type==='gap'&&x.id===id)gb=x;});
    if(gb){
      gb.kind=$('gpKind').value;
      gb.label=$('gpLabel').value.trim()||(gb.kind==='ent'?'娱乐空隙':gb.kind==='rest'?'休息空隙':'空隙');
      gb.minutes=Math.max(5,Math.round(+$('gpMin').value||30));
      if($('gpAuto').checked){gb.startMin=null;}
      else{var sm=minutesOfDay($('gpStart').value);var grel=sm-wakeMin();if(grel<0)grel+=1440;gb.startMin=Math.max(0,Math.min(windowLen()-5,grel));}
    }
    closeModal();save();render();
  }
  else if(act==='blockAuto'){
    var ge=planEntry(viewDate||todayKey(),id);
    if(ge)ge.startMin=null;
    save();render();
  }
  /* 娱乐标签 */
  else if(act==='entStart'){openEntTag();}
  else if(act==='entTagPick'){closeModal();startMediaSession(false,v);}
  else if(act==='restStart'){startMediaSession(true,'休息');}
  /* 分流 */
  else if(act==='triageApply'){applyTriage();}
  else if(act==='triageLater'){S.triageAck[todayKey()]='later';save();render();}
  else if(act==='triageEdit'){openTriageEdit();}
  else if(act==='triageEditSave'){openTriageApplyFromModal();}
  /* 稍后池 */
  else if(act==='poolPick'){S.laterPool=(S.laterPool||[]).filter(function(x){return x!==id;});var r3=addToDay(todayKey(),id,true,defaultDaily(getTask(id)));if(r3&&r3.error)alert(r3.error);save();render();}
  else if(act==='poolRemove'){S.laterPool=(S.laterPool||[]).filter(function(x){return x!==id;});save();render();}
});
function emptyFragLater(id){Object.keys(S.days).forEach(function(k){var d=S.days[k];if(d.laterQueue)d.laterQueue=d.laterQueue.filter(function(x){return x!==id;});});}
function openTriageEdit(){
  var cands=triageCandidates();
  var h='<h2 class="dshell-title">逐项调整分流</h2><p class="dshell-sub">默认已按「优先级 × ddl 类型」给建议，可手动改。</p><div style="margin-top:10px;max-height:56vh;overflow:auto">';
  cands.forEach(function(t,i){var c=classifyTriage(t);
    h+='<div class="tpLine"><div class="tpGrow"><div class="tpEllip">'+esc(t.title)+'</div><div class="tpSmall">'+esc(c.label)+'</div></div>';
    h+='<select class="tpInp tpInpSm" id="tri_'+t.id+'">';
    [['tomorrow','延到明日'],['later','回稍后池'],['drop','取消']].forEach(function(o){h+='<option value="'+o[0]+'"'+(o[0]===c.route?' selected':'')+'>'+o[1]+'</option>';});
    h+='</select></div>';
  });
  h+='</div><div class="tpRow" style="margin-top:14px"><button class="dshell-btn" data-act="triageEditSave">确认</button><button class="dshell-btn dshell-btnGhost" data-act="closeModal">取消</button></div>';
  openModal(h);
}
function openTriageApplyFromModal(){
  var cands=triageCandidates(),tomorrow=addDays(todayKey(),1);
  cands.forEach(function(t){
    var sel=$('tri_'+t.id);var route=sel?sel.value:'tomorrow';
    if(route==='drop'){t.state='dropped';t.droppedAt=new Date().toISOString();return;}
    if(route==='later'){if((S.laterPool||[]).indexOf(t.id)<0)S.laterPool.push(t.id);removeFromDay(addDays(todayKey(),-1),t.id);return;}
    var d2=ensureDay(tomorrow);
    if(!planEntry(tomorrow,t.id)){d2.committed.unshift(t.id);d2.plan.unshift({type:'task',taskId:t.id,minutes:defaultDaily(t)});t.plannedFor=tomorrow;}
  });
  S.triageAck[todayKey()]=true;closeModal();save();render();
}

/* ---------- 时间轴：拖拽移动 / 左右拉伸 ---------- */
function clearBlockSelection(){
  selectedKey=null;
  var list=document.querySelectorAll('.tpBlock.tpSelected');
  for(var i=0;i<list.length;i++)list[i].classList.remove('tpSelected');
}
document.addEventListener('pointerdown',function(ev){
  if(ev.button!==undefined&&ev.button!==0)return;
  var t=ev.target;
  if(t&&t.closest&&t.closest('[data-act]'))return;
  var blk=t&&t.closest?t.closest('.tpBlock'):null;if(!blk)return;
  var tl=blk.closest('.tpTimeline');if(!tl)return;
  var key=tl.getAttribute('data-key'),idx=+blk.getAttribute('data-bi');
  var d=ensureDay(key),b=d.plan[idx];if(!b)return;
  var mode='move';
  if(t.classList&&t.classList.contains('tpResizeL'))mode='left';
  else if(t.classList&&t.classList.contains('tpResizeR'))mode='right';
  if(mode!=='move'&&b.type!=='gap')return;
  var lay=layoutPlan(key),placed=null;
  lay.blocks.forEach(function(x){if(x._idx===idx)placed=x;});
  var rect=tl.getBoundingClientRect();
  ptr={key:key,idx:idx,mode:mode,startX:ev.clientX,width:rect.width||1,len:windowLen(),origStart:(placed?placed._start:0),origMin:b.minutes,curStart:(placed?placed._start:0),curMin:b.minutes,moved:0,blk:blk,type:b.type};
  selectedKey=(b.type==='gap')?('g:'+b.id):('t:'+b.taskId);
  var list=tl.querySelectorAll('.tpBlock');
  for(var i=0;i<list.length;i++)list[i].classList.remove('tpSelected');
  blk.classList.add('tpSelected');
  try{blk.setPointerCapture(ev.pointerId);}catch(e){}
});
document.addEventListener('pointermove',function(ev){
  if(!ptr)return;
  var dx=ev.clientX-ptr.startX;
  if(Math.abs(dx)>3)ptr.moved=1;
  if(!ptr.moved)return;
  var dmin=dx/ptr.width*ptr.len;
  var s=ptr.origStart,m=ptr.origMin;
  if(ptr.mode==='move'){
    s=Math.max(0,Math.min(ptr.origStart+dmin,ptr.len-ptr.origMin));
  }else if(ptr.mode==='left'){
    s=Math.max(0,Math.min(ptr.origStart+dmin,ptr.origStart+ptr.origMin-5));
    m=ptr.origMin-(s-ptr.origStart);
  }else if(ptr.mode==='right'){
    m=Math.max(5,Math.min(ptr.origMin+dmin,ptr.len-ptr.origStart));
  }
  ptr.curStart=s;ptr.curMin=m;
  ptr.blk.style.left=Math.max(0,Math.min(100,s/ptr.len*100)).toFixed(3)+'%';
  ptr.blk.style.width=Math.max(0,Math.min(100,m/ptr.len*100)).toFixed(3)+'%';
  ptr.blk.classList.add('tpDragging');
});
document.addEventListener('pointerup',function(ev){
  if(!ptr)return;
  var p=ptr;ptr=null;
  try{p.blk.releasePointerCapture(ev.pointerId);}catch(e){}
  p.blk.classList.remove('tpDragging');
  if(!p.moved)return;
  var d=ensureDay(p.key),b=d.plan[p.idx];if(!b)return;
  function snap(x){return Math.max(0,Math.round(x/5)*5);}
  if(p.mode==='move'){
    b.startMin=snap(p.curStart);
  }else{
    b.startMin=snap(p.curStart);
    b.minutes=Math.max(5,snap(p.curMin));
  }
  selectedKey=(b.type==='gap')?('g:'+b.id):('t:'+b.taskId);
  save();render();
});
document.addEventListener('pointercancel',function(){if(ptr){var p=ptr;ptr=null;p.blk.classList.remove('tpDragging');}});
/* 单击空白处取消选中 */
document.addEventListener('click',function(ev){
  if(ev.target&&ev.target.closest&&ev.target.closest('.tpTimeline'))return;
  if(selectedKey!=null)clearBlockSelection();
});
/* 双击编辑：任务走任务编辑，空隙走空隙编辑；不在时间轴上新建任务 */
document.addEventListener('dblclick',function(ev){
  var blk=ev.target&&ev.target.closest?ev.target.closest('.tpBlock'):null;if(!blk)return;
  if(ev.target.closest&&ev.target.closest('[data-act]'))return;
  if(blk.getAttribute('data-type')==='gap')openGapEdit(blk.getAttribute('data-gid'));
  else openTaskModal(blk.getAttribute('data-tid'));
});

/* ---------- 输入 ---------- */
document.addEventListener('change',function(ev){
  var el=ev.target;if(!el)return;
  if(el.id==='fState'){filterState=el.value;render();}
  else if(el.id==='fKind'){filterKind=el.value;render();}
  else if(el.classList&&el.classList.contains('tpDaily')){
    var id=el.getAttribute('data-id'),key=viewDate||todayKey(),entry=planEntry(key,id);
    if(entry)entry.minutes=Math.max(0,+el.value||0);
    save();render();
  }
  else if(el.id==='importFile'||el.id==='mobileImportFile'){
    var f=el.files&&el.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(){applyImportedState(r.result);};
    r.readAsText(f);
  }
});
document.addEventListener('input',function(ev){
  var el=ev.target;
  if(el&&el.id==='fQ'){filterQ=el.value;var v=$('view');v.innerHTML=renderAll();var f=$('fQ');if(f){f.focus();f.setSelectionRange(f.value.length,f.value.length);}}
});
document.addEventListener('visibilitychange',function(){
  if(!S||!settings())return;
  if(document.hidden){hiddenAt=Date.now();}
  else{
    if(hiddenAt&&settings().idleAutoPause&&S.activeSession){
      var away=(Date.now()-hiddenAt)/60000;
      if(away>=settings().idleMin){
        var end=hiddenAt+settings().idleMin*60000;
        pendingReport={taskId:S.activeSession.taskId,start:new Date(S.activeSession.start).getTime(),end:Math.min(end,Date.now()),tag:'deep',note:'空闲自动停止',auto:true,interruptions:S.activeSession.interruptions||[]};
        S.activeSession=null;save();render();openReport();
      }
    }
    hiddenAt=null;
  }
});
window.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeModal();});

/* ---------- 工具动作 ---------- */
function applyImportedState(text){
  try{
    var o=JSON.parse(text);
    if(!o||!o.tasks)throw new Error('缺少 tasks 字段');
    S=o;ensureState();
    S.settings.mobileWelcomeDone=true;
    save(true);renderBg();render();closeModal();
    toast('数据已导入本机；建议马上导出一次备份。','good',[{label:'知道了',act:'dismiss'}]);
  }catch(e){alert('导入失败：'+e.message);}
}
function downloadFile(name,text){
  var b=new Blob([text],{type:'application/json'});
  if(MOBILE&&navigator.share&&navigator.canShare){
    try{
      var f=new File([b],name,{type:'application/json'});
      if(navigator.canShare({files:[f]})){navigator.share({files:[f],title:name}).catch(function(){});return;}
    }catch(e){}
  }
  var u=URL.createObjectURL(b);
  var a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(u);
}
function seedExamples(){
  var now=Date.now();
  S.tasks=S.tasks.concat([
    {id:uid('t'),title:'示例：硬 DDL 报告',description:'演示硬 DDL 与优先级推导',deadline:new Date(now+0.5*86400000).toISOString(),deadlineKind:'hard',estimateMin:300,actualMin:90,distractedMin:0,sessions:[],state:'doing',plannedFor:null,parentId:null,priorityOverride:null,createdAt:new Date().toISOString()},
    {id:uid('t'),title:'示例：软 DDL 阅读',description:'可协商，资源不足时可重估',deadline:new Date(now+2*86400000).toISOString(),deadlineKind:'soft',estimateMin:180,actualMin:0,distractedMin:0,sessions:[],state:'todo',plannedFor:null,parentId:null,priorityOverride:null,createdAt:new Date().toISOString()},
    {id:uid('t'),title:'示例：无截止的新 idea',description:'先进收件箱，triage 后再排期',deadline:null,deadlineKind:'soft',estimateMin:120,actualMin:0,distractedMin:0,sessions:[],state:'inbox',plannedFor:null,parentId:null,priorityOverride:null,createdAt:new Date().toISOString()}
  ]);
}

/* ---------- 心跳 ---------- */
function tick(){
  var c=$('tpClock');if(c)c.textContent=wallHMS(new Date());
  var cd=$('tpClockDate');
  if(cd&&S){
    var now=new Date();
    var focus=tab==='today'?focusMinutesOn(todayKey()).total:null;
    cd.textContent=now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate())+' '+WEEK[now.getDay()]+(focus!=null?' · 今日专注 '+fmtMin(focus):'');
  }
  if(S&&S.activeSession){var el=$('tickClock');if(el)el.textContent=clockHMS(activeElapsedMs(S.activeSession));}
  if(S)checkCheckpoints();
}
function init(){
  var qm=/[?&]tab=([a-z]+)/.exec(location.search);
  if(qm&&['today','all','metrics','settings'].indexOf(qm[1])>=0)tab=qm[1];
  load().then(function(){
    renderBg();
    render();
    setChip('已载入','dshell-badgeDone');
    save(true);
    bridgeHealth();
    tick();
    ticking=setInterval(tick,1000);
    if(MOBILE){
      try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){});}catch(e){}
      var nonEnt=S.tasks.filter(function(t){return t.kind!=='entertainment';}).length;
      var anySessions=sum(S.tasks,function(t){return (t.sessions||[]).length;})>0;
      var anyThoughts=(S.thoughts||[]).length>0;
      if(!S.settings.mobileWelcomeDone&&!/[?&]welcome=0/.test(location.search)&&!nonEnt&&!anySessions&&!anyThoughts)openMobileWelcome();
    }
  });
}
init();
})();
