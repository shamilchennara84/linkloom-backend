
import { IChatHistoryItem, IChatReq,  } from "../Schema/chatSchema";

export interface IChatRepo {
  saveChat(chatData: IChatReq): Promise<IChatHistoryItem >;
}
