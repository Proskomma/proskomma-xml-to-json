import xml from "fast-xml-parser";

let attrsToKeep = [];
let elementsToIgnore = [];

const determineNextObjectKeys = (anObject) => {
  try {
    const keys = Object.keys(anObject);

    if (keys.length === 1 && keys[0] === '0') {
      return [];
    }

    const filteredKeys =
      keys?.filter(
        (key) => key !== "attrs" && !elementsToIgnore.includes(key)
      );

    return filteredKeys ?? [];
  } catch (e) {
    console.log(
      "Enountered a problem determing next keys for object.",
      anObject
    );
    throw e;
  }
};

const determineNextObjectKey = (anObject) => {
  try {
    const keys = Object.keys(anObject);
    return keys?.find(
      (key) => key !== "attrs" && !elementsToIgnore.includes(key)
    );
  } catch (e) {
    console.log(
      "Encountered a problem determining next key for object.",
      anObject
    );
    throw e;
  }
};

const gatherDesiredAttrs = (attrs) => {
  const gatheredAttrs = {};

  Object.entries(attrs ?? {})?.forEach((entry) => {
    const cleanedKey = entry[0].slice(2);

    if (attrsToKeep.includes(cleanedKey)) {
      gatheredAttrs[cleanedKey] = entry[1];
    }
  });

  return gatheredAttrs;
};

const processor = (anObject, objectKey, isFirst) => {
  let _object = anObject;
  let _first = isFirst;

  let id = null;
  if (_object && _object.attrs && _object.attrs["@_n"]) {
    id = _object.attrs["@_n"];
  }

  //console.log(id);

  // clause: 430010010010050
  // word:   430010010030010
  //if (id === "430010010010050") {
    //console.log("FOUND");
    //console.log(_object);
    //console.log("next?", determineNextObjectKey(_object));
    //console.log("next plural?", determineNextObjectKeys(_object));
  //}

  if (Array.isArray(_object)) {
    return _object.map((item) => processor(item, objectKey));
  }

  const nextObjectKeys = determineNextObjectKeys(_object);

  //console.log(nextObjectKeys);

  if (nextObjectKeys.length > 1) {
    return nextObjectKeys.map((key) => processor(_object[key], key));
  }

  let nextObjectKey = nextObjectKeys[0];

  if (!objectKey) {
    objectKey = nextObjectKey;
    if (_first) {
      _first = false;
      // skip ahead by one
      _object = anObject[nextObjectKey];
      nextObjectKey = determineNextObjectKey(_object);
    }
  }

  const attrs = gatherDesiredAttrs(_object.attrs);

  if (!nextObjectKey || nextObjectKey === "#text") {
    return {
      content: { elementType: objectKey, text: _object["#text"], ...attrs },
      children: [],
    };
  }

  const nextObject = _object[nextObjectKey];
  const nextObjectProperlyWrapped = Array.isArray(nextObject)
    ? nextObject
    : [nextObject];

  return {
    content: {
      elementType: objectKey,
      ...attrs,
    },
    children: processor(nextObjectProperlyWrapped, nextObjectKey),
  };
};

const convert = (xmlData, requestedAttrs, ignoredElements) => {
  attrsToKeep = requestedAttrs;
  elementsToIgnore = ignoredElements;

  const parsedXml = xml.parse(xmlData, {
    ignoreAttributes: false,
    arrayMode: false,
    attrNodeName: "attrs",
  });

  //console.log(parsedXml);

  return processor(parsedXml, undefined, true);
};

export default convert;
