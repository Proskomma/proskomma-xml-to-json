import { Proskomma } from "proskomma";
import convert from "./convert.js";

export const serialize = async (
  name,
  file,
  attrsToKeep,
  elementsToIgnore,
  rootNode
) => {
  const converted = await convert(
    file,
    attrsToKeep,
    elementsToIgnore,
    rootNode
  );

  const pk = new Proskomma();
  const trimmedName = name.replace(".xml", "");

  pk.importDocument(
    { lang: "grc", abbr: `nestle-1904-${trimmedName}` },
    "nodes",
    JSON.stringify(converted)
  );

  // Serialize
  const idResult = await pk.gqlQuery("{ docSets { id } }");
  const docSetId = idResult.data.docSets[0].id;
  return pk.serializeSuccinct(docSetId);
};

export const serializeMany = async (
  files,
  attrsToKeep,
  elementsToIgnore,
  rootNode
) => {
  const serialized = await Promise.all(
    files.map(async ([name, file]) => {
      const serializedSingle = await serialize(
        name,
        file,
        attrsToKeep,
        elementsToIgnore,
        rootNode
      );
      return [name, serializedSingle];
    })
  );
  return serialized;
};

export default serialize;
