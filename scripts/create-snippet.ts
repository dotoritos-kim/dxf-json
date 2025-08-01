import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

/*
  This script create boilerplate snippet for each ENTITY / OBJECT.
  Legacy ENTITY implementation differs from this one.
*/
const args = process.argv.slice(2);
const modulePath = args[0]
const modulePathTokens = modulePath?.split('/').filter(Boolean)

if (modulePathTokens?.length !== 2) {
  console.error('Usage: npm run new /objects_or_entities/name');
  process.exit(1);
}

const Singular: Record<string, string> = {
  objects: 'Object',
  entities: 'Entity',
}

const basePath = join(process.cwd(), 'src/parser');
const fullPath = join(basePath, modulePath);

const moduleType = modulePathTokens[0].toLowerCase()
const moduleName = capitalize(modulePathTokens[1])

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

mkdirSync(fullPath, { recursive: true });

const indexContent = `export type * from './types'
export * from './consts'
export * from './parser'
`;

const entityName = `${moduleName}DXF${Singular[moduleType]}`
const snippetName = `${entityName}Snippet`

writeFileSync(join(fullPath, 'index.ts'), indexContent);
writeFileSync(join(fullPath, 'types.ts'), `export interface ${entityName} {}`);
writeFileSync(join(fullPath, 'consts.ts'), 'export {}');

// Create a parser file
writeFileSync(join(fullPath, 'parser.ts'), `import type DxfArrayScanner from '@src/parser/DxfArrayScanner';
import type { ScannerGroup } from '@src/parser/DxfArrayScanner';
import { type DXFParserSnippet, Identity } from '@src/parser/shared/parserGenerator';

export const ${snippetName}: DXFParserSnippet[] = [
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  }
]`);

// Create a sample partial DXF file
writeFileSync(join(fullPath, 'tc0.partial_dxf'), '')

// Create a test file
const requiredDefaultSnippets = moduleType === 'objects' ? 'CommonObjectSnippets' : 'CommonEntitySnippets';

writeFileSync(join(fullPath, 'parser.test.ts'), `import { readFileSync } from 'fs'
import { join } from 'path'
import DxfArrayScanner from '@src/parser/DxfArrayScanner'
import { createParser } from '@src/parser/shared/parserGenerator'
import { ${snippetName} } from './parser'
import { ${requiredDefaultSnippets} } from '../shared'

describe('${entityName} parser', () => {
  test('tc0', () => {
      const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
      const scanner = new DxfArrayScanner(content.split("\\n"));
      const parser = createParser([ 
        ...${snippetName},
        ...${requiredDefaultSnippets},
      ]);
  })
})`);


console.log(`Created module at ${fullPath}`);