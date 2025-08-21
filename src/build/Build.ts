import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import fg, { Options } from "fast-glob";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { rollup as _rollup, RollupLog, RollupOptions } from "rollup";

/**
 * Collection of utilities for building/bundling `Vanilla.ts` based code.
 */

/**
 * Get the filenames of the modules an application/a script uses. This function uses _Rollup_ to
 * determine the filenames.
 * @param entryPoint The entry point of the script/application to be analyzed (source filename).
 * @param useNodeResolve Use the plugin `@rollup/plugin-node-resolve` (calls `nodeResolve()` without
 * parameters). Default: `true`.
 * @param includeNodeModules Include all imported Node module files. If `false`, module filenames
 * that contain the string `node_modules` will be discarded from the output. Default: `false`.
 * @param useCommonJS Use the plugin `@rollup/plugin-commonjs` (calls `commonjs()` without
 * parameters). Default: `false`.
 * @param useJSON Use the plugin `@rollup/plugin-json` (calls `json()` without parameters). Default:
 * `false`.
 * @param rollupOptions Additional options for _Rollup_. Default: `{}`.
 * @returns An object containing an array of filenames (`Modules`) used/imported by `entryPoint` and
 * an array of warnings (`Warnings`) created by _Rollup_ during analyzing `entryPoint`.
 */
export async function getImportedModuleFileNames(
    entryPoint: string,
    useNodeResolve: boolean = true,
    includeNodeModules: boolean = false,
    useCommonJS: boolean = false,
    useJSON: boolean = false,
    rollupOptions: RollupOptions = {}
): Promise<{ Modules: string[]; Warnings: RollupLog[]; }> { // eslint-disable-line jsdoc/require-jsdoc
    const modules = new Set<string>();
    const warnings: RollupLog[] = [];
    const bundle = await _rollup({
        /* eslint-disable jsdoc/require-jsdoc */
        ...rollupOptions,
        input: entryPoint,
        onwarn(warning: RollupLog) {
            warnings.push(warning);
        },
        plugins: [
            useNodeResolve
                ? nodeResolve()
                : undefined,
            useCommonJS
                // @ts-ignore
                ? commonjs()
                : undefined,
            useJSON
                // @ts-ignore
                ? json()
                : undefined,
        ],
        /* eslint-enable */
    });
    const outputs = (await bundle.generate({})).output; // eslint-disable-line jsdoc/require-jsdoc
    for (const output of outputs.filter(e => e.type === "chunk")) {
        for (const module of output.moduleIds) {
            if (!module.includes("?") && !module.includes("\0")) {
                if (includeNodeModules) {
                    modules.add(module);
                } else {
                    if (!module.includes("node_modules")) {
                        modules.add(module);
                    }
                }
            }
        }
    }
    return {
        /* eslint-disable jsdoc/require-jsdoc */
        Modules: [...modules.values()],
        Warnings: warnings
        /* eslint-enable */
    };
}

/* eslint-disable no-irregular-whitespace */
/**
 * Options for processing CSS input files.
 */
