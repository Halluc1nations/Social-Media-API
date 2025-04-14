import { Thought } from '../models/index.js';
import User from '../models/User.js';
export const getThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const getSingleThought = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions')
            .populate('userId');
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        }
        else {
            res.json(thought);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const createThought = async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: thought._id } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(thought);
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    return;
};
export const updateThought = async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, {
            new: true,
            runValidators: true,
        });
        if (!updatedThought)
            return res.status(404).json({ message: 'No thought found with that ID' });
        res.json(updatedThought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        const user = await User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json({ message: 'Thought successfully deleted!' });
    }
    catch (err) {
        res.status(500).json(err);
    }
    return;
};
export const addReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, {
            $push: { reactions: req.body },
        }, { new: true, runValidators: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
export const removeReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
