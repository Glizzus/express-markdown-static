import { RequestHandler } from "express";
import { Converter } from "showdown";
import { readFile, stat } from "fs/promises";
import { extname } from "path";

/**
 * The options for the Markdown middleware.
 */
export interface MarkdownStaticOptions {
  /**
   * The extensions which will be interpreted as Markdown files.
   */
  extensions?: string[];

  /**
   * Indicates whether the Markdown extension is required for a file
   * to be interpreted as Markdown.
   * If this is true, then
   */
  extensionRequired?: boolean;
}

const convert = new Converter();

async function htmlFromMarkdownFile(file: string) {
  const markdown = await readFile(file);
  const html = convert.makeHtml(markdown.toString());
  return html;
}

/**
 * Creates a markdown static middleware function
 * @param { string } baseDir - The Base directory
 * @param { Object } options - The options for the markdown static server
 * @param { string[] } options.extensions - The extensions to be identified as Markdown
 * @param { boolean } options.extensionRequired - If `false`, files without extensions will be served as Markdown
 * @returns a RequestHandler middleware function
 */
export default function markdownStatic(
  baseDir: string,
  options: Partial<MarkdownStaticOptions> = {}
): RequestHandler<Record<string, never>, string> {
  const opts: Required<MarkdownStaticOptions> = {
    extensionRequired: options.extensionRequired ?? true,
    extensions: options.extensions ?? [".md", ".markdown"],
  };
  const middleware: RequestHandler = async (req, res, next) => {
    const fileName = `${baseDir}/${req.path}`;
    try {
      await stat(fileName);
    } catch (err) {
      return next(err);
    }
    const ext = extname(fileName);
    if (opts.extensions.includes(ext) || (!opts.extensionRequired && !ext)) {
      const text = await htmlFromMarkdownFile(fileName);
      return res.send(text);
    }
    const text = await readFile(fileName);
    return res.send(text.toString());
  };
  return middleware;
}
