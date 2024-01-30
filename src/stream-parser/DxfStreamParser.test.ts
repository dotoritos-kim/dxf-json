import DxfStreamParser from "./DxfStreamParser"
import fs from "fs"

describe("DxfStreamParser Test", () => {
    test('export json', async () => {
        const parser = new DxfStreamParser()

        const testFile = fs.readFileSync("./sample/A_000217.dxf").buffer
        await parser.FeedFile(testFile)

        const dxf = JSON.stringify(parser.dxf)
        fs.writeFileSync("./sample/test.json", dxf)

        expect(dxf).not.toEqual(null);
    });
})