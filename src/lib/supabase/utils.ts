import { getCandidates } from "./candidate";
import { blankVote, getVoterById, vote } from "./voting";
import { connectAdmin, connectManager } from "./role-connexion";
import {
  resetSession,
  updateEndSession,
  updateEndTime,
} from "./session-management";

export {
  getCandidates,
  blankVote,
  vote,
  getVoterById,
  connectManager,
  connectAdmin,
  updateEndTime,
  updateEndSession,
  resetSession,
};
