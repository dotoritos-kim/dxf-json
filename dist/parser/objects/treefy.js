"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectTree = void 0;
function createObjectTree(objects) {
    const objectMap = Object.fromEntries(objects.map((object) => [object.handle, object]));
    for (const object of objects) {
        hydrateParent(object, objectMap);
        hydrateDictionary(object, objectMap);
    }
    return objects[0];
}
exports.createObjectTree = createObjectTree;
function hydrateParent(object, objectMap) {
    if (isDictionary(object) && object.ownerDictionaryIdSoft === '0')
        return;
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
function hydrateDictionary(object, objectMap) {
    if (!isDictionary(object) || !object.entries)
        return;
    object.entries = Object.fromEntries(object.entries.map(({ name, objectId }) => [
        name,
        objectMap[objectId],
    ]));
}
function isDictionary(object) {
    return object.subclassMarker === 'AcDbDictionary';
}
//# sourceMappingURL=treefy.js.map