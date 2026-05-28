import {
  getParentDir,
  viteAdapter,
} from "@builder.io/qwik-city/adapters/shared/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import fs from "node:fs";
import { dirname, join } from "node:path";
import baseConfig from "../../vite.config";

const vercelEdgeCopyAdapter = () =>
  viteAdapter({
    name: "vercel-edge",
    origin: "https://www.thetasrc.in",
    cleanStaticGenerated: true,
    ssg: {
      include: [],
      origin: "https://www.thetasrc.in",
      sitemapOutFile: null,
    },
    config(config) {
      const outDir =
        config.build?.outDir ||
        join(".vercel", "output", "functions", "_qwik-city.func");

      return {
        resolve: {
          conditions: ["edge-light", "webworker", "worker", "browser", "module", "main"],
        },
        ssr: {
          target: "webworker",
          noExternal: true,
        },
        build: {
          ssr: true,
          outDir,
          rollupOptions: {
            output: {
              format: "es",
              hoistTransitiveImports: false,
            },
          },
        },
        publicDir: false,
      };
    },
    async generate({
      clientPublicOutDir,
      serverOutDir,
      basePathname,
      outputEntries,
    }) {
      const vercelOutputDir = getParentDir(serverOutDir, "output");
      const vercelOutputConfig = {
        routes: [
          { handle: "filesystem" },
          {
            src: basePathname + ".*",
            dest: "/_qwik-city",
          },
        ],
        version: 3,
      };

      await fs.promises.writeFile(
        join(vercelOutputDir, "config.json"),
        JSON.stringify(vercelOutputConfig, null, 2),
      );

      const entrypoint = outputEntries.some((n) => n === "entry.vercel-edge.mjs")
        ? "entry.vercel-edge.mjs"
        : "entry.vercel-edge.js";
      const vcConfig = {
        runtime: "edge",
        entrypoint,
      };

      await fs.promises.writeFile(
        join(serverOutDir, ".vc-config.json"),
        JSON.stringify(vcConfig, null, 2),
      );

      let vercelStaticDir = join(vercelOutputDir, "static");
      const basePathnameParts = basePathname
        .split("/")
        .filter((part) => part.length > 0);
      if (basePathnameParts.length > 0) {
        vercelStaticDir = join(vercelStaticDir, ...basePathnameParts);
      }

      await fs.promises.rm(vercelStaticDir, { recursive: true, force: true });
      await fs.promises.mkdir(dirname(vercelStaticDir), { recursive: true });

      try {
        await fs.promises.rename(clientPublicOutDir, vercelStaticDir);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EPERM") {
          throw error;
        }

        await fs.promises.cp(clientPublicOutDir, vercelStaticDir, {
          recursive: true,
        });
        await fs.promises.rm(clientPublicOutDir, {
          recursive: true,
          force: true,
        });
      }
    },
  });

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.vercel-edge.tsx", "@qwik-city-plan"],
      },
      outDir: ".vercel/output/functions/_qwik-city.func",
    },
    plugins: [vercelEdgeCopyAdapter()],
  };
});
