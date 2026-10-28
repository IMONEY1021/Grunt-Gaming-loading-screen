(function(){'use strict';
var backgrounds=['assets/scene-01.webp','assets/scene-02.webp','assets/scene-03.webp','assets/scene-04.webp','assets/scene-05.webp','assets/scene-06.webp','assets/scene-07.webp'];
var index=0,frontA=true,total=null,needed=null;
function byId(x){return document.getElementById(x)}
function preload(i){var image=new Image();image.src=backgrounds[i]}
function rotate(){var next=(index+1)%backgrounds.length,enter=byId(frontA?'backB':'backA'),leave=byId(frontA?'backA':'backB');enter.style.backgroundImage='url("'+backgrounds[next]+'")';enter.classList.add('active');leave.classList.remove('active');index=next;frontA=!frontA;preload((next+1)%backgrounds.length)}
preload(1);setInterval(rotate,8500);
try{var p=new URLSearchParams(location.search);var m=p.get('map');if(m&&/^[a-zA-Z0-9_-]{1,80}$/.test(m))byId('mapName').textContent=m}catch(e){}
function update(){if(total===null||needed===null||total<=0)return;var n=Math.min(total,Math.max(0,needed)),done=total-n,percent=Math.round(done/total*100);byId('progressTrack').classList.remove('indeterminate');byId('progressTrack').setAttribute('aria-valuenow',String(percent));byId('progressFill').style.width=percent+'%';byId('fileCount').textContent=done+' / '+total+' FILES'}
window.GameDetails=function(servername,serverurl,mapname,maxplayers,steamid,gamemode){if(servername)byId('serverName').textContent=String(servername);if(mapname)byId('mapName').textContent=String(mapname);if(gamemode)byId('gameMode').textContent=String(gamemode).toUpperCase()};
window.SetFilesTotal=function(n){n=Number(n);if(Number.isFinite(n)&&n>0){total=Math.floor(n);update()}};
window.SetFilesNeeded=function(n){n=Number(n);if(Number.isFinite(n)&&n>=0){needed=Math.floor(n);update()}};
window.SetStatusChanged=function(s){if(s)byId('statusText').textContent=String(s).toUpperCase().slice(0,130)};
window.DownloadingFile=function(f){if(f){var n=String(f).replace(/\\/g,'/').split('/').pop();byId('fileName').textContent='DOWNLOADING: '+n.slice(0,100)}};
})();