const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
  {
    return { ...record.fields };
  }
};

const getMinifiedRecords = (records) => {
  return records.map((record) => {
    // return {
    //   ...record.fields,
    // };
    return getMinifiedRecord(record);
  });
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  // if findCoffeStore is empty, it will return an empty array
  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
