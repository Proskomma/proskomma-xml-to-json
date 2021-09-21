import fileLoader from "./fileLoader.js";
import fileWriter from "./fileWriter.js";
import xml from "fast-xml-parser";

let attrsToKeep = [];

const determineNextObjectKey = (anObject) => {
  try {
    const keys = Object.keys(anObject);
    return keys?.find((key) => key !== "attrs");
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

  if (Array.isArray(_object)) {
    return _object.map((item) => processor(item, objectKey));
  }

  let nextObjectKey = determineNextObjectKey(_object);

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

const convert = (xmlData, requestedAttrs) => {
  attrsToKeep = requestedAttrs;

  const parsedXml = xml.parse(xmlData, {
    ignoreAttributes: false,
    arrayMode: false,
    attrNodeName: "attrs",
  });

  //console.log(parsedXml);

  return processor(parsedXml, undefined, true);
};

export default convert;
