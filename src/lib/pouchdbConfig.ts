"use client";
import PouchDb from "pouchdb-browser";

// eslint-disable-next-line @typescript-eslint/no-require-imports
PouchDb.plugin(require("pouchdb-find").default);

export const UsersDB = (() => {
  const db = new PouchDb("userDB", {});

  db.createIndex({
    index: {
      fields: ["email"],
    },
  });

  return db;
})();

export const CoursesDB = (() => {
  const db = new PouchDb("courseDB", {});

  db.createIndex({
    index: {
      fields: ["code", "departmentId"],
    },
  });

  return db;
})();

export const DepartmentsDB = (() => {
  const db = new PouchDb("departmentDB", {});

  db.createIndex({
    index: {
      fields: ["code"],
    },
  });

  return db;
})();
