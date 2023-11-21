import Surreal from "surrealdb.js";
import { z } from "zod";
import { UtilityDatabaseInterface, UtilityDatabaseInterfaceMethods as methods } from "../../interface/UtilityDatabaseInterface";

export const SurrealUtilityInterface: (
  conn: Surreal
) => z.infer<typeof UtilityDatabaseInterface> = (conn) => {
  return UtilityDatabaseInterface.parse({
    createTable: methods.createTable.strictImplement(async (table) => {
      try {
        console.log(await conn.query("DEFINE TABLE $table", { table: table }));
        return {
          success: true,
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
          error: {
            error: "DatabaseError",
            message: e instanceof Error ? e.message : "",
          },
        };
      }
    }),
    displayTable: methods.displayTable.strictImplement(async (table) => {
      try {
        console.log(await conn.query("SELECT * FROM $table", { table: table }));
        return {
          success: true,
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
          error: {
            error: "DatabaseError",
            message: e instanceof Error ? e.message : "",
          },
        };
      }
    }),
    clearTable: methods.clearTable.strictImplement(async (table) => {
      try {
        console.log(await conn.query("REMOVE TABLE $table", { table: table }));
        return {
          success: true,
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
          error: {
            error: "DatabaseError",
            message: e instanceof Error ? e.message : "",
          },
        };
      }
    }),
  });
};
