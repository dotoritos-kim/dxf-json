import type { HydratedDxfObject, DxfDictionary, CommonDXFObject } from './types';

export function createObjectTree(objects: CommonDXFObject[]) {
    const objectMap = Object.fromEntries(
        objects.map((object) => [object.handle, object as HydratedDxfObject]),
    );

    for (const object of objects) {
        hydrateParent(object, objectMap);
        hydrateDictionary(object, objectMap);
    }

    return objects[0];
}

function hydrateParent(
    object: HydratedDxfObject,
    objectMap: Record<string, HydratedDxfObject>,
) {
    if (isDictionary(object) && object.ownerDictionaryIdSoft === '0') return;

    if (object.ownerDictionaryIdSoft) {
        object.ownerDictionarySoft = objectMap[object.ownerDictionaryIdSoft];
    }

    if (object.ownerDictionaryIdHard) {
        object.ownerDictionaryHard = objectMap[object.ownerDictionaryIdHard];
    }

    if (object.ownerObjectId) {
        object.ownerObject = objectMap[object.ownerObjectId];
    }
}

function hydrateDictionary(
    object: HydratedDxfObject,
    objectMap: Record<string, HydratedDxfObject>,
) {
    if (!isDictionary(object) || !object.entries) return;

    object.entries = Object.fromEntries(
        (object.entries as any).map(
            ({ name, objectId }: Record<string, string>) => [
                name,
                objectMap[objectId],
            ],
        ),
    );
}

function isDictionary(object: HydratedDxfObject): object is DxfDictionary {
    return (object as any).subclassMarker === 'AcDbDictionary';
}
