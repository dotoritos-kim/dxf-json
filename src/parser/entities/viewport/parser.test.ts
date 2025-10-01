import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner'
import { ViewportParser } from './parser'
import type { ViewportEntity } from './types';
import { DefaultLightingType, OrthographicType, RenderMode, UCSPerViewport } from '../../..';

describe('VIEWPORT', () => {
  test('subclassMarker', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new ViewportParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'VIEWPORT'

    expect(entity).toMatchObject<ViewportEntity>({
      type: 'VIEWPORT',
      handle: '880',
      ownerBlockRecordSoftId: '1B',
      layer: '0',
      subclassMarker: 'AcDbViewport',
      viewportCenter: { x: 0, y: 0, z: 0 },
      width: 300,
      height: 220,
      status: 2,
      viewportId: 2,
      displayCenter: { x: 0, y: 0 },
      snapBase: { x: 0, y: 0 },
      snapSpacing: { x: 1, y: 1 },
      gridSpacing: { x: 1, y: 1 },
      viewDirection: { x: 0, y: 0, z: 1 },
      targetPoint: { x: 0, y: 0, z: 0 },
      perspectiveLensLength: 50,
      frontClipZ: 0,
      backClipZ: 0,
      viewHeight: 1,
      snapAngle: 0,
      viewTwistAngle: 0,
      circleZoomPercent: 100,
      statusBitFlags: 622688,
      clippingBoundaryId: '881',
      sheetName: '',
      renderMode: RenderMode.OPTIMIZED_2D,
      ucsPerViewport: UCSPerViewport.HAS_OWN_UCS,
      iconFlag: 0,
      ucsOrigin: { x: 0, y: 0, z: 0 },
      ucsXAxis: { x: 1, y: 0, z: 0 },
      ucsYAxis: { x: 0, y: 1, z: 0 },
      orthographicType: OrthographicType.NON_ORTHOGRAPHIC,
      elevation: 0,
      shadePlotMode: 0,
      majorGridFrequency: 5,
      visualStyleId: '2F',
      isDefaultLighting: true,
      defaultLightingType: DefaultLightingType.TWO_DISTANT_LIGHTS,
      brightness: 0,
      contrast: 0,
      ambientLightColorIndex: 256
    })
  })
})