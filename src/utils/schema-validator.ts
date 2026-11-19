import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { createSchema } from "genson-js";

const SCHEMA_BASE_PATH = path.resolve(__dirname, "../../response-schemas");
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export async function validateSchema(
  dirName: string,
  fileName: string,
  responseBody: unknown,
  createSchemaFlag = false,
): Promise<void> {
  const schemaPath = path.join(
    SCHEMA_BASE_PATH,
    dirName,
    `${fileName}_schema.json`,
  );
  if (createSchemaFlag) {
    await generateNewSchema(responseBody, schemaPath);
  }
  const validate = ajv.compile(await loadSchema(schemaPath));
  if (!validate(responseBody)) {
    throw new Error(
      `Schema validation ${fileName}_schema.json failed:\n` +
        `${JSON.stringify(validate.errors, null, 2)}\n\n` +
        `Actual response body:\n${JSON.stringify(responseBody, null, 2)}`,
    );
  }
}
async function loadSchema(schemaPath: string) {
  try {
    return JSON.parse(await fs.readFile(schemaPath, "utf-8"));
  } catch (error) {
    throw new Error(
      `Failed to read the schema file ${schemaPath}: ${(error as Error).message}`,
    );
  }
}
async function generateNewSchema(
  responseBody: unknown,
  schemaPath: string,
): Promise<void> {
  const schema = createSchema(responseBody as object);
  await fs.mkdir(path.dirname(schemaPath), { recursive: true });
  await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2));
}
