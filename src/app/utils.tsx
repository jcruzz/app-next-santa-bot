import axios from "axios";
import { IUrlApi } from "./model";

export const obtainUrlApi = async () => {
  const response = await axios.get<IUrlApi>("/pages/api/data");
  return response.data.NEXT_PUBLIC_API;
};

export const obtainUrlApiVoice = async () => {
    const response = await axios.get<IUrlApi>("/pages/api/data")
    return response.data.NEXT_PUBLIC_API_VOICE
}
