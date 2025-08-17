"use client";
import PouchDb from "pouchdb-browser";

export default PouchDb;
// eslint-disable-next-line @typescript-eslint/no-require-imports
PouchDb.plugin(require("pouchdb-find").default);