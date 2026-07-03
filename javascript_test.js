/* javascript test */

"use strict";

let El = function(el){
    this.el;
    this.map = new Map();
};

/*
    이벤트 핸들러 구독
*/
El.prototype.on = function(event, cb, context){
    let hendler = cb.bind(context || this);
    this.map.set([event, cb], handler);
    this.el.addEventListener(event, handler, false);
};

/*
    이벤트 핸들러 구독 중지
*/
El.prototype.off = function(event, cb){
    let handler = cb.bind(context),
    key = [event, handler];

    if(this.map.has(key)){
        this.el.removeEventListener(event, this.map.get(key));
        this.map.delete(key);
    }
};


================


"use strict";

let El = function(el){
    this.el = el;
    this.map = new Map(); // key: cb, value: { event, handler }
};

El.prototype.on = function(event, cb, context){
    let handler = cb.bind(context || this);
    this.map.set(cb, { event, handler });
    this.el.addEventListener(event, handler, false);
};

El.prototype.off = function(event, cb){
    let entry = this.map.get(cb);
    if(entry && entry.event === event){
        this.el.removeEventListener(event, entry.handler);
        this.map.delete(cb);
    }
};






