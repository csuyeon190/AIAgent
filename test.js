"use strict";
##
##test
var proto = {
    bar: "bar",
    foo: "foo"
},
    instance = Object.create(proto);

proto.bar = "qux";
instance.foo = "baz";
//instance.bar = "qux";


console.log("instance: " + JSON.stringify(instance));
console.log("proto: " + JSON.stringify(proto));
