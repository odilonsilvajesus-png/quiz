import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, JOBS_DIR, UPLOADS_DIR } from "./config.js";
import type { Job, Profile } from "./types.js";

for (const dir of [DATA_DIR, JOBS_DIR, UPLOADS_DIR]) fs.mkdirSync(dir, { recursive: true });

const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

const defaultProfile: Profile = {
  name: "",
  handle: "",
  consent: false,
  voice: { stability: 0.45, similarity: 0.85, style: 0.15, speed: 1 },
  avatar: { type: "avatar" },
};

function writeJson(file: string, data: unknown) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

export function getProfile(): Profile {
  if (!fs.existsSync(PROFILE_FILE)) return structuredClone(defaultProfile);
  const saved = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf8"));
  return {
    ...defaultProfile,
    ...saved,
    voice: { ...defaultProfile.voice, ...saved.voice },
    avatar: { ...defaultProfile.avatar, ...saved.avatar },
  };
}

export function saveProfile(patch: Partial<Profile>): Profile {
  const current = getProfile();
  const next: Profile = {
    ...current,
    ...patch,
    voice: { ...current.voice, ...patch.voice },
    avatar: { ...current.avatar, ...patch.avatar },
  };
  writeJson(PROFILE_FILE, next);
  return next;
}

const jobs = new Map<string, Job>();

export const jobDir = (id: string) => path.join(JOBS_DIR, id);

export function loadJobs() {
  for (const id of fs.readdirSync(JOBS_DIR)) {
    const file = path.join(jobDir(id), "job.json");
    if (!fs.existsSync(file)) continue;
    const job: Job = JSON.parse(fs.readFileSync(file, "utf8"));
    jobs.set(job.id, job);
  }
  return [...jobs.values()];
}

export const listJobs = () =>
  [...jobs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const getJob = (id: string) => jobs.get(id);

export function saveJob(job: Job) {
  job.updatedAt = new Date().toISOString();
  jobs.set(job.id, job);
  fs.mkdirSync(jobDir(job.id), { recursive: true });
  writeJson(path.join(jobDir(job.id), "job.json"), job);
  return job;
}

export function deleteJob(id: string) {
  jobs.delete(id);
  fs.rmSync(jobDir(id), { recursive: true, force: true });
}
