import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  //   console.log({ req });

  if (req.method === "POST") {
    const { id, name, neighborhood, address, imgUrl, voting } = req.body;
    try {
      //find a record
      if (id) {
        // const findCoffeeStoreRecords = await table
        //   .select({
        //     filterByFormula: `id="${id}"`,
        //   })
        //   .firstPage();
        const records = await findRecordByFilter(id);

        // console.log({ findCoffeeStoreRecords });

        // if (findCoffeeStoreRecords.length > 0) {
        if (records.length > 0) {
          //   const records = findCoffeeStoreRecords.map((record) => {
          //     return {
          //       ...record.fields,
          //     };
          //   });
          // const records = getMinifiedRecords(findCoffeeStoreRecords);
          res.json(records);
        } else {
          // create a record
          if (name) {
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
            // const records = createRecords.map((record) => {
            //   return {
            //     ...record.fields,
            //   };
            // });
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            // 400 = client error
            res.status(400).json({ message: "Name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (error) {
      console.log("Error creating or finding a store", error);
      // 500 = server error
      res
        .status(500)
        .json({ message: "Error creating or finding a store", error });
    }
  } else {
    res.json({ message: "Nothing for GET" });
  }
};

export default createCoffeeStore;
