const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

console.log({ table });

const createCoffeeStore = async (req, res) => {
  //   console.log({ req });

  if (req.method === "POST") {
    const { id, name, neighborhood, address, imgUrl, voting } = req.body;
    try {
      //find a record
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id=${id}`,
        })
        .firstPage();

      console.log({ findCoffeeStoreRecords });

      if (findCoffeeStoreRecords.length > 0) {
        const records = findCoffeeStoreRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      } else {
        // create a record
        const createRecords = await table.create([
          {
            fields: {
              id,
              name,
              address,
              neighborhood,
              voting,
              imgUrl,
            },
          },
        ]);
        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      }
    } catch (error) {
      console.log("Error finding store", error);
      res.status(500).json({ message: "Error finding store", error });
    }
  }
};

export default createCoffeeStore;
