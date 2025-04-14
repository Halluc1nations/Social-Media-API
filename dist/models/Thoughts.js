import { Schema, Types, model } from "mongoose";
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        //   get: (createdAtValue: number) => formatDate(createdAtValue),
    },
}, {
    toJSON: {
        getters: true,
    },
    id: false,
});
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now,
        //   get: function (this) {
        //     const _Date = this as unknown as number;
        //     return formatDate(_Date);
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});
thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});
const Thought = model("thought", thoughtSchema);
export default Thought;
