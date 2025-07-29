import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { isMatched } from '../../shared';
import { parseDimension } from './common';
import type { DimensionEntity } from './types';

export class DimensionParser {
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
