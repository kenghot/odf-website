import { AuthModel } from "./AuthModel";

test("create store", () => {
  const store1 = AuthModel.create({});
  expect(store1).toEqual({
    username: null,
    password: null,
    firstname: "มานะ",
    lastname: "รักการงาน",
  });
  const store2 = AuthModel.create({
    username: "pattiyaa",
    password: "123456",
    firstname: "pattiya",
    lastname: "akaratawee",
  });
  expect(store2).toEqual({
    username: "pattiyaa",
    password: "123456",
    firstname: "pattiya",
    lastname: "akaratawee",
  });
});

test("views fullname", () => {
  const store = AuthModel.create({
    firstname: "pattiya",
    lastname: "akaratawee",
  });
  expect(store.fullname).toBe("pattiya akaratawee");
});

test("actions setField", () => {
  const store = AuthModel.create({});
  store.setField({ fieldName: "firstname", value: "toey" });
  expect(store.firstname).toBe("toey");
  store.setField({ fieldName: "lastname", value: "hommak" });
  expect(store.lastname).toBe("hommak");
});

test("actions resetAll", () => {
  const store = AuthModel.create({
    firstname: "pattiya",
    lastname: "akaratawee",
  });
  store.resetAll();
  expect(store).toEqual({
    username: null,
    password: null,
    firstname: "มานะ",
    lastname: "รักการงาน",
  });
});
