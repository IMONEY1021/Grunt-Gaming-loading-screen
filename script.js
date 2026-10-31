(function(){'use strict';
var backgrounds=['assets/scene-01.webp','assets/scene-02.webp','assets/scene-03.webp','assets/scene-04.webp','assets/scene-05.webp','assets/scene-06.webp','assets/scene-07.webp','assets/scene-08.webp','assets/scene-09.webp','assets/scene-10.webp','assets/scene-11.webp','assets/scene-12.webp','assets/scene-13.webp'];
var index=0,frontA=true,total=null,needed=null,rotating=false;
var known={}; // Only show images that have actually decoded; missing uploads never blank the screen.
function byId(x){return document.getElementById(x)}
var loaderDiagnostics={phase:'startup',lastError:'',current:backgrounds[0],tested:0,missing:[]};
window.GGLoadingDiagnostics=loaderDiagnostics;
function probe(i,callback){
 var path=backgrounds[i];
 if(known[path]===true||known[path]===false){if(callback)callback(known[path]);return}
 var img=new Image();img.onload=function(){known[path]=true;loaderDiagnostics.tested++;if(callback)callback(true)};
 img.onerror=function(){known[path]=false;loaderDiagnostics.tested++;loaderDiagnostics.missing.push(path);loaderDiagnostics.lastError='Image unavailable: '+path;if(callback)callback(false)};
 img.src=path
}
function rotate(){
 if(rotating)return;
 rotating=true;
 var candidates=[],step=1;
 for(;step<backgrounds.length;step++)candidates.push((index+step)%backgrounds.length);
 function next(){
  if(!candidates.length){rotating=false;return}
  var candidate=candidates.shift();
  probe(candidate,function(usable){
   if(!usable){next();return}
   var path=backgrounds[candidate],enter=byId(frontA?'backB':'backA'),leave=byId(frontA?'backA':'backB');
   enter.onload=function(){
    enter.onload=null;enter.onerror=null;
    enter.classList.add('active');leave.classList.remove('active');
    index=candidate;frontA=!frontA;rotating=false;loaderDiagnostics.current=path;loaderDiagnostics.phase='displaying';
   };
   enter.onerror=function(){enter.onload=null;enter.onerror=null;known[path]=false;loaderDiagnostics.lastError='Decode error: '+path;next()};
   enter.src=path;
   if(enter.complete&&enter.naturalWidth>0)enter.onload();
  })
 }
 next()
}
var first=byId('backA');
first.onload=function(){loaderDiagnostics.phase='displaying';known[backgrounds[0]]=true};
first.onerror=function(){loaderDiagnostics.lastError='Initial image failed';known[backgrounds[0]]=false;loaderDiagnostics.phase='first-image-failed';rotate()};
if(first.complete&&first.naturalWidth>0){known[backgrounds[0]]=true;loaderDiagnostics.phase='displaying'}
probe(1);
setInterval(rotate,6200);
try{var p=new URLSearchParams(location.search);var m=p.get('map');if(m&&/^[a-zA-Z0-9_-]{1,80}$/.test(m))byId('mapName').textContent=m}catch(e){}
function update(){if(total===null||needed===null||total<=0)return;var n=Math.min(total,Math.max(0,needed)),done=total-n,percent=Math.round(done/total*100);byId('progressTrack').classList.remove('indeterminate');byId('progressTrack').setAttribute('aria-valuenow',String(percent));byId('progressFill').style.width=percent+'%';byId('fileCount').textContent=done+' / '+total+' FILES'}
window.GameDetails=function(servername,serverurl,mapname,maxplayers,steamid,gamemode){if(servername)byId('serverName').textContent=String(servername);if(mapname)byId('mapName').textContent=String(mapname);if(gamemode)byId('gameMode').textContent=String(gamemode).toUpperCase()};
window.SetFilesTotal=function(n){n=Number(n);if(Number.isFinite(n)&&n>0){total=Math.floor(n);update()}};
window.SetFilesNeeded=function(n){n=Number(n);if(Number.isFinite(n)&&n>=0){needed=Math.floor(n);update()}};
window.SetStatusChanged=function(s){if(s)byId('statusText').textContent=String(s).toUpperCase().slice(0,130)};
window.DownloadingFile=function(f){if(f){var n=String(f).replace(/\\/g,'/').split('/').pop();byId('fileName').textContent='DOWNLOADING: '+n.slice(0,100)}};

var roster=window.GruntGamingStaff||{};
var names=roster.superadmins;
var staffBox=byId('superadminsNames'),staffRoot=byId('staffRoster');
if(staffBox&&staffRoot&&Array.isArray(names)){
 names.slice(0,4).forEach(function(person){
  if(!person||typeof person.inGame!=='string'||typeof person.steam!=='string')return;
  if(!person.inGame.trim()||!person.steam.trim())return;
  var item=document.createElement('div');
  item.className='staff-person';
  var gameName=document.createElement('span');
  gameName.className='staff-in-game';
  gameName.textContent=person.inGame.trim().slice(0,75);
  item.appendChild(gameName);
  if(person.owner===true){
   var role=document.createElement('span');
   role.className='staff-owner';
   role.textContent='OWNER';
   item.appendChild(role);
  }
  var steamName=document.createElement('span');
  steamName.className='staff-steam';
  steamName.textContent='Steam: '+person.steam.trim().slice(0,75);
  item.appendChild(steamName);
  staffBox.appendChild(item);
  staffRoot.hidden=false;
 });
 if(!staffRoot.hidden&&staffRoot.parentNode){
  staffRoot.parentNode.classList.add('has-staff');
 }
}
})();
