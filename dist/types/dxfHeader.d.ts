import type { Measurement } from '../consts';
import type { DefaultDxfHeaderVariables } from '../consts/header';
export type DxfHeaderVariable = 
/** Hard-pointer ID to visual style while creating 3D solid primitives */
'DRAGVS'
/** Represents the ACI color index of the "interference objects" created during the INTERFERE command */
 | 'INTERFERECOLOR'
/** Hard-pointer ID to the visual style for interference objects */
 | 'INTERFEREOBJVS'
/** Hard-pointer ID to the visual style for the viewport during interference checking */
 | 'INTERFEREVPVS' | 'OBSLTYPE'
/** Percent ambient/diffuse light; range 1-100 */
 | 'SHADEDIF' | 'MEASUREMENT';
export type DxfHeader = typeof DefaultDxfHeaderVariables & {
    MEASUREMENT: Measurement;
} & Record<string, any>;