type CSSFileProcessingOptions = {
    /**
     * Prepends a header before the content of every CSS file in the output. `Header` can have the
     * following values:
     * - `file`: A CSS comment in the following form is prepended (including an empty following
     *   line):\
     *   `/* <filename> *​/`
     * - `region`: A CSS comment in the following form is prepended (including an empty following
     *   line):\
     *   `/* #region <filename> *​/`\
     *   `#region` is a marker that enables code folding based on the file content in editors like
     *   VS Code (see also `Footer`).
     * - `false`: Nothing is prepended.
     * - If `Header` is a function, the return value of the function (`string`) is prepended. The
     *   function receives the fully resolved filename of the CSS input file as the first parameter
     *   and the fully resolved path of `RelativeTo` as the second parameter (unless `RelativeTo` is
     *   an empty string, in which case the second parameter is also an empty string). It's not
     *   necessary to terminate the return value with `\n` but the return value itself can be
     *   formatted as desired (e.g. with multiple lines, indentation etc.). Make sure, that the
     *   return value conforms to valid CSS.
     *
     * Default: `region`.
     * @see {@link CSSFileProcessingOptions.RelativeTo} for information on how the filenames written in the comments are formed.
     */
    Header?: "file" | "region" | false | `/*${string}*/` | ((fileName: string, relativeTo: string) => string);
    /**
     * Appends a footer after the content of every CSS file in the output. `Footer` can have the
     * following values:
     * - `cmt`: A CSS comment in the following form is appended (including an empty following
     *   line):\
     *   `/* *​/`
     * - `end-region`: A CSS comment in the following form is appended (including an empty following
     *   line):\
     *   `/* #endregion *​/`\
     *   `#endregion` is a marker that enables code folding based on the file content in editors
     *   like VS Code (see also `Header`).
     * - `end-region-file`: A CSS comment in the following form is appended (including an empty
     *   following line):\
     *   `/* #endregion <filename> *​/`\
     *   `#endregion` is a marker that enables code folding based on the file content in editors
     *   like VS Code (see also `Header`).
     * - `false`: Nothing is appended.
     * - If `Footer` is a string unequeal to `cmt`, `end-region` and `end-region-file` this string
     *   is appended. Make sure, that the string conforms to valid CSS.
     * - If `Footer` is a function, the return value of the function (`string`) is appended. The
     *   function receives the fully resolved filename of the CSS input file as the first parameter
     *   and the fully resolved path of `RelativeTo` as the second parameter (unless `RelativeTo` is
     *   an empty string, in which case the second parameter is also an empty string). It's not
     *   necessary to terminate the return value with `\n` but the return value itself can be
     *   formatted as desired (e.g. with multiple lines, indentation etc.). Make sure, that the
     *   return value conforms to valid CSS.
     *
     * Default : `end-region`
     * @see {@link CSSFileProcessingOptions.RelativeTo} for information on how the filenames written in the comments are formed.
     */
    Footer?: "cmt" | "end-region" | "end-region-file" | false | `/*${string}*/` | ((fileName: string, relativeTo: string) => string);
    /**
     * `RelativeTo` controls the output of the filename for `Header` and `Footer`.
     * - If `RelativeTo` is `undefined`, `RelativeTo` will be resolved to the current working
     *   directory (`process.cwd()`).
     * - If `RelativeTo` is an empty string, the filename written in the comments produced by
     *   `Header` and `Footer` is always an absolute path.
     * - Any other string is resolved to an absolute path which is used to resolve the _relative_
     *   path to the CSS filename in the comments produced by `Header` and `Footer`.
     *
     * Default: `undefined` (leads to `process.cwd()`).
     */
    RelativeTo?: string;
    /**
     * Skip empty lines in CSS files. If `SkipEmptyLines` is `true`, lines will also be trimmed at
     * the end. __Note:__ Empty lines at the beginning and the end of a file are allways discarded.\
     * Default: `true`.
     */
    SkipEmptyLines?: boolean;
};
/* eslint-enable no-irregular-whitespace */

/**
 * Options for finding and processing CSS input files.
 */
type CSSFileOptions = {
    /** A glob pattern as defined by the node module `fast-glob`. */
    Pattern: string | string[];
    /** Glob options as defined by the node module `fast-glob`. */
    GlobOptions?: Options;
} & CSSFileProcessingOptions;

/**
 * Options for finding and processing CSS input files which are used by an application/a script.
 */
