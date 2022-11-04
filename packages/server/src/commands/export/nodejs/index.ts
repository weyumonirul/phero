import { ParsedPheroApp } from "@phero/core"
import compileExportToJS from "../compileExportToJS"
import { Export, ExportBundle, MetaExportFiles } from "../domain"
import { generateServiceHandlerFile } from "./generateServiceHandlerFile"
import generateLibFile from "./generateLibFile"
import generateServiceIndexFile from "./generateServiceIndexFile"

export default function generateNodeJSExport(
  app: ParsedPheroApp,
  metaExportFiles: MetaExportFiles,
): Export {
  const bundles: ExportBundle[] = app.services.map((service) => ({
    name: service.name,
    files: [
      ...compileExportToJS([
        {
          name: "lib.ts",
          nodes: generateLibFile(),
          isRoot: true,
        },
        {
          name: "handler.ts",
          nodes: generateServiceHandlerFile(service),
          isRoot: true,
        },
        {
          name: "index.ts",
          nodes: generateServiceIndexFile(),
          isRoot: true,
        },
      ]),
      ...Object.entries(metaExportFiles).map(
        ([name, content]: [string, string]) => ({ name, content }),
      ),
    ],
  }))

  return { bundles }
}
