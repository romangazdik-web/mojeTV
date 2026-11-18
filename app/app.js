(function () {
  'use strict';
  var KEY = {LEFT:37,UP:38,RIGHT:39,DOWN:40,ENTER:13,BACK:10009,ESC:27,RED:403};
  var modules = [], selected = 0, moduleSelected = 0, openList = false, loaded = false;
  var tiles = document.querySelectorAll('.tile');
  var days = ['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'];
  var months = ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
  function $(id){return document.getElementById(id);}
  function two(n){return n<10?'0'+n:''+n;}
  function fit(){ var s=Math.min(window.innerWidth/1920,window.innerHeight/1080);$('stage').style.webkitTransform='scale('+s+')';$('stage').style.transform='scale('+s+')';$('stage').style.left=((window.innerWidth-1920*s)/2)+'px';$('stage').style.top=((window.innerHeight-1080*s)/2)+'px';}
  function clock(){var d=new Date();$('clock').textContent=two(d.getHours())+':'+two(d.getMinutes());$('date').textContent=days[d.getDay()]+' '+d.getDate()+'. '+months[d.getMonth()];}
  function status(s){$('status').textContent=s;}
  function find(match){var m=match.toLowerCase(),i;for(i=0;i<modules.length;i++){if(((modules[i].fullName||'')+' '+(modules[i].appName||'')+' '+(modules[i].name||'')).toLowerCase().indexOf(m)>=0)return modules[i];}return null;}
  function rpc(cb,err){var ws,timer,done=false;
    function fail(s){if(done)return;done=true;clearTimeout(timer);try{ws.close();}catch(e){} if(err)err(s);}
    try{ws=new WebSocket('ws://127.0.0.1:8081');}catch(e){return fail('Nelze otevřít službu TizenBrew');}
    timer=setTimeout(function(){fail('Služba TizenBrew neodpovídá');},6000);
    ws.onerror=function(){fail('Služba TizenBrew není dostupná');};
    ws.onopen=function(){ws.send(JSON.stringify({type:4,payload:false}));};
    ws.onmessage=function(ev){var msg;try{msg=JSON.parse(ev.data);}catch(e){return;}
      if(msg.type!==4)return;
      if(!msg.payload)return;
      if(done)return;done=true;clearTimeout(timer);cb(ws,msg.payload);
    };
  }
  function refresh(){status('Načítám moduly…');rpc(function(ws,result){modules=result||[];loaded=true;try{ws.close();}catch(e){}
    status(modules.length?'Připraveno · '+modules.length+' modulů TizenBrew':'Nejsou dostupné žádné moduly');
  },function(msg){status(msg+' · zkontroluj Host PC IP = 127.0.0.1');});}
  function run(mod){if(!mod){status('Tento modul není v TizenBrew nainstalovaný');return;}
    status('Spouštím '+(mod.appName||mod.name||'modul')+'…');
    rpc(function(ws,mods){var i,match=null;
      for(i=0;i<mods.length;i++)if(mods[i].fullName===mod.fullName){match=mods[i];break;}
      if(!match){try{ws.close();}catch(e){}return status('Modul se mezitím změnil. Obnov nabídku červeným tlačítkem.');}
      var url=match.appPath||match.websiteURL;
      if(!url){try{ws.close();}catch(e){}return status('Modul nemá stránku, kterou lze otevřít');}
      try{if(typeof tizen!=='undefined'&&tizen.tvinputdevice&&match.keys){for(var k=0;k<match.keys.length;k++)tizen.tvinputdevice.registerKey(match.keys[k]);}}catch(e){}
      ws.send(JSON.stringify({type:5,payload:match}));
      if(!match.evaluateScriptOnDocumentStart){setTimeout(function(){location.href=url;},250);}
      else{ws.onmessage=function(ev){try{var m=JSON.parse(ev.data);if(m.type===5)location.href=url;}catch(e){}};
        setTimeout(function(){location.href=url;},1500);}
    },function(msg){status(msg);});
  }
  function select(i){selected=Math.max(0,Math.min(tiles.length-1,i));for(var j=0;j<tiles.length;j++)tiles[j].className='tile'+(j===selected?' active':'');tiles[selected].focus();}
  function launchSelected(){var t=tiles[selected],kind=t.getAttribute('data-kind');if(kind==='list')showList();else run(find(t.getAttribute('data-match')));}
  function showList(){openList=true;$('overlay').className='overlay';renderList();}
  function hideList(){openList=false;$('overlay').className='overlay hidden';select(selected);}
  function renderList(){var box=$('module-list');box.innerHTML='';if(!modules.length){box.innerHTML='<div class="module">Žádné moduly zatím nebyly načteny.</div>';return;}
    moduleSelected=Math.max(0,Math.min(moduleSelected,modules.length-1));
    for(var i=0;i<modules.length;i++){
      var row=document.createElement('div');row.className='module'+(i===moduleSelected?' active':'');
      var nm=document.createElement('div');nm.textContent=modules[i].appName||modules[i].name||modules[i].fullName||'Modul';
      var sub=document.createElement('small');sub.textContent=modules[i].fullName||'';row.appendChild(nm);row.appendChild(sub);box.appendChild(row);
    }
  }
  function moveList(d){if(!modules.length)return;moduleSelected=Math.max(0,Math.min(modules.length-1,moduleSelected+d));renderList();var rs=$('module-list').children;if(rs[moduleSelected])rs[moduleSelected].scrollIntoView(false);}
  document.addEventListener('keydown',function(e){var k=e.keyCode;
    if(openList){if(k===KEY.BACK||k===KEY.ESC){hideList();e.preventDefault();return;}
      if(k===KEY.UP||k===KEY.LEFT){moveList(-1);e.preventDefault();return;}
      if(k===KEY.DOWN||k===KEY.RIGHT){moveList(1);e.preventDefault();return;}
      if(k===KEY.ENTER){run(modules[moduleSelected]);e.preventDefault();return;}}
    else{if(k===KEY.LEFT||k===KEY.UP){select(selected-1);e.preventDefault();return;}
      if(k===KEY.RIGHT||k===KEY.DOWN){select(selected+1);e.preventDefault();return;}
      if(k===KEY.ENTER){launchSelected();e.preventDefault();return;}
      if(k===KEY.RED){showList();e.preventDefault();return;}
      if(k===KEY.BACK||k===KEY.ESC){e.preventDefault();return;}}
  });
  for(var i=0;i<tiles.length;i++){(function(j){tiles[j].onclick=function(){select(j);launchSelected();};})(i);}
  window.addEventListener('resize',fit);fit();clock();setInterval(clock,15000);select(0);refresh();
})();