type ScriptFileOptions = {
    /** The name of the source code file to be analyzed. */
    SourceFile: string;
    /**
     * Defines glob patterns and glob options for directories/files to be excuded from the list of
     * modules that are imported by `SourceFile`. This can be used to exclude directories/files in
     * which/for which a search for associated CSS files should not be executed. An example for a
     * typical Vanilla.ts application: a chat application uses a module called `Dialog.js` from the
     * directory `./src/shared`, which is not used for the user interface. Without excluding the
     * directory `./src/shared` (or the file `./src/shared/Dialog.js`), the file `Dialog.css` would
     * be loaded from the Node module `@vanilla-ts/components`, since a module named `Dialog.js` is
     * also present there.\
     * Default: `{}`.
     */
    IgnoreSourceFiles: {
        /** A glob pattern as defined by the node module `fast-glob`. */
        Pattern: string | string[];
        /** Glob options as defined by the node module `fast-glob`. */
        GlobOptions?: Options;
    };
    /**
     * Defines glob patterns and glob options for additional directories/files to be scanned when
     * looking up CSS files potentially used by `SourceFile`.\
     * Default: `{}`.
     * @see The documentation of the function {@link concatCSS()}.
     */
    Lookup?: {
        /** A glob pattern as defined by the node module `fast-glob`. */
        Pattern: string | string[];
        /** Glob options as defined by the node module `fast-glob`. */
        GlobOptions?: Options;
    };
    /**
     * An array of file extensions. Can be used to load other CSS types like Sass, Less etc. The
     * extensions are checked in the order they appear in `FileExtensions`. If a CSS file with a
     * matching extension is found, this file is used and processing continues with the next found
     * module source file. Using a leading dot for an extension is optional, e.g. `".css"` is
     * equivalent to `"css"`.\
     * Default: ["css"]
     */
    FileExtensions?: string[];
    /**
     * Use the plugin `@rollup/plugin-node-resolve` (calls `nodeResolve()` without parameters).\
     * Default: `true`.
     */
    UseNodeResolve?: boolean;
    /**
     * Include all imported Node module files. If `false`, module filenames that contain the string
     * `node_modules` will be discarded from the output.\
     * Default: `false`.
     */
    IncludeNodeModules?: boolean;
    /**
     * Use the plugin `@rollup/plugin-commonjs` (calls `commonjs()` without parameters).\
     * Default: `false`.
     */
    UseCommonJS?: boolean;
    /**
     * Use the plugin `@rollup/plugin-json` (calls `json()` without parameters).\
     * Default: `false`.
     */
    UseJSON?: boolean;
    /**
     * Additional options for _Rollup_.\
     * Default: `{ external: ["@vanilla-ts/core", "@vanilla-ts/dom"] }`.\
     * __Note:__ The default exclusion of the modules `@vanilla-ts/core` and `@vanilla-ts/dom` here
     * is done to prevent the duplicate inclusion of CSS files with common names like `Dialog.css`.
     * If, for example, an application uses the `Dialog.js` module from `@vanilla-ts/components` the
     * content of the file `Dialog.css` would appear twice in the generated output since the module
     * `Dialog.js` from `@vanilla-ts/components` has a dependency to the module `Dialog.js` from
     * `@vanilla-ts/dom` so there would be two imported files named `Dialog.js` which causes this
     * behaviour. In general neither `@vanilla-ts/core` nor `@vanilla-ts/dom` have CSS files, so
     * by default they can always be excluded.
     */
    RollupOptions?: RollupOptions;
    /**
     * Debug options.\
     * Default: `{}`.
     */
    Debug: {
        /**
         * If `true`, write the list of module files determined by _Rollup_ to `stderr`. This is the
         * complete list of modules imported by `SourceFile`.\
         * Default: `false`.
         */
        Modules: boolean;
        /**
         * If `true`, write the list of files determined by `IgnoreSourceFiles` to `stderr`.\
         * Default: `false`.
         */
        Ignored: boolean;
        /**
         * If `true`, write the list of module files used by `SourceFile` to `stderr`. This is the
         * list of modules files _after filtering out files determined by `IgnoreSourceFiles`_.\
         * Default: `false`.
         */
        Used: boolean;
        /**
         * If `true`, write the list of warnings generated by _Rollup_ to `stderr`.\
         * Default: `false`.
         */
        Warnings: boolean;
    };
} & CSSFileProcessingOptions;

