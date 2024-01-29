"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttDefMTextFlag = exports.AttributeFlag = void 0;
var AttributeFlag;
(function (AttributeFlag) {
    AttributeFlag[AttributeFlag["NONE"] = 0] = "NONE";
    AttributeFlag[AttributeFlag["INVISIBLE"] = 1] = "INVISIBLE";
    AttributeFlag[AttributeFlag["CONSTANT"] = 2] = "CONSTANT";
    AttributeFlag[AttributeFlag["VERIFICATION_REQUIRED"] = 4] = "VERIFICATION_REQUIRED";
    AttributeFlag[AttributeFlag["PRESET"] = 8] = "PRESET";
})(AttributeFlag || (exports.AttributeFlag = AttributeFlag = {}));
var AttDefMTextFlag;
(function (AttDefMTextFlag) {
    AttDefMTextFlag[AttDefMTextFlag["MULTILINE"] = 2] = "MULTILINE";
    AttDefMTextFlag[AttDefMTextFlag["CONSTANT_MULTILINE"] = 4] = "CONSTANT_MULTILINE";
})(AttDefMTextFlag || (exports.AttDefMTextFlag = AttDefMTextFlag = {}));
//# sourceMappingURL=consts.js.map