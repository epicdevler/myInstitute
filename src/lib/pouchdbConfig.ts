"use client";

import PouchDb from "./pouchdbClient";

export const UsersDB = (() => {
  if (typeof window == undefined) {
    return null as never;
  }
  const db = new PouchDb("userDB", {});

  db.createIndex({
    index: {
      fields: ["email"],
    },
  });

  return db;
})();

export const CoursesDB = (() => {
  if (typeof window == undefined) {
    return null as never;
  }
  const db = new PouchDb("courseDB", {});

  db.createIndex({
    index: {
      fields: ["code", "departmentId"],
    },
  });

  return db;
})();

export const DepartmentsDB = (() => {
  if (typeof window == undefined) {
    return null as never;
  }
  const db = new PouchDb("departmentDB", {});

  db.createIndex({
    index: {
      fields: ["code"],
    },
  });

  return db;
})();
