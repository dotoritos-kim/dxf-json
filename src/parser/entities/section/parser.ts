import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';

const DefaultSectionEntity = {
    vertices: [],
    backLineVertices: [],
};

const SectionEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 360,
        name: 'geometrySettingHardId',
        parser: Identity,
    },
    {
        code: 12,
        name: 'backLineVertices',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 93,
        name: 'numberOfBackLineVertices',
        parser: Identity,
    },
    {
        code: 11,
        name: 'vertices',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 92,
        name: 'verticesCount',
        parser: Identity,
    },
    {
        code: [63, 411],
        name: 'indicatorColor',
        parser: Identity,
    },
    {
        code: 70,
        name: 'indicatorTransparency',
        parser: Identity,
    },
    {
        code: 41,
        name: 'bottomHeight',
        parser: Identity,
    },
    {
        code: 40,
        name: 'topHeight',
        parser: Identity,
    },
    {
        code: 10,
        name: 'verticalDirection',
        parser: PointParser,
    },
    {
        code: 1,
        name: 'name',
        parser: Identity,
    },
    {
        code: 91,
        name: 'flag',
        parser: Identity,
    },
    {
        code: 90,
        name: 'state',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class SectionEntityParser {
    static ForEntityName = 'SECTION';
    private parser = createParser(
        SectionEntityParserSnippets,
        DefaultSectionEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity;
    }
}
