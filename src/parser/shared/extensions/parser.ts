import DxfArrayScanner, { ScannerGroup } from "@src/parser/DxfArrayScanner";
import { isMatched } from "../isMatched";

/** @internal */
export function parseExtensions(curr: ScannerGroup, scanner: DxfArrayScanner, entity: any) {
    while (isMatched(curr, 102)) {
        const rawValue = curr.value as string
        curr = scanner.next();

        if (!rawValue.startsWith('{')) {
            if (scanner.debug) {
                console.warn(`Invalid application group, expected to start with "{" but received: ${rawValue}`);
            }
            
            skipInvalidExtension(curr, scanner) // after this, scanner points at the next group of 102 }
            curr = scanner.next() 
            continue;
        }
    
        // application-name is form of {appName
        const appName = rawValue.slice(1).trim()

        entity.extensions ??= {}
        entity.extensions[appName] ??= []
        
        parseApplicationGroup(curr, scanner, entity.extensions[appName])
        curr = scanner.next()
    }
    scanner.rewind()
}

function skipInvalidExtension(curr: ScannerGroup, scanner: DxfArrayScanner) {
    while (!isMatched(curr, 102) && !isMatched(curr, 0, 'EOF')) {
        curr = scanner.next();
    }
}

function parseApplicationGroup(curr: ScannerGroup, scanner: DxfArrayScanner, groupCodes: any) {
    while (!isMatched(curr, 102, '}') && !isMatched(curr, 0, 'EOF')) {
        groupCodes.push(curr);
        curr = scanner.next();
    }
}