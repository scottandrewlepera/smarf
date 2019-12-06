"use strict";
exports.__esModule = true;
var index_ti_1 = require("../types/index-ti");
var ts_interface_checker_1 = require("ts-interface-checker");
var TypeChecker = ts_interface_checker_1.createCheckers(index_ti_1["default"]);
function checkType(object, type) {
    if (!TypeChecker[type]) {
        throw new Error("checkType: type " + type + " is undefined.");
    }
    try {
        TypeChecker[type].check(object);
    }
    catch (err) {
        console.error("checkType: object does not validate as type " + type + ".");
        console.error(err);
    }
}
exports.checkType = checkType;
exports["default"] = checkType;
