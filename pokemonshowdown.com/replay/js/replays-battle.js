function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;_setPrototypeOf(subClass,superClass);}function _setPrototypeOf(o,p){_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){o.__proto__=p;return o;};return _setPrototypeOf(o,p);}









function showAd(id){

window.top.__vm_add=window.top.__vm_add||[];



(function(success){
if(window.document.readyState!=="loading"){
success();
}else{
window.document.addEventListener("DOMContentLoaded",function(){
success();
});
}
})(function(){
var placement=document.createElement("div");
placement.setAttribute("class","vm-placement");
if(window.innerWidth>1000){

placement.setAttribute("data-id","6452680c0b35755a3f09b59b");
}else{

placement.setAttribute("data-id","645268557bc7b571c2f06f62");
}
document.querySelector("#"+id).appendChild(placement);

window.top.__vm_add.push(placement);
});
}var

BattleDiv=function(_preact$Component){_inheritsLoose(BattleDiv,_preact$Component);function BattleDiv(){return _preact$Component.apply(this,arguments)||this;}var _proto=BattleDiv.prototype;_proto.
shouldComponentUpdate=function shouldComponentUpdate(){
return false;
};_proto.
render=function render(){
return preact.h("div",{"class":"battle",style:{position:'relative'}});
};return BattleDiv;}(preact.Component);var

BattleLogDiv=function(_preact$Component2){_inheritsLoose(BattleLogDiv,_preact$Component2);function BattleLogDiv(){return _preact$Component2.apply(this,arguments)||this;}var _proto2=BattleLogDiv.prototype;_proto2.
shouldComponentUpdate=function shouldComponentUpdate(){
return false;
};_proto2.
render=function render(){
return preact.h("div",{"class":"battle-log"});
};return BattleLogDiv;}(preact.Component);var


