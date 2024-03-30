function _assertThisInitialized(self){if(self===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;_setPrototypeOf(subClass,superClass);}function _wrapNativeSuper(Class){var _cache=typeof Map==="function"?new Map():undefined;_wrapNativeSuper=function _wrapNativeSuper(Class){if(Class===null||!_isNativeFunction(Class))return Class;if(typeof Class!=="function"){throw new TypeError("Super expression must either be null or a function");}if(typeof _cache!=="undefined"){if(_cache.has(Class))return _cache.get(Class);_cache.set(Class,Wrapper);}function Wrapper(){return _construct(Class,arguments,_getPrototypeOf(this).constructor);}Wrapper.prototype=Object.create(Class.prototype,{constructor:{value:Wrapper,enumerable:false,writable:true,configurable:true}});return _setPrototypeOf(Wrapper,Class);};return _wrapNativeSuper(Class);}function _construct(Parent,args,Class){if(_isNativeReflectConstruct()){_construct=Reflect.construct.bind();}else{_construct=function _construct(Parent,args,Class){var a=[null];a.push.apply(a,args);var Constructor=Function.bind.apply(Parent,a);var instance=new Constructor();if(Class)_setPrototypeOf(instance,Class.prototype);return instance;};}return _construct.apply(null,arguments);}function _isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true;}catch(e){return false;}}function _isNativeFunction(fn){try{return Function.toString.call(fn).indexOf("[native code]")!==-1;}catch(e){return typeof fn==="function";}}function _setPrototypeOf(o,p){_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){o.__proto__=p;return o;};return _setPrototypeOf(o,p);}function _getPrototypeOf(o){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o);};return _getPrototypeOf(o);}var











HttpError=function(_Error){_inheritsLoose(HttpError,_Error);


function HttpError(message,statusCode,body){var _this;
_this=_Error.call(this,message)||this;_this.statusCode=void 0;_this.body=void 0;
_this.name='HttpError';
_this.statusCode=statusCode;
_this.body=body;
try{
Error.captureStackTrace(_assertThisInitialized(_this),HttpError);
}catch(err){}return _this;
}return HttpError;}(_wrapNativeSuper(Error));var

NetRequest=function(){

function NetRequest(uri){this.uri=void 0;
this.uri=uri;
}var _proto=NetRequest.prototype;_proto.









get=function get(){var _this2=this;var opts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};
return new Promise(function(resolve,reject){
var xhr=new XMLHttpRequest();
var uri=_this2.uri;
if(opts.query){
uri+=(uri.includes('?')?'&':'?')+Net.encodeQuery(opts.query);
}
xhr.open(opts.method||'GET',uri);
xhr.onreadystatechange=function(){
var DONE=4;
if(xhr.readyState===DONE){
if(xhr.status===200){
resolve(xhr.responseText||'');
return;
}
var err=new HttpError(xhr.statusText||"Connection error",xhr.status,xhr.responseText);
reject(err);
}
};
if(opts.body){
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send(Net.encodeQuery(opts.body));
}else{
xhr.send();
}
});
};_proto.












post=function post(){var opts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var body=arguments.length>1?arguments[1]:undefined;
if(!body)body=opts.body;
return this.get(Object.assign({},
opts,{
method:'POST',
body:body})
);
};return NetRequest;}();


function Net(uri){
return new NetRequest(uri);
}

Net.encodeQuery=function(data){
if(typeof data==='string')return data;
var urlencodedData='';
for(var _key in data){
if(data[_key]===undefined)continue;
if(urlencodedData)urlencodedData+='&';
urlencodedData+=encodeURIComponent(_key)+'='+encodeURIComponent(data[_key]);
}
return urlencodedData;
};
Net.decodeQuery=function(query){
var out={};
var questionIndex=query.indexOf('?');
if(questionIndex>=0)query=query.slice(questionIndex+1);for(var _i2=0,_query$split2=
query.split('&');_i2<_query$split2.length;_i2++){var queryPart=_query$split2[_i2];
var _queryPart$split=queryPart.split('='),_key2=_queryPart$split[0],_value=_queryPart$split[1];
out[decodeURIComponent(_key2)]=decodeURIComponent(_value||'');
}
return out;
};var





PSSubscription=function(){


function PSSubscription(observable,listener){this.observable=void 0;this.listener=void 0;
this.observable=observable;
this.listener=listener;
}var _proto2=PSSubscription.prototype;_proto2.
unsubscribe=function unsubscribe(){
var index=this.observable.subscriptions.indexOf(this);
if(index>=0)this.observable.subscriptions.splice(index,1);
};return PSSubscription;}();var







PSModel=function(){function PSModel(){this.
subscriptions=[];}var _proto3=PSModel.prototype;_proto3.
subscribe=function subscribe(listener){
var subscription=new PSSubscription(this,listener);
this.subscriptions.push(subscription);
return subscription;
};_proto3.
subscribeAndRun=function subscribeAndRun(listener){
var subscription=this.subscribe(listener);
subscription.listener();
return subscription;
};_proto3.
update=function update(){for(var _i4=0,_this$subscriptions2=
this.subscriptions;_i4<_this$subscriptions2.length;_i4++){var subscription=_this$subscriptions2[_i4];
subscription.listener();
}
};return PSModel;}();var









PSStreamModel=function(){function PSStreamModel(){this.
subscriptions=[];this.
updates=[];}var _proto4=PSStreamModel.prototype;_proto4.
subscribe=function subscribe(listener){

var subscription=new PSSubscription(this,listener);
this.subscriptions.push(subscription);
if(this.updates.length){for(var _i6=0,_this$updates2=
this.updates;_i6<_this$updates2.length;_i6++){var update=_this$updates2[_i6];
subscription.listener(update);
}
this.updates=[];
}
return subscription;
};_proto4.
subscribeAndRun=function subscribeAndRun(listener){
var subscription=this.subscribe(listener);
subscription.listener(null);
return subscription;
};_proto4.
update=function update(value){
if(!this.subscriptions.length){

this.updates.push(value);
}for(var _i8=0,_this$subscriptions4=
this.subscriptions;_i8<_this$subscriptions4.length;_i8++){var subscription=_this$subscriptions4[_i8];
subscription.listener(value);
}
};return PSStreamModel;}();
//# sourceMappingURL=utils.js.map