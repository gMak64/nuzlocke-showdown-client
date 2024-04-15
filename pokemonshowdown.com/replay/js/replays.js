function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;_setPrototypeOf(subClass,superClass);}function _setPrototypeOf(o,p){_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){o.__proto__=p;return o;};return _setPrototypeOf(o,p);}var















SearchPanel=function(_preact$Component){_inheritsLoose(SearchPanel,_preact$Component);function SearchPanel(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this.
results=null;_this.
resultError=null;_this.
format='';_this.
user='';_this.
isPrivate=false;_this.
byRating=false;_this.
page=1;_this.
loggedInUser=null;_this.
loggedInUserIsSysop=false;_this.
sort='date';_this.















































































































submitForm=function(e){var _querySelector,_querySelector2,_querySelector3;
e.preventDefault();
var format=((_querySelector=_this.base.querySelector('input[name=format]'))==null?void 0:_querySelector.value)||'';
var user=((_querySelector2=_this.base.querySelector('input[name=user]'))==null?void 0:_querySelector2.value)||'';
var isPrivate=!((_querySelector3=_this.base.querySelector('input[name=private]'))!=null&&_querySelector3.checked);
_this.search(user,format,isPrivate);
};_this.
cancelForm=function(e){
e.preventDefault();
_this.search('','');
};_this.
searchLoggedIn=function(e){
if(!_this.loggedInUser)return;
_this.base.querySelector('input[name=user]').value=_this.loggedInUser;
_this.submitForm(e);
};return _this;}var _proto=SearchPanel.prototype;_proto.componentDidMount=function componentDidMount(){var _this2=this;Net('/check-login.php').get().then(function(result){if(result.charAt(0)!==']')return;var _result$slice$split=result.slice(1).split(','),userid=_result$slice$split[0],sysop=_result$slice$split[1];_this2.loggedInUser=userid;_this2.loggedInUserIsSysop=!!sysop;_this2.forceUpdate();});this.updateSearch(Net.decodeQuery(this.props.id));};_proto.componentDidUpdate=function componentDidUpdate(previousProps){if(this.props.id===previousProps.id)return;var query=Net.decodeQuery(this.props.id);var page=parseInt(query.page||'1');var byRating=query.sort==='rating';if(page!==this.page||byRating!==this.byRating)this.updateSearch(query);};_proto.updateSearch=function updateSearch(query){var user=query.user||'';var format=query.format||'';var page=parseInt(query.page||'1');var isPrivate=!!query["private"];this.byRating=query.sort==='rating';this.search(user,format,isPrivate,page);};_proto.parseResponse=function parseResponse(response,isPrivate){this.results=null;this.resultError=null;if(isPrivate){if(response.charAt(0)!==']'){this.resultError="Unrecognized response: "+response;return;}response=response.slice(1);}var results=JSON.parse(response);if(!Array.isArray(results)){this.resultError=results.actionerror||"Unrecognized response: "+response;return;}this.results=results;};_proto.search=function search(user,format,isPrivate){var _this3=this;var page=arguments.length>3&&arguments[3]!==undefined?arguments[3]:1;this.base.querySelector('input[name=user]').value=user;this.base.querySelector('input[name=format]').value=format;this.base.querySelectorAll('input[name=private]')[isPrivate?1:0].checked=true;if(!format&&!user)return this.recent();this.user=user;this.format=format;this.isPrivate=!!isPrivate;this.page=page;this.results=null;this.resultError=null;if(user||!format)this.byRating=false;if(!format&&!user){PSRouter.replace('');}else{PSRouter.replace('?'+Net.encodeQuery({user:user||undefined,format:format||undefined,"private":isPrivate?'1':undefined,page:page===1?undefined:page,sort:this.byRating?'rating':undefined}));}this.forceUpdate();Net("/api/replays/"+(isPrivate?'searchprivate':'search')).get({query:{username:this.user,format:this.format,page:page,sort:this.byRating?'rating':undefined}}).then(function(response){if(_this3.format!==format||_this3.user!==user)return;_this3.parseResponse(response,true);_this3.forceUpdate();})["catch"](function(error){if(_this3.format!==''||_this3.user!=='')return;_this3.resultError=''+error;_this3.forceUpdate();});};_proto.modLink=function modLink(overrides){var newPage=overrides.page!==undefined?this.page+overrides.page:1;return'./?'+Net.encodeQuery({user:this.user||undefined,format:this.format||undefined,"private":this.isPrivate?'1':undefined,page:newPage===1?undefined:newPage,sort:(overrides.sort?overrides.sort==='rating':this.byRating)?'rating':undefined});};_proto.recent=function recent(){var _this4=this;this.format='';this.user='';this.results=null;this.forceUpdate();Net('/api/replays/recent').get().then(function(response){if(_this4.format!==''||_this4.user!=='')return;_this4.parseResponse(response,true);_this4.forceUpdate();})["catch"](function(error){if(_this4.format!==''||_this4.user!=='')return;_this4.resultError=''+error;_this4.forceUpdate();});};_proto.
url=function url(replay){
var viewpointSwitched=toID(replay.players[1])===toID(this.user);
return replay.id+(replay.password?"-"+replay.password+"pw":'')+(viewpointSwitched?'?p2':'');
};_proto.
formatid=function formatid(replay){
var formatid=replay.format;
if(!formatid.startsWith('gen')||!/[0-9]/.test(formatid.charAt(3))){


formatid=(replay.uploadtime>1381734000?'gen6':'gen5')+formatid;
}
if(!/^gen[0-9]+-/.test(formatid)){
formatid=formatid.slice(0,4)+'-'+formatid.slice(4);
}
return formatid;
};_proto.
render=function render(){var _this$results,_this5=this,_this$results2;
var activelySearching=!!(this.format||this.user);
var hasNextPageLink=(((_this$results=this.results)==null?void 0:_this$results.length)||0)>50;
var results=hasNextPageLink?this.results.slice(0,50):this.results;
var searchResults=preact.h("ul",{"class":"linklist"},
this.resultError&&preact.h("li",null,
preact.h("strong",{"class":"message-error"},this.resultError)
)||
!results&&preact.h("li",null,
preact.h("em",null,"Loading...")
)||(
results==null?void 0:results.map(function(result){return preact.h("li",null,
preact.h("a",{href:_this5.url(result),"class":"blocklink"},
preact.h("small",null,result.format,result.rating?" (Rating: "+result.rating+")":'',preact.h("br",null)),
!!result["private"]&&preact.h("i",{"class":"fa fa-lock"})," ",
preact.h("strong",null,result.players[0])," vs. ",preact.h("strong",null,result.players[1])
)
);}))
);
return preact.h("div",{"class":PSRouter.showingRight()?'sidebar':''},
preact.h("section",{"class":"section first-section"},
preact.h("h1",null,"Search replays"),
preact.h("form",{onSubmit:this.submitForm},
preact.h("p",null,
preact.h("label",null,"Username:",
preact.h("br",null),
preact.h("input",{type:"search","class":"textbox",name:"user",placeholder:"(blank = any user)",size:20})," ",
this.loggedInUser&&preact.h("button",{type:"button","class":"button",onClick:this.searchLoggedIn},this.loggedInUser,"'s replays")
)
),
preact.h("p",null,
preact.h("label",null,"Format:",preact.h("br",null),
preact.h("input",{type:"search","class":"textbox",name:"format",placeholder:"(blank = any format)",size:30}))
),
preact.h("p",null,
preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"private",value:""})," Public")," ",
preact.h("label",{"class":"checkbox inline"},preact.h("input",{type:"radio",name:"private",value:"1"})," Private (your own replays only)")
),
preact.h("p",null,
preact.h("button",{type:"submit","class":"button"},preact.h("i",{"class":"fa fa-search","aria-hidden":true})," ",preact.h("strong",null,"Search"))," ",
activelySearching&&preact.h("button",{"class":"button",onClick:this.cancelForm},"Cancel")
),
activelySearching&&preact.h("h1",{"aria-label":"Results"}),
activelySearching&&this.format&&!this.user&&preact.h("p",null,"Sort by: ",

preact.h("a",{href:this.modLink({sort:'date'}),"class":"button button-first"+(this.byRating?'':' disabled')},"Date"

),
preact.h("a",{href:this.modLink({sort:'rating'}),"class":"button button-last"+(this.byRating?' disabled':'')},"Rating"

)
),
activelySearching&&this.page>1&&preact.h("p",{"class":"pagelink"},
preact.h("a",{href:this.modLink({page:-1}),"class":"button"},preact.h("i",{"class":"fa fa-caret-up"}),preact.h("br",null),"Page ",this.page-1)
),
activelySearching&&searchResults,
activelySearching&&(((_this$results2=this.results)==null?void 0:_this$results2.length)||0)>50&&preact.h("p",{"class":"pagelink"},
preact.h("a",{href:this.modLink({page:1}),"class":"button"},"Page ",this.page+1,preact.h("br",null),preact.h("i",{"class":"fa fa-caret-down"}))
)
)
),
!activelySearching&&preact.h(FeaturedReplays,null),
!activelySearching&&preact.h("section",{"class":"section"},
preact.h("h1",null,"Recent replays"),
preact.h("ul",{"class":"linklist"},
searchResults
)
)
);
};return SearchPanel;}(preact.Component);var