/**
 * Options for concatenating CSS files.
 */
export type ConcatCSSOptions = {
    /**
     * An array of `CSSFileOptions` for files which will be concatenated and put at the beginning of
     * the generated CSS output (file).\
     * Default: `[]`.
     */
    Pre?: CSSFileOptions[];
    /**
     * An array of `ScriptFileOptions`. Used to analyze script files for CSS files used.\
     * Default: `[]`.
     */
    ScriptFiles?: ScriptFileOptions[];
    /**
     * An array of `CSSFileOptions` for files which will be concatenated and put at the end of the
     * generated CSS output (file).\
     * Default: `[]`.
     */
    Post?: CSSFileOptions[];
    /**
     * Strip trailing empty lines from the output. If `false` one or more empty lines may appear at
     * the end of the output.\
     * Default: `true`.
     */
    StripEmptyLinesAtEnd?: boolean;
    /**
     * The filename of the output file to which the concatenated CSS input files will be written. If
     * this is omitted or an empty string no output file is written.
     */
    OutputFile?: string;
};

/* eslint-disable no-irregular-whitespace */
/**
 * Concatenates the content of multiple CSS files that are used by an application/a script into a
 * single CSS source/file. The process runs in a maximum of three steps:
 *
 * 1. Determine and merge CSS files that should be _at the beginning_ of the output to be generated.
 * This step is configured by the settings in `Pre` and is optional. Several glob patterns can be
 * specified as the source, which are processed in the specified order. The results of the glob
 * patterns (file list) are read in, combined into a single block and added to the output.
 *
 * 2. Determine the CSS files that are used by an application/script. This step is configured by the
 * settings in `ScriptFiles` and is optional. The function first determines a list of all JavaScript
 * files that would be loaded by the script file specified in `ScriptFileOptions.SourceFile` at
 * runtime ('module'). Next the files determined by `ScriptFileOptions.IgnoreSourceFiles` are
 * excluded from this list. Then a list of files is determined using the glob patterns from `Lookup`
 * ('candidates'). For _each_ 'module' file, 2 processing steps are performed:
 *   - It is checked whether a file with the same name but the file extension `css` exists in the
 *     list of 'candidates' (regardless of the directory in which the 'candidate' is located). If
 *     this is the case, this CSS file is loaded and added to the output.
 *   - A check is made to see whether a 'candidate' file is located _directly next to_ the 'module'
 *     file currently being viewed. If this is the case, this CSS file is also loaded and added to
 *     the output.
 *
 * 3. Determine and merge CSS files that should be _at the end_ of the output to be generated. This
 * step works in exactly the same way as step 1 and is configured by the settings in `Post` and is
 * also optional.
 *
 * The following sample script can be used for concatenating CSS files in a typical Vanilla.ts
 * appliction:
 * @example
 * ```typescript
 * import { concatCSS } from "@vanilla-ts/core/build";
 *
 * await concatCSS({
 *   // Get basic theme CSS files from module `@vanilla-ts/components`.
 *   Pre: [{
 *     Pattern: [
 *       "./node_modules/@vanilla-ts/components/themes/vts/Vars.css",
 *       "./node_modules/@vanilla-ts/components/themes/vts/Common.css"
 *     ],
 *     RelativeTo: "./node_modules/"
 *   }],
 *   ScriptFiles: [
 *     // Step 1: Get used CSS files only from module `@vanilla-ts/components`.
 *     {
 *       SourceFile: "./build/js/src/client/ClientApp.js",
 *       IgnoreSourceFiles: {
 *         Pattern: "./build/js/src/shared/**​/*.js"
 *       },
 *       Lookup: {
 *         Pattern: ["./node_modules/@vanilla-ts/components/themes/**​/*.css"]
 *       },
 *       RelativeTo: "./node_modules/",
 *       RollupOptions: {
 *         external: ["@vanilla-ts/core", "@vanilla-ts/dom", "skip-module1", "skip-module2", ...]
 *       },
 *     },
 *     // Step 2: Get used CSS only from the local sources. This step could be merged into step 1
 *     // with the same technical CSS output, the only reason for keeping this separate is that the
 *     // `RelativeTo` setting here produces a nicer output in the header comments for the local
 *     // files:
 *     // `#region ui/DateSelector.css` vs. `#region ../src/client/ui/DateSelector.css`
 *     {
 *       SourceFile: "./build/js/src/client/ClientApp.js",
 *       IgnoreSourceFiles: {
 *         Pattern: "./build/js/src/shared/**​/*.js"
 *       },
 *       Lookup: {
 *         Pattern: [
 *           "./src/client/components/**​/*.css",
 *           "./src/client/ui/**​/*.css",
 *           "./src/client/*.css"
 *         ]
 *       },
 *       RelativeTo: "./src/client",
 *       UseNodeResolve: false // Skip resolving modules outside `./src`, already done in step 1!
 *     }
 *   ],
 *   OutputFile: "style.css"
 * })
 * ```
 * @param options Options for concatenating CSS files.
 * @returns An array of strings containing all lines of all CSS files processed according to
 * `options`.
 */
