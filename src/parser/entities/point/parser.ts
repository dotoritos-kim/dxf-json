import type DxfArrayScanner from "../../DxfArrayScanner";
import type { ScannerGroup } from "../../DxfArrayScanner";
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';

const DefaultPointEntity = {
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
    angle: 0,
};

const PointEntityParserSnippets: DXFParserSnippet[] = [
    // Angle of the X axis for the UCS in effect
    // when the point was drawn.
    // used when PDMODE is nonzero.
    {
        code: 50,
        name: 'angle',
        parser: Identity,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: 10,
        name: 'position',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class PointEntityParser {
    static ForEntityName = 'POINT';
    private parser = createParser(
        PointEntityParserSnippets,
        DefaultPointEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity;
    }
}