FeaturedReplays=function(_preact$Component2){_inheritsLoose(FeaturedReplays,_preact$Component2);function FeaturedReplays(){var _this6;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this6=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this6.
moreFun=false;_this6.
moreCompetitive=false;_this6.
showMoreFun=function(e){
e.preventDefault();
_this6.moreFun=true;
_this6.forceUpdate();
};_this6.
showMoreCompetitive=function(e){
e.preventDefault();
_this6.moreCompetitive=true;
_this6.forceUpdate();
};return _this6;}var _proto2=FeaturedReplays.prototype;_proto2.
render=function render(){
return preact.h("section",{"class":"section"},
preact.h("h1",null,"Featured replays"),
preact.h("ul",{"class":"linklist"},
preact.h("li",null,preact.h("h2",null,"Fun")),
preact.h("li",null,preact.h("a",{href:"oumonotype-82345404","class":"blocklink"},
preact.h("small",null,"[gen6-oumonotype]",preact.h("br",null)),
preact.h("strong",null,"kdarewolf")," vs. ",preact.h("strong",null,"Onox"),
preact.h("small",null,preact.h("br",null),"Protean + prediction")
)),
preact.h("li",null,preact.h("a",{href:"anythinggoes-218380995?p2","class":"blocklink"},
preact.h("small",null,"[gen6-anythinggoes]",preact.h("br",null)),
preact.h("strong",null,"Anta2")," vs. ",preact.h("strong",null,"dscottnew"),
preact.h("small",null,preact.h("br",null),"Cheek Pouch")
)),
preact.h("li",null,preact.h("a",{href:"uberssuspecttest-147833524","class":"blocklink"},
preact.h("small",null,"[gen6-ubers]",preact.h("br",null)),
preact.h("strong",null,"Metal Brellow")," vs. ",preact.h("strong",null,"zig100"),
preact.h("small",null,preact.h("br",null),"Topsy-Turvy")
)),
!this.moreFun&&preact.h("li",{style:{paddingLeft:'8px'}},
preact.h("button",{"class":"button",onClick:this.showMoreFun},"More ",preact.h("i",{"class":"fa fa-caret-right","aria-hidden":true}))
),
this.moreFun&&preact.h("li",null,preact.h("a",{href:"smogondoubles-75588440?p2","class":"blocklink"},
preact.h("small",null,"[gen6-smogondoubles]",preact.h("br",null)),
preact.h("strong",null,"jamace6")," vs. ",preact.h("strong",null,"DubsWelder"),
preact.h("small",null,preact.h("br",null),"Garchomp sweeps 11 pokemon")
)),
this.moreFun&&preact.h("li",null,preact.h("a",{href:"ou-20651579?p2","class":"blocklink"},
preact.h("small",null,"[gen5-ou]",preact.h("br",null)),
preact.h("strong",null,"RainSeven07")," vs. ",preact.h("strong",null,"my body is regi"),
preact.h("small",null,preact.h("br",null),"An entire team based on Assist V-create")
)),
this.moreFun&&preact.h("li",null,preact.h("a",{href:"balancedhackmons7322360?p2","class":"blocklink"},
preact.h("small",null,"[gen5-balancedhackmons]",preact.h("br",null)),
preact.h("strong",null,"a ver")," vs. ",preact.h("strong",null,"Shuckie"),
preact.h("small",null,preact.h("br",null),"To a ver's frustration, PP stall is viable in Balanced Hackmons")
)),
preact.h("h2",null,"Competitive"),
preact.h("li",null,preact.h("a",{href:"doublesou-232753081","class":"blocklink"},
preact.h("small",null,"[gen6-doublesou]",preact.h("br",null)),
preact.h("strong",null,"Electrolyte")," vs. ",preact.h("strong",null,"finally"),
preact.h("small",null,preact.h("br",null),"finally steals Electrolyte's spot in the finals of the Doubles Winter Seasonal by outplaying Toxic Aegislash.")
)),
preact.h("li",null,preact.h("a",{href:"smogtours-gen5ou-59402","class":"blocklink"},
preact.h("small",null,"[gen5-ou]",preact.h("br",null)),
preact.h("strong",null,"Reymedy")," vs. ",preact.h("strong",null,"Leftiez"),
preact.h("small",null,preact.h("br",null),"Reymedy's superior grasp over BW OU lead to his claim of victory over Leftiez in the No Johns Tournament.")
)),
preact.h("li",null,preact.h("a",{href:"smogtours-gen3ou-56583","class":"blocklink"},
preact.h("small",null,"[gen3-ou]",preact.h("br",null)),
preact.h("strong",null,"pokebasket")," vs. ",preact.h("strong",null,"Alf'"),
preact.h("small",null,preact.h("br",null),"pokebasket proved Blissey isn't really one to take a Focus Punch well in his victory match over Alf' in the Fuck Trappers ADV OU tournament.")
)),
preact.h("li",null,preact.h("a",{href:"smogtours-ou-55891","class":"blocklink"},
preact.h("small",null,"[gen6-ou]",preact.h("br",null)),
preact.h("strong",null,"Marshall.Law")," vs. ",preact.h("strong",null,"Malekith"),
preact.h("small",null,preact.h("br",null),"In a \"match full of reverses\", Marshall.Law takes on Malekith in the finals of It's No Use.")
)),
preact.h("li",null,preact.h("a",{href:"smogtours-ubers-54583","class":"blocklink"},
preact.h("small",null,"[gen6-custom]",preact.h("br",null)),
preact.h("strong",null,"hard")," vs. ",preact.h("strong",null,"panamaxis"),
preact.h("small",null,preact.h("br",null),"Dark horse panamaxis proves his worth as the rightful winner of The Walkthrough Tournament in this exciting final versus hard.")
)),
!this.moreCompetitive&&preact.h("li",{style:{paddingLeft:'8px'}},
preact.h("button",{"class":"button",onClick:this.showMoreCompetitive},"More ",preact.h("i",{"class":"fa fa-caret-right","aria-hidden":true}))
),
this.moreCompetitive&&preact.h("li",null,preact.h("a",{href:"smogtours-ubers-34646","class":"blocklink"},
preact.h("small",null,"[gen6-ubers]",preact.h("br",null)),
preact.h("strong",null,"steelphoenix")," vs. ",preact.h("strong",null,"Jibaku"),
preact.h("small",null,preact.h("br",null),"In this SPL Week 4 battle, Jibaku's clever plays with Mega Sableye keep the momentum mostly in his favor.")
)),
this.moreCompetitive&&preact.h("li",null,preact.h("a",{href:"smogtours-uu-36860","class":"blocklink"},
preact.h("small",null,"[gen6-uu]",preact.h("br",null)),
preact.h("strong",null,"IronBullet93")," vs. ",preact.h("strong",null,"Laurel"),
preact.h("small",null,preact.h("br",null),"Laurel outplays IronBullet's Substitute Tyrantrum with the sly use of a Shuca Berry Cobalion, but luck was inevitably the deciding factor in this SPL Week 6 match.")
)),
this.moreCompetitive&&preact.h("li",null,preact.h("a",{href:"smogtours-gen5ou-36900","class":"blocklink"},
preact.h("small",null,"[gen5-ou]",preact.h("br",null)),
preact.h("strong",null,"Lowgock")," vs. ",preact.h("strong",null,"Meridian"),
preact.h("small",null,preact.h("br",null),"This SPL Week 6 match features impressive plays, from Jirachi sacrificing itself to paralysis to avoid a burn to some clever late-game switches.")
)),
this.moreCompetitive&&preact.h("li",null,preact.h("a",{href:"smogtours-gen4ou-36782","class":"blocklink"},
preact.h("small",null,"[gen4-ou]",preact.h("br",null)),
preact.h("strong",null,"Heist")," vs. ",preact.h("strong",null,"liberty32"),
preact.h("small",null,preact.h("br",null),"Starting out as an entry hazard-filled stallfest, this close match is eventually decided by liberty32's efficient use of Aerodactyl.")
)),
this.moreCompetitive&&preact.h("li",null,preact.h("a",{href:"randombattle-213274483","class":"blocklink"},
preact.h("small",null,"[gen6-randombattle]",preact.h("br",null)),
preact.h("strong",null,"The Immortal")," vs. ",preact.h("strong",null,"Amphinobite"),
preact.h("small",null,preact.h("br",null),"Substitute Lugia and Rotom-Fan take advantage of Slowking's utility and large HP stat, respectively, in this high ladder match.")
))
)
);
};return FeaturedReplays;}(preact.Component);


