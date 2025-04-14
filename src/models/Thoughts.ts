import { Schema, Types, model, ObjectId, Document } from "mongoose";
// import formatDate from "../utils/formatDate.js";


export interface IReaction extends Document {
  reactionId: ObjectId;
    reactionBody: string;
    userId?: ObjectId;
    createdAt: Date;
}

export interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  userId: ObjectId;
  reactions: IReaction[];
}

const reactionSchema = new Schema<IReaction>(
  {
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
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);



const thoughtSchema = new Schema<IThought>(
  {
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
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

export default Thought;