import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const parentURL = context.parentURL;
    if (parentURL) {
      for (const ext of ['', '.ts', '.tsx', '/index.ts']) {
        try {
          const candidateUrl = new URL(specifier + ext, parentURL);
          const candidatePath = fileURLToPath(candidateUrl);
          if (existsSync(candidatePath)) {
            return {
              url: candidateUrl.href,
              shortCircuit: true,
            };
          }
        } catch {}
      }
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && (url.endsWith('.ts') || url.endsWith('.tsx'))) {
    const filePath = fileURLToPath(url);
    const content = readFileSync(filePath, 'utf-8');
    const typeMatches = [...content.matchAll(/export\s+(?:type|interface)\s+([A-Za-z0-9_]+)/g)];
    const typeNames = typeMatches.map((m) => m[1]);

    if (url.endsWith('types.ts')) {
      const mockExports = typeNames.map((n) => `export const ${n} = {};`).join('\n') + '\nexport default {};';
      return {
        format: 'module',
        shortCircuit: true,
        source: mockExports,
      };
    }

    const result = await nextLoad(url, context);
    if (result.source && typeNames.length > 0) {
      const extraExports = '\n' + typeNames.map((n) => `export const ${n} = {};`).join('\n');
      return {
        ...result,
        source: result.source.toString() + extraExports,
      };
    }
    return result;
  }
  return nextLoad(url, context);
}
