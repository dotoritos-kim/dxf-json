"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextVerticalAlign = exports.TextHorizontalAlign = exports.TextGenerationFlag = void 0;
var TextGenerationFlag;
(function (TextGenerationFlag) {
    TextGenerationFlag[TextGenerationFlag["NONE"] = 0] = "NONE";
    TextGenerationFlag[TextGenerationFlag["MIRRORED_X"] = 2] = "MIRRORED_X";
    TextGenerationFlag[TextGenerationFlag["MIRRORED_Y"] = 4] = "MIRRORED_Y";
})(TextGenerationFlag || (exports.TextGenerationFlag = TextGenerationFlag = {}));
var TextHorizontalAlign;
(function (TextHorizontalAlign) {
    TextHorizontalAlign[TextHorizontalAlign["LEFT"] = 0] = "LEFT";
    TextHorizontalAlign[TextHorizontalAlign["CENTER"] = 1] = "CENTER";
    TextHorizontalAlign[TextHorizontalAlign["RIGHT"] = 2] = "RIGHT";
    TextHorizontalAlign[TextHorizontalAlign["ALIGNED"] = 3] = "ALIGNED";
    TextHorizontalAlign[TextHorizontalAlign["MIDDLE"] = 4] = "MIDDLE";
    TextHorizontalAlign[TextHorizontalAlign["FIT"] = 5] = "FIT";
})(TextHorizontalAlign || (exports.TextHorizontalAlign = TextHorizontalAlign = {}));
var TextVerticalAlign;
(function (TextVerticalAlign) {
    TextVerticalAlign[TextVerticalAlign["BASELINE"] = 0] = "BASELINE";
    TextVerticalAlign[TextVerticalAlign["BOTTOM"] = 1] = "BOTTOM";
    TextVerticalAlign[TextVerticalAlign["MIDDLE"] = 2] = "MIDDLE";
    TextVerticalAlign[TextVerticalAlign["TOP"] = 3] = "TOP";
})(TextVerticalAlign || (exports.TextVerticalAlign = TextVerticalAlign = {}));
//# sourceMappingURL=consts.js.map