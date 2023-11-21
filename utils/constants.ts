import { set, z, ZodTypeAny } from "zod";

export const errors = z.enum(["BadRequest", "NotFound", "DatabaseError"]);
export const zodError = z.instanceof(z.ZodError);
export const JSONDate = z.union([z.string(), z.date()]).transform((arg) => {
    if (typeof arg == "string") return new Date(arg);
    return arg
});
export const JSONSet = <T extends ZodTypeAny>(x: T) => z.union([z.record(x), z.set(x), z.array(x)]).transform((u) => {
    if (u instanceof Set) return u;
    if (u instanceof Array) return new Set(u);
    if (u instanceof Object) return new Set(Object.keys(u));
    return u;
});
const x = JSONSet(z.string())
type a = z.infer<typeof x>