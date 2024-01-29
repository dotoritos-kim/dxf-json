import type { ViewportEntity } from './types';
export default class ViewportParser {
    static ForEntityName: string;
    parseEntity(scanner: any, curr: any): ViewportEntity;
}
