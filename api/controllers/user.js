import User from "../models/User.js";

export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req, res, next) => {
  try {
    // Utiliser l'ID de l'utilisateur connecté directement depuis req.user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Retirer le mot de passe de la réponse
    const { password, ...otherDetails } = user._doc;

    res.status(200).json(otherDetails); // Retourner toutes les infos sauf le mot de passe
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