var PSRouter=new(function(_PSModel){_inheritsLoose(_class4,_PSModel);





function _class4(){var _this7;
_this7=_PSModel.call(this)||this;_this7.baseLoc=void 0;_this7.leftLoc=null;_this7.rightLoc=null;_this7.forceSinglePanel=false;_this7.stickyRight=true;
var baseLocSlashIndex=document.location.href.lastIndexOf('/');
_this7.baseLoc=document.location.href.slice(0,baseLocSlashIndex+1);
_this7.go(document.location.href);
_this7.setSinglePanel(true);
if(window.history)window.addEventListener('popstate',function(e){
PSRouter.popState(e);
_this7.update();
});
window.onresize=function(){
PSRouter.setSinglePanel();
};return _this7;
}var _proto3=_class4.prototype;_proto3.
showingLeft=function showingLeft(){
return this.leftLoc!==null&&(!this.forceSinglePanel||this.rightLoc===null);
};_proto3.
showingRight=function showingRight(){
return this.rightLoc!==null;
};_proto3.
setSinglePanel=function setSinglePanel(init){
var singlePanel=window.innerWidth<1300;
var stickyRight=window.innerHeight>614;
if(this.forceSinglePanel!==singlePanel||this.stickyRight!==stickyRight){
this.forceSinglePanel=singlePanel;
this.stickyRight=stickyRight;
if(!init)this.update();
}
};_proto3.
push=function push(href){
if(!href.startsWith(this.baseLoc))return false;

if(this.go(href)){var _window$history;
(_window$history=window.history)==null||_window$history.pushState([this.leftLoc,this.rightLoc],'',href);
}
return true;
};_proto3.

go=function go(href){
if(!href.startsWith(this.baseLoc))return false;

var loc=href.slice(this.baseLoc.length);
if(!loc||loc.startsWith('?')){
this.leftLoc=loc;
if(this.forceSinglePanel){
this.rightLoc=null;
}else{
return this.rightLoc===null;
}
}else{
this.rightLoc=loc;
}
return true;
};_proto3.
replace=function replace(loc){
var href=this.baseLoc+loc;
if(this.go(href)){var _window$history2;
(_window$history2=window.history)==null||_window$history2.replaceState([this.leftLoc,this.rightLoc],'',href);
}
return true;
};_proto3.
popState=function popState(e){
if(Array.isArray(e.state)){
var _e$state=e.state,leftLoc=_e$state[0],rightLoc=_e$state[1];
this.leftLoc=leftLoc;
this.rightLoc=rightLoc;
if(this.forceSinglePanel)this.leftLoc=null;
}else{
this.leftLoc=null;
this.rightLoc=null;
this.go(document.location.href);
}
this.update();
};return _class4;}(PSModel))(
);var