export async function concatCSS(options: ConcatCSSOptions): Promise<string[]> {
    const processedCSSFies = new Set<string>();

    /**
     * Get an array of CSS file processing options.
     * @param cssFileOptions An input array of CSS file processing options.
     * @returns An array of CSS file processing options where all members are present.
     */
    const getCSSFileOptions = (cssFileOptions?: CSSFileOptions[]): Required<CSSFileOptions>[] => {
        return cssFileOptions
            ? cssFileOptions.map(e => ({
                /* eslint-disable jsdoc/require-jsdoc */
                Pattern: e.Pattern,
                GlobOptions: e.GlobOptions ?? {},
                Header: e.Header ?? "region",
                Footer: e.Footer ?? "end-region",
                RelativeTo: e.RelativeTo ?? "\0", // Hack: marks `RelativeTo` as `undefined`.
                SkipEmptyLines: e.SkipEmptyLines ?? true
                /* eslint-enable */
            }))
            : [];
    };

    /**
     * Get an array of script file processing options.
     * @param options An input array of script file processing options.
     * @returns An array of script file processing options where all members are present.
     */
    const getScriptFileOptions = (options?: ScriptFileOptions[]): Required<ScriptFileOptions>[] => {
        return options
            ? options.map(e => ({
                /* eslint-disable jsdoc/require-jsdoc */
                SourceFile: e.SourceFile ?? "",
                IgnoreSourceFiles: { Pattern: e.IgnoreSourceFiles?.Pattern ?? "", GlobOptions: e.IgnoreSourceFiles?.GlobOptions ?? {} },
                Lookup: { Pattern: e.Lookup?.Pattern ?? "", GlobOptions: e.Lookup?.GlobOptions ?? {} },
                FileExtensions: e.FileExtensions ? [...e.FileExtensions] : [".css"],
                UseNodeResolve: e.UseNodeResolve ?? true,
                IncludeNodeModules: e.IncludeNodeModules ?? false,
                UseCommonJS: e.UseCommonJS ?? false,
                UseJSON: e.UseJSON ?? false,
                RollupOptions: e.RollupOptions ? { ...e.RollupOptions } : { external: ["@vanilla-ts/dom", "@vanilla-ts/core"] },
                Debug: e.Debug ? { ...e.Debug } : { Modules: false, Ignored: false, Used: false, Warnings: false },
                Header: e.Header ?? "region",
                Footer: e.Footer ?? "end-region",
                RelativeTo: e.RelativeTo ?? "\0", // Hack: marks `RelativeTo` as `undefined`.
                SkipEmptyLines: e.SkipEmptyLines ?? true
                /* eslint-enable */
            }))
            : [];
    };

    const opts = {
        /* eslint-disable jsdoc/require-jsdoc */
        Pre: getCSSFileOptions(options.Pre),
        Post: getCSSFileOptions(options.Post),
        ScriptFiles: getScriptFileOptions(options.ScriptFiles),
        StripEmptyLinesAtEnd: options.StripEmptyLinesAtEnd ?? true,
        OutputFile: options.OutputFile ? options.OutputFile : "",
        /* eslint-enable */
    } as ConcatCSSOptions & {
        /* eslint-disable jsdoc/require-jsdoc */
        Pre: Required<CSSFileOptions>[];
        ScriptFiles: Required<ScriptFileOptions>[];
        Post: Required<CSSFileOptions>[];
        /* eslint-enable */
    };

    /**
     * Read and return the content of a CSS file.
     * @param fileName The filename of the CSS file to be read.
     * @param options Options for processing the CSS file given by `fileName`.
     * @returns An array of strings containing the content of the CSS file processed according to
     *  `options`. If `fileName` already has been processd before, an empty array is returned.
     */
    const getCSSFileContent = (fileName: string, options: Required<CSSFileProcessingOptions>): string[] => {
        const fullCSSFileName = path.resolve(fileName);
        if (processedCSSFies.has(path.resolve(fullCSSFileName))) {
            return [];
        }
        const relativeFrom = options.RelativeTo === "\0" // `RelativeTo` was originally `undefined`.
            ? process.cwd()
            : options.RelativeTo === ""
                ? ""
                : path.resolve(options.RelativeTo);
        const resolvedFileName = options.RelativeTo === "\0" // `RelativeTo` was originally `undefined`.
            ? path.relative(process.cwd(), fullCSSFileName)
            : options.RelativeTo === ""
                ? fullCSSFileName
                : path.relative(relativeFrom, fullCSSFileName);
        const lines = readFileSync(fullCSSFileName, { encoding: "utf-8" }).split("\n"); // eslint-disable-line jsdoc/require-jsdoc
        while (lines[lines.length - 1] !== undefined && lines[lines.length - 1].trimEnd() === "") {
            lines.pop();
        }
        while (lines[0] !== undefined && lines[0].trimEnd() === "") {
            lines.shift();
        }
        const result: string[] = [];
        options.Header === false
            ? undefined
            : options.Header === "file"
                ? result.push(`/* ${resolvedFileName} */`)
                : options.Header === "region"
                    ? result.push(`/* #region ${resolvedFileName} */`)
                    : typeof options.Header === "string"
                        ? result.push(options.Header)
                        : typeof options.Header === "function"
                            ? result.push(options.Header(fullCSSFileName, relativeFrom))
                            : undefined;
        options.SkipEmptyLines
            ? result.push(...lines.map(e => e.trimEnd()).filter(e => e !== ""))
            : result.push(...lines);
        options.Footer === false
            ? undefined
            : options.Footer === "cmt"
                ? result.push("/* */\n")
                : options.Footer === "end-region"
                    ? result.push("/* #endregion */\n")
                    : options.Footer === "end-region-file"
                        ? result.push(`/* #endregion ${resolvedFileName} */\n`)
                        : typeof options.Footer === "string"
                            ? result.push(options.Footer)
                            : typeof options.Footer === "function"
                                ? result.push(options.Footer(fullCSSFileName, relativeFrom))
                                : undefined;
        processedCSSFies.add(fullCSSFileName);
        return result;
    };

    /**
     * Find, read and concat CSS files.
     * @param options Options for finding, reading and concatenating CSS files (based on file
     * globbing).
     * @returns An array of strings containing all lines of all CSS files processed according to
     *  `options`.
     */
    const concatCSSFiles = (options: Required<CSSFileOptions>[]): string[] => {
        const result: string[] = [];
        for (const opts of options) {
            for (const fileName of fg.globSync(opts.Pattern, opts.GlobOptions)) {
                result.push(...getCSSFileContent(fileName, opts));
            }
        }
        return result;
    };

    /**
     * Find, read and concat CSS files.
     * @param options Options for finding, reading and concatenating CSS files (based on the modules
     * a script file uses).
     * @returns An array of strings containing all lines of all CSS files processed according to
     *  `options`.
     */
    const processScriptFiles = async (options: Required<ScriptFileOptions>[]): Promise<string[]> => {
        const result: string[] = [];
        for (const opts of options) {
            const imports = await getImportedModuleFileNames(
                opts.SourceFile,
                opts.UseNodeResolve,
                opts.IncludeNodeModules,
                opts.UseCommonJS,
                opts.UseJSON,
                opts.RollupOptions,
            );
            const ignoredModules = ((typeof opts.IgnoreSourceFiles.Pattern === "string" && opts.IgnoreSourceFiles.Pattern !== "") || opts.IgnoreSourceFiles.Pattern.length > 0
                ? fg.globSync(opts.IgnoreSourceFiles.Pattern, opts.IgnoreSourceFiles.GlobOptions)
                : []).map(e => path.resolve(e));
            const modules = imports.Modules.filter(e => !ignoredModules.includes(e));
            !opts.Debug.Modules || console.error("[concatCSS] modules:", imports.Modules);
            !opts.Debug.Ignored || console.error("[concatCSS] ignored:", ignoredModules);
            !opts.Debug.Used || console.error("[concatCSS] used:", modules);
            !opts.Debug.Warnings || console.error("[concatCSS] warnings:", imports.Warnings);
            const lookupFiles = (typeof opts.Lookup.Pattern === "string" && opts.Lookup.Pattern !== "") || opts.Lookup.Pattern.length > 0
                ? fg.globSync(opts.Lookup.Pattern, opts.Lookup.GlobOptions)
                : [];
            for (const fileName of modules) {
                const baseModuleName = path.basename(fileName);
                // Find a single file in the lookup files which satisfies the following condition:
                // <baseModuleName.{cssExtension}> === lookupFileName.{swap '.js' with cssExtension}
                // If found, take this file and continue with the next module filename.
                for (const file of lookupFiles) {
                    let found = false;
                    // Try all of the configured extensions.
                    for (const extension of opts.FileExtensions) {
                        const candidateFileName = path.format({ ...path.parse(path.join(path.dirname(file), baseModuleName)), base: "", ext: extension.startsWith(".") ? extension : ("." + extension) }); // eslint-disable-line jsdoc/require-jsdoc
                        if (existsSync(candidateFileName)) {
                            found = true;
                            result.push(...getCSSFileContent(candidateFileName, opts));
                            break;
                        }
                    }
                    if (found) {
                        break;
                    }
                }
                // Find a file in the same directory of `fileName` that satisfies the following condition:
                // <moduleFileName.{cssExtension}> === lookupFileName.{swap '.js' with cssExtension}
                // If found, take this file and continue with the next module filename.
                for (const extension of opts.FileExtensions) {
                    const cssFileName = path.format({ ...path.parse(fileName), base: "", ext: extension.startsWith(".") ? extension : ("." + extension) }); // eslint-disable-line jsdoc/require-jsdoc
                    if (existsSync(cssFileName)) {
                        result.push(...getCSSFileContent(cssFileName, opts));
                        break;
                    }
                }
            }
        }
        return result;
    };

    let result: string[] = [
        ...concatCSSFiles(opts.Pre),
        ...await processScriptFiles(opts.ScriptFiles),
        ...concatCSSFiles(opts.Post)
    ];
    if (opts.StripEmptyLinesAtEnd) {
        // Ugly but easy ...
        result = result.join("\n").split("\n");
        while (result[result.length - 1] !== undefined && result[result.length - 1].trim() === "") {
            result.pop();
        }
    }
    !opts.OutputFile || writeFileSync(opts.OutputFile, result.join("\n"));
    return result;
}
/* eslint-enable no-irregular-whitespace */
