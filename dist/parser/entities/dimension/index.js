"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
const common_1 = require("./common");
class DimensionParser {
    parseEntity(scanner, curr) {
        const entity = {};
        while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
            if (curr.code === 0) {
                scanner.rewind();
                return entity;
            }
            (0, common_1.parseDimension)(entity, curr, scanner);
            curr = scanner.next();
        }
        return entity;
    }
}
DimensionParser.ForEntityName = 'DIMENSION';
exports.default = DimensionParser;
//# sourceMappingURL=index.js.map