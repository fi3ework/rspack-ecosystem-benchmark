import { resolve } from "path";
import { fileURLToPath } from "url";
import { mkdir, writeFile } from "fs/promises";
import { run, formatResultTable } from "../lib/index.js";

const [, , ...benchmarkCase] = process.argv;

const rootDir = resolve(fileURLToPath(import.meta.url), "../..");

(async () => {
	await mkdir(resolve(rootDir, "output"), { recursive: true });
	const benchmarks = benchmarkCase.length
		? benchmarkCase
		: [
				"10000_development-mode",
				"10000_development-mode_hmr",
				"10000_production-mode",
				"threejs_development-mode_10x",
				"threejs_development-mode_10x_hmr",
				"threejs_production-mode_10x"
		  ];
	for (const item of benchmarks) {
		const result = await run(item);
		console.log(`${item} result is:`);
		console.log(formatResultTable(result, { colors: true, verbose: true }));
		await writeFile(
			resolve(rootDir, `output/${item}.json`),
			JSON.stringify(result, null, 2)
		);
	}
})().catch(err => {
	process.exitCode = 1;
	console.error(err.stack);
});
