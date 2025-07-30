export const createUser = async (req, res) => {
  try {
    res.status(200).json({ message: "hello" });
  } catch (error) {
    throw error;
  }
};