BattlePanel=function(_preact$Component3){_inheritsLoose(BattlePanel,_preact$Component3);function BattlePanel(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component3.call.apply(_preact$Component3,[this].concat(args))||this;_this.
result=









undefined;_this.
resultError='';_this.
battle=void 0;_this.

lastUsedKeyCode='0';_this.
turnView=false;_this.
autofocusTurnView=null;_this.





















































































keyPressed=function(e){var _e$target,_e$target2,_this$battle,_this$battle2;

_this.lastUsedKeyCode=""+e.keyCode;
if(e.ctrlKey||e.metaKey||e.altKey)return;
if(e.keyCode===27&&_this.turnView){
_this.closeTurn();
return;
}

if(((_e$target=e.target)==null?void 0:_e$target.tagName)==='INPUT'||((_e$target2=e.target)==null?void 0:_e$target2.tagName)==='SELECT')return;
switch(e.keyCode){
case 75:
if((_this$battle=_this.battle)!=null&&_this$battle.atQueueEnd){
_this.replay();
}else if((_this$battle2=_this.battle)!=null&&_this$battle2.paused){
_this.play();
}else{
_this.pause();
}
break;
case 74:
if(e.shiftKey)_this.firstTurn();else
_this.prevTurn();
break;
case 76:
if(e.shiftKey)_this.lastTurn();else
_this.nextTurn();
break;
case 188:
if(e.shiftKey)_this.stepSpeed(-1);
break;
case 190:
if(e.shiftKey)_this.stepSpeed(1);
break;
case 191:
if(e.shiftKey){
alert(
'k = play/pause\n'+
'j = previous turn\n'+
'l = next turn\n'+
'J = first turn\n'+
'L = last turn\n'+
'm = mute\n'+
'< = slower\n'+
'> = faster\n'+
'1-9 = skip to turn\n'+
'? = keyboard shortcuts (this)\n'
);
}
break;
case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
case 96:case 97:case 98:case 99:case 100:case 101:case 102:case 103:case 104:case 105:
_this.turnView=String.fromCharCode(e.keyCode-(e.keyCode>=96?48:0));
if(_this.turnView==='0')_this.turnView='10';
_this.autofocusTurnView='end';
e.preventDefault();
_this.forceUpdate();
break;
case 77:
_this.toggleMute();
break;
}
_this.forceUpdate();
};_this.
play=function(){var _this$battle3;
(_this$battle3=_this.battle)==null||_this$battle3.play();
};_this.
replay=function(){var _this$battle4,_this$battle5;
(_this$battle4=_this.battle)==null||_this$battle4.reset();
(_this$battle5=_this.battle)==null||_this$battle5.play();
_this.forceUpdate();
};_this.
pause=function(){var _this$battle6;
(_this$battle6=_this.battle)==null||_this$battle6.pause();
};_this.
nextTurn=function(){var _this$battle7;
(_this$battle7=_this.battle)==null||_this$battle7.seekBy(1);
};_this.
prevTurn=function(){var _this$battle8;
(_this$battle8=_this.battle)==null||_this$battle8.seekBy(-1);
};_this.
firstTurn=function(){var _this$battle9;
(_this$battle9=_this.battle)==null||_this$battle9.seekTurn(0);
};_this.
lastTurn=function(){var _this$battle10;
(_this$battle10=_this.battle)==null||_this$battle10.seekTurn(Infinity);
};_this.
goToTurn=function(e){var _this$base,_this$battle11;
var turn=(_this$base=_this.base)==null||(_this$base=_this$base.querySelector('input[name=turn]'))==null?void 0:_this$base.value;
if(!(turn!=null&&turn.trim()))return _this.closeTurn(e);
var turnNum=Number(turn);
if(turn==='e'||turn==='end'||turn==='f'||turn==='finish')turnNum=Infinity;
if(isNaN(turnNum)||turnNum<0)alert("Invalid turn");
(_this$battle11=_this.battle)==null||_this$battle11.seekTurn(turnNum);
_this.closeTurn(e);
};_this.
switchViewpoint=function(){var _this$battle12,_this$battle13;
(_this$battle12=_this.battle)==null||_this$battle12.switchViewpoint();
if((_this$battle13=_this.battle)!=null&&_this$battle13.viewpointSwitched){
PSRouter.replace(_this.stripQuery(_this.props.id)+'?p2');
}else{
PSRouter.replace(_this.stripQuery(_this.props.id));
}
};_this.
clickDownload=function(e){var _this$result;
if(!_this.battle){

alert("Wait for the battle to finish loading before downloading.");
return;
}
var filename=(_this.battle.tier||'Battle').replace(/[^A-Za-z0-9]/g,'');


var timestamp=(((_this$result=_this.result)==null?void 0:_this$result.uploadtime)||0)*1000;
var date=new Date(timestamp);
filename+='-'+date.getFullYear();
filename+=(date.getMonth()>=9?'-':'-0')+(date.getMonth()+1);
filename+=(date.getDate()>=10?'-':'-0')+date.getDate();

filename+='-'+toID(_this.battle.p1.name);
filename+='-'+toID(_this.battle.p2.name);

var a=e.currentTarget;
a.href=BattleLog.createReplayFileHref({battle:_this.battle});
a.download=filename+'.html';

e.stopPropagation();
};_this.













changeSpeed=function(e){
var speed=e.target.value;
var fadeTable={
hyperfast:40,
fast:50,
normal:300,
slow:500,
reallyslow:1000
};
var delayTable={
hyperfast:1,
fast:1,
normal:1,
slow:1000,
reallyslow:3000
};
if(!_this.battle)return;
_this.battle.messageShownTime=delayTable[speed];
_this.battle.messageFadeTime=fadeTable[speed];
_this.battle.scene.updateAcceleration();
};_this.














changeSound=function(e){var _this$battle14;
var muted=e.target.value;
(_this$battle14=_this.battle)==null||_this$battle14.setMute(muted==='off');

BattleSound.setBgmVolume(muted==='musicoff'?0:65.881258001265573);
_this.forceUpdate();
};_this.
changeDarkMode=function(e){
var darkmode=e.target.value;
PSReplays.darkMode=darkmode;
PSReplays.updateDarkMode();
_this.forceUpdate();
};_this.
openTurn=function(e){var _this$battle15;
_this.turnView=""+((_this$battle15=_this.battle)==null?void 0:_this$battle15.turn)||true;
_this.autofocusTurnView='select';
e.preventDefault();
_this.forceUpdate();
};_this.
closeTurn=function(e){
_this.turnView=false;
e==null||e.preventDefault();
_this.forceUpdate();
};return _this;}var _proto3=BattlePanel.prototype;_proto3.componentDidMount=function componentDidMount(){this.loadBattle(this.props.id);showAd('LeaderboardBTF');window.onkeydown=this.keyPressed;};_proto3.componentWillReceiveProps=function componentWillReceiveProps(nextProps){if(this.stripQuery(this.props.id)!==this.stripQuery(nextProps.id)){this.loadBattle(nextProps.id);}};_proto3.stripQuery=function stripQuery(id){return id.includes('?')?id.slice(0,id.indexOf('?')):id;};_proto3.loadBattle=function loadBattle(id){var _this2=this;if(this.battle)this.battle.destroy();this.battle=null;this.result=undefined;this.resultError='';this.forceUpdate();var elem=document.getElementById("replaydata-"+id);var logElem=document.getElementById("replaylog-"+id);if(elem){setTimeout(function(){return _this2.loadResult(elem.innerText,id,logElem==null?void 0:logElem.innerText.replace(/<\\\//g,'</'));},1);return;}Net("/"+this.stripQuery(id)+".json").get().then(function(result){_this2.loadResult(result,id);})["catch"](function(err){_this2.loadResult(err.statusCode===404?'':String((err==null?void 0:err.body)||''),id);});};_proto3.loadResult=function loadResult(result,id){var _this3=this;var log=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';try{var replay=JSON.parse(result);replay.log||(replay.log=log);this.result=replay;var $base=$(this.base);this.battle=new Battle({id:replay.id,$frame:$base.find('.battle'),$logFrame:$base.find('.battle-log'),log:replay.log.split('\n'),isReplay:true,paused:true,autoresize:true});window.battle=this.battle;this.battle.subscribe(function(_){_this3.forceUpdate();});var query=Net.decodeQuery(id);if('p2'in query){this.battle.switchViewpoint();}if(query.turn||query.t){this.battle.seekTurn(parseInt(query.turn||query.t,10));}}catch(err){this.result=null;this.resultError=result.startsWith('{')?err.toString():result;}this.forceUpdate();};_proto3.componentWillUnmount=function componentWillUnmount(){var _this$battle16;(_this$battle16=this.battle)==null||_this$battle16.destroy();window.battle=null;window.onkeydown=null;};_proto3.componentDidUpdate=function componentDidUpdate(){if(this.autofocusTurnView==='select'){var _this$base2;(_this$base2=this.base)==null||(_this$base2=_this$base2.querySelector('input[name=turn]'))==null||_this$base2.select();this.autofocusTurnView=null;}if(this.autofocusTurnView==='end'){var _this$base3;var turnbox=(_this$base3=this.base)==null?void 0:_this$base3.querySelector('input[name=turn]');turnbox==null||turnbox.setSelectionRange(2,2);turnbox==null||turnbox.focus();this.autofocusTurnView=null;}};_proto3.getSpeed=function getSpeed(){if(!this.battle)return'normal';if(this.battle.messageFadeTime<=40){return'hyperfast';}else if(this.battle.messageFadeTime<=50){return'fast';}else if(this.battle.messageFadeTime>=500){return'slow';}else if(this.battle.messageFadeTime>=1000){return'reallyslow';}return'normal';};_proto3.stepSpeed=function stepSpeed(delta){var _this$base4;var target=(_this$base4=this.base)==null?void 0:_this$base4.querySelector('select[name=speed]');if(!target)return;var values=['reallyslow','slow','normal','fast','hyperfast'];var newValue=values[values.indexOf(target.value)+delta];if(newValue){target.value=newValue;this.changeSpeed({target:target});}};_proto3.toggleMute=function toggleMute(){var _this$battle17;(_this$battle17=this.battle)==null||_this$battle17.setMute(!BattleSound.muted);this.forceUpdate();};_proto3.
renderError=function renderError(position){
if(this.resultError){
return preact.h("div",{"class":PSRouter.showingLeft()?'mainbar has-sidebar':'mainbar',style:position},preact.h("section",{"class":"section"},
preact.h("h1",null,"Error"),
preact.h("p",null,
this.resultError
)
));
}





return preact.h("div",{"class":PSRouter.showingLeft()?'mainbar has-sidebar':'mainbar',style:position},preact.h("section",{"class":"section",style:{maxWidth:'200px'}},
preact.h("div",{style:{textAlign:'center'}},
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-n.gif",alt:"",style:{imageRendering:'pixelated'}}),
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-o.gif",alt:"",style:{imageRendering:'pixelated'}}),
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-t.gif",alt:"",style:{imageRendering:'pixelated'}})
),
preact.h("div",{style:{textAlign:'center'}},
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-f.gif",alt:"",style:{imageRendering:'pixelated'}}),
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-o.gif",alt:"",style:{imageRendering:'pixelated'}}),
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-u.gif",alt:"",style:{imageRendering:'pixelated'}}),
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-n.gif",alt:"",style:{imageRendering:'pixelated'}}),
preact.h("img",{src:"//play.pokemonshowdown.com/sprites/gen5ani/unown-d.gif",alt:"",style:{imageRendering:'pixelated'}})
)
),preact.h("section",{"class":"section"},
preact.h("h1",null,"Not Found"),
preact.h("p",null,"The battle you're looking for has expired. Battles expire after 15 minutes of inactivity unless they're saved."

),
preact.h("p",null,"In the future, remember to click ",
preact.h("strong",null,"Upload and share replay")," to save a replay permanently."
)
));
};_proto3.
renderControls=function renderControls(){var _this$battle18,_this$battle19,_this$result2,_this$result3;
var atEnd=!this.battle||this.battle.atQueueEnd;
var atStart=!((_this$battle18=this.battle)!=null&&_this$battle18.started);

if(this.turnView){
var value=this.turnView===true?undefined:this.turnView;
this.turnView=true;
return preact.h("div",{"class":"replay-controls"},preact.h("section",{"class":"section"},
preact.h("form",{onSubmit:this.goToTurn},"Turn? ",
preact.h("input",{name:"turn",autofocus:true,value:value,inputMode:"numeric","class":"textbox",size:5})," ",
preact.h("button",{type:"submit","class":"button"},preact.h("strong",null,"Go"))," ",
preact.h("button",{type:"button","class":"button",onClick:this.closeTurn},"Cancel")
),
preact.h("p",null,
preact.h("em",null,"Pro tip:")," You don't need to click \"Skip to turn\" if you have a keyboard, just start typing the turn number and press ",preact.h("kbd",null,"Enter"),". For more shortcuts, press ",preact.h("kbd",null,"Shift"),"+",preact.h("kbd",null,"/")," when a text box isn't focused."
)
));
}

return preact.h("div",{"class":"replay-controls"},
preact.h("p",null,
atEnd&&this.battle?
preact.h("button",{onClick:this.replay,"class":"button",style:{width:'5em',marginRight:'3px'}},
preact.h("i",{"class":"fa fa-undo"}),preact.h("br",null),"Replay"
):
!this.battle||this.battle.paused?
preact.h("button",{onClick:this.play,"class":"button",disabled:!this.battle,style:{width:'5em',marginRight:'3px'}},
preact.h("i",{"class":"fa fa-play"}),preact.h("br",null),preact.h("strong",null,"Play")
):

preact.h("button",{onClick:this.pause,"class":"button",style:{width:'5em',marginRight:'3px'}},
preact.h("i",{"class":"fa fa-pause"}),preact.h("br",null),preact.h("strong",null,"Pause")
),
" ",
preact.h("button",{"class":"button button-first",disabled:atStart,onClick:this.firstTurn},
preact.h("i",{"class":"fa fa-fast-backward"}),preact.h("br",null),"First turn"
),
preact.h("button",{"class":"button button-first",disabled:atStart,style:{marginLeft:'1px',position:'relative',zIndex:'1'},onClick:this.prevTurn},
preact.h("i",{"class":"fa fa-step-backward"}),preact.h("br",null),"Prev turn"
),
preact.h("button",{"class":"button button-last",disabled:atEnd,style:{marginRight:'2px'},onClick:this.nextTurn},
preact.h("i",{"class":"fa fa-step-forward"}),preact.h("br",null),"Skip turn"
),
preact.h("button",{"class":"button button-last",disabled:atEnd,onClick:this.lastTurn},
preact.h("i",{"class":"fa fa-fast-forward"}),preact.h("br",null),"Skip to end"
)," ",
preact.h("button",{"class":"button",onClick:this.openTurn},
preact.h("i",{"class":"fa fa-repeat"})," Go to turn..."
)
),
preact.h("p",null,
preact.h("label",{"class":"optgroup"},"Speed:",
preact.h("br",null),
preact.h("select",{name:"speed","class":"button",onChange:this.changeSpeed,value:this.getSpeed()},
preact.h("option",{value:"hyperfast"},"Hyperfast"),
preact.h("option",{value:"fast"},"Fast"),
preact.h("option",{value:"normal"},"Normal"),
preact.h("option",{value:"slow"},"Slow"),
preact.h("option",{value:"reallyslow"},"Really slow")
)
)," ",
preact.h("label",{"class":"optgroup"},"Sound:",
preact.h("br",null),
preact.h("select",{name:"sound","class":"button",onChange:this.changeSound,value:BattleSound.muted?'off':BattleSound.bgmVolume?'on':'musicoff'},
preact.h("option",{value:"on"},"On"),
preact.h("option",{value:"musicoff"},"Music Off"),
preact.h("option",{value:"off"},"Muted")
)
)," ",
preact.h("label",{"class":"optgroup"},"Dark mode:",
preact.h("br",null),
preact.h("select",{name:"darkmode","class":"button",onChange:this.changeDarkMode,value:PSReplays.darkMode},
preact.h("option",{value:"auto"},"Automatic"),
preact.h("option",{value:"dark"},"Dark"),
preact.h("option",{value:"light"},"Light")
)
)," ",
preact.h("label",{"class":"optgroup"},"Viewpoint:",
preact.h("br",null),
preact.h("button",{onClick:this.switchViewpoint,name:"viewpoint","class":this.battle?'button':'button disabled'},
(_this$battle19=this.battle)!=null&&_this$battle19.viewpointSwitched?(_this$result2=this.result)==null?void 0:_this$result2.players[1]:((_this$result3=this.result)==null?void 0:_this$result3.players[0])||"Player"," ",
preact.h("i",{"class":"fa fa-random","aria-label":"Switch viewpoint"})
)
)
),
this.result?preact.h("h1",null,
preact.h("strong",null,this.result.format),": ",this.result.players.join(' vs. ')
):preact.h("h1",null,
preact.h("em",null,"Loading...")
),
this.result?preact.h("p",null,
preact.h("a",{"class":"button",href:"#",onClick:this.clickDownload,style:{"float":'right'}},
preact.h("i",{"class":"fa fa-download","aria-hidden":true})," Download"
),
this.result.uploadtime?new Date(this.result.uploadtime*1000).toDateString():"Unknown upload date",
this.result.rating?[" | ",preact.h("em",null,"Rating:")," "+this.result.rating]:''

):preact.h("p",null,"\xA0"),
!PSRouter.showingLeft()&&preact.h("p",null,
preact.h("a",{href:".","class":"button"},preact.h("i",{"class":"fa fa-caret-left"})," More replays")
)
);
};_proto3.
render=function render(){
var position={};
if(PSRouter.showingLeft()){
if(PSRouter.stickyRight){
position={position:'sticky',top:'0'};
}else{
position={position:'sticky',bottom:'0'};
}
}

if(this.result===null)return this.renderError(position);

return preact.h("div",{"class":PSRouter.showingLeft()?'mainbar has-sidebar':'mainbar',style:position},preact.h("div",{style:{position:'relative'}},
preact.h(BattleDiv,null),
preact.h(BattleLogDiv,null),
this.renderControls(),
preact.h("div",{id:"LeaderboardBTF"})
));
};return BattlePanel;}(preact.Component);
//# sourceMappingURL=replays-battle.js.map