import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectRoot = process.cwd();
const dotNextPath = path.join(projectRoot, ".next");
const cacheRoot = path.join(
  process.env.LOCALAPPDATA || os.tmpdir(),
  "ls-next-cache",
  path.basename(projectRoot),
);
const cacheTarget = path.join(cacheRoot, ".next");

function isLinkedNext(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return false;
  }

  try {
    const resolved = fs.realpathSync.native(targetPath);
    return path.resolve(resolved) !== path.resolve(targetPath);
  } catch {
    return false;
  }
}

function createWindowsJunction(linkPath, targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
  execSync(`cmd /c mklink /J "${linkPath}" "${targetPath}"`, {
    stdio: "inherit",
  });
}

function createPosixSymlink(linkPath, targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
  fs.symlinkSync(targetPath, linkPath, "dir");
}

if (process.env.NEXT_LOCAL_CACHE === "0") {
  process.exit(0);
}

if (fs.existsSync(dotNextPath)) {
  if (isLinkedNext(dotNextPath)) {
    process.exit(0);
  }

  console.warn(
    "[link-next-cache] .next already exists as a regular folder. Stop dev/build, delete .next, then rerun npm run dev.",
  );
  process.exit(0);
}

fs.mkdirSync(cacheRoot, { recursive: true });

try {
  if (process.platform === "win32") {
    createWindowsJunction(dotNextPath, cacheTarget);
  } else {
    createPosixSymlink(dotNextPath, cacheTarget);
  }

  console.log(`[link-next-cache] Linked .next -> ${cacheTarget}`);
} catch (error) {
  console.warn(
    `[link-next-cache] Could not link .next cache (${error instanceof Error ? error.message : error}). Using project .next.`,
  );
}
