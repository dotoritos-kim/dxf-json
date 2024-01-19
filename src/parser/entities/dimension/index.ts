import DxfArrayScanner, { ScannerGroup } from 'parser/DxfArrayScanner';
import { isMatched } from '../../shared';
import { parseDimension } from './common';
import { DimensionEntity } from './types';

export default class DimensionParser {
    static ForEntityName = 'DIMENSION';

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as DimensionEntity;

        while (!isMatched(curr, 0, 'EOF')) {
            if (curr.code === 0) {
                scanner.rewind();
                return entity;
            }

            parseDimension(entity, curr, scanner);
            curr = scanner.next();
        }

        return entity;
    }
}
