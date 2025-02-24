import { model, models, Schema } from "mongoose"

export interface IVote {
  chatId: string
  messageId: string
  isUpvoted: boolean
}

const VoteSchema = new Schema<IVote>(
  {
    chatId: String,
    messageId: String,
    isUpvoted: Boolean,
  },
  {
    toJSON: {
      versionKey: false,
      virtuals: false,
    },
    _id: false,
  }
)

const Vote = models.Vote || model("Vote", VoteSchema)
export default Vote
