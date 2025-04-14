import { Thought } from "../models/index.js";
import User from "../models/User.js";
import { Request, Response } from "express";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }).select("-__v");

    if (!user) {
      res.status(404).json({ message: "No user with that ID" });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const dbUserData = await User.create(req.body);
    res.json(dbUserData);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "No user found with that ID" });

    res.json(updatedUser);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const dbUserData = await User.findByIdAndDelete(req.params.userId);

    if (!dbUserData) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });

    res.json({ message: "User and associated thoughts deleted!" });
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    const dbUserData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    ).populate("friends");

    if (!dbUserData) {
      return res.status(404).json({ message: "No user found with this id!" });
    }

    res.json(dbUserData);
    return;
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const dbUserData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    ).populate("friends");

    if (!dbUserData) {
      return res.status(404).json({ message: "No user found with this id!" });
    }

    res.json(dbUserData);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
};
