import type { ScannerGroup } from "../../parser/DxfArrayScanner";
import type { Point3D } from '../../types';



export class parsePoint {
    public point = {} as Point3D;

    public startCode: number = 0;
    private code: number = 0;
    private value: any = 0;

    x: number | undefined = undefined;
    y: number | undefined = undefined;
    z: number | undefined = undefined;

    constructor() {
    }

    parseStart(point: ScannerGroup) {
        this.startCode = point.code
    }

    setPoint(point: ScannerGroup) {
        this.code = point.code
        this.value = point.value

        if (this.startCode === this.code)
            this.x = this.value

        if (this.startCode === this.code + 10)
            this.y = this.value
        else {
            const tmp = {
                x: this.x ?? 0,
                y: this.y ?? 0,
                z: this.z ?? 0
            }
            this.reset()
            return tmp
        }
        if (this.startCode === this.code + 20)
            this.z = this.value
        else {
            const tmp = {
                x: this.x ?? 0,
                y: this.y ?? 0,
                z: this.z ?? 0
            }
            this.reset()
            return tmp
        }

        return;
    }

    reset() {
        this.x = undefined
        this.y = undefined
        this.z = undefined
    }
}