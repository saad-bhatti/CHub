/** No instance in the db has such an id **/
export const invalidId = "Non-existant";

/** If bool is true, then return '+'. Otherwise, return '-' **/
export function boolToString(bool: boolean): string {
  return bool ? "+" : "-";
}

/** Compare two objects of the sdme type and return a bool of they are equivalent **/
export function compareObjects(obj1: Object, obj2: Object): boolean {
  let bool = true;
  for (const attr in obj1)
    bool =
      bool &&
      obj1[attr as keyof Object].toString() ==
        obj2[attr as keyof Object].toString();
  return bool;
}
