import axios from "axios";
import { IChat, IConvertTextToVoice, IResponse, IResponseVoice } from "./model";
import { obtainUrlApi, obtainUrlApiVoice } from "./utils";

export const conversationChat = async (model: IChat) => {
  try {
    const URL_API = await obtainUrlApi();
    const response = await axios.post<IResponse>(
      URL_API + "/adi/conversation",
      model
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteChat = async () => {
  try {
    const URL_API = await obtainUrlApi();
    const response = await axios.post<[]>(
      URL_API + "/adi/Delete_user_history",
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVoice = async (message: IConvertTextToVoice) => {
  try {
    const URL_API = await obtainUrlApiVoice();
    const response = await axios.post<IResponseVoice>(
      URL_API + "/text-to-speech/",
      message
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