PSReplays=function(_preact$Component3){_inheritsLoose(PSReplays,_preact$Component3);function PSReplays(){return _preact$Component3.apply(this,arguments)||this;}PSReplays.

updateDarkMode=function updateDarkMode(){
var dark=this.darkMode==='dark'?'dark':'';
if(this.darkMode==='auto'){
dark=window.matchMedia!=null&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'';
}
document.documentElement.className=dark;
};var _proto4=PSReplays.prototype;_proto4.
componentDidMount=function componentDidMount(){var _this8=this;
PSRouter.subscribe(function(){return _this8.forceUpdate();});
if(window.history){
this.base.addEventListener('click',function(e){
var el=e.target;
for(;el;el=el.parentNode){
if(el.tagName==='A'&&PSRouter.push(el.href)){
e.preventDefault();
e.stopImmediatePropagation();
_this8.forceUpdate();
return;
}
}
});
}
};_proto4.
render=function render(){
var position=PSRouter.showingLeft()&&PSRouter.showingRight()&&!PSRouter.stickyRight?
{display:'flex',flexDirection:'column',justifyContent:'flex-end'}:{};
return preact.h("div",{"class":'bar-wrapper'+(PSRouter.showingLeft()&&PSRouter.showingRight()?' has-sidebar':''),style:position},
PSRouter.showingLeft()&&preact.h(SearchPanel,{id:PSRouter.leftLoc}),
PSRouter.showingRight()&&preact.h(BattlePanel,{id:PSRouter.rightLoc}),
preact.h("div",{style:{clear:'both'}})
);
};return PSReplays;}(preact.Component);PSReplays.darkMode='auto';


preact.render(preact.h(PSReplays,null),document.getElementById('main'));

if(window.matchMedia!=null&&window.matchMedia('(prefers-color-scheme: dark)').matches){
document.documentElement.className='dark';
}
window.matchMedia==null?void 0:window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(event){
if(PSReplays.darkMode==='auto')document.documentElement.className=event.matches?"dark":"";
});
//# sourceMappingURL=replays.js.map