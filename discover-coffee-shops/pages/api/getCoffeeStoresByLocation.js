import { fetchCoffeeStores } from "../../lib/coffee-store";

////// We use CLIENT SIDE RENDERING (CSR) to render the stores near me //////
// For that, we have built a brand new API, a serverless funcion called as getCoffeeStoresByLocation
const getCoffeeStoresByLocation = async (req, res) => {
  // configure latLong and Limit

  try {
    const { latLong, limit } = req.query;

    const latLongArray = latLong.split(",");

    console.log(latLongArray, limit);

    const response = await fetchCoffeeStores(latLongArray, limit);

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // 500 stands for Internal Server Error
    res.status(500).json({ message: "Oh no! Something went wrong", error });
  }

  // return
};

export default getCoffeeStoresByLocation;
