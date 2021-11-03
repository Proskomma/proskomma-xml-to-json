import { Proskomma } from "proskomma";
import convert from "./convert.js";

export const serialize = async (name, file, attrsToKeep, elementsToIgnore) => {
  const converted = convert(file, attrsToKeep, elementsToIgnore);

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

export const serializeMany = async (files, attrsToKeep, elementsToIgnore) => {
  const serialized = await Promise.all(
    files.map(async ([name, file]) => {
      const serializedSingle = await serialize(
        name,
        file,
        attrsToKeep,
        elementsToIgnore
      );
      return [name, serializedSingle];
    })
  );
  return serialized;
};

export default serialize;
