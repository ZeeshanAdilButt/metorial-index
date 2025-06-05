export let createEnsureRecord = <
  UniqueKey extends {},
  UpsertCreate,
  Result,
  StaticCreate extends Partial<UpsertCreate> = {}
>(
  type: {
    upsert: (d: { create: UpsertCreate; where: UniqueKey; update: any }) => Promise<Result>;
  },
  getWhere: (value: UpsertCreate) => UniqueKey,
  getStatic?: () => Promise<StaticCreate> | StaticCreate,
  opts?: {
    cacheTtl?: number;
  }
) => {
  return async (
    getter: () =>
      | Omit<UpsertCreate, keyof StaticCreate>
      | Promise<Omit<UpsertCreate, keyof StaticCreate>>,
    opts?: {
      ignoreForUpdate?: (keyof UpsertCreate)[];
    }
  ) => {
    let coreValues = await getter();
    let staticValues = (await getStatic?.()) ?? {};

    let value = { ...staticValues, ...coreValues } as UpsertCreate;

    let where = getWhere(value);

    let update = {
      ...value,
      id: undefined,
      oid: undefined
    };

    if (opts?.ignoreForUpdate) {
      for (let key of opts.ignoreForUpdate) {
        delete update[key];
      }
    }

    let res = await type.upsert({
      where,
      create: value,
      update
    });

    return res;
  };
};
