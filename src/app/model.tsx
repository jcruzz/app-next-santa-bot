export interface IFormChat {
  request: string;
}

export interface IContent {
  content: string;
  type: string;
  role: string;
}

export interface IMessages {
  like: boolean;
  dislike: boolean;
  comment: boolean;
  request: string;
  response: string;
}

export interface IHistorialChat {
  fecha: string;
  result: IContexto[];
}

export interface IContexto {
  pregunta: string;
  respuesta: string;
}

export interface IChat {
  chat_history: IContent[];
  text: string;
  ci: string;
}

export interface IMessages {
  request: string;
  response: string;
}

export interface IResponse {
  content: string;
}

export interface IPropsMessages {
  data: IMessages[];
}

export interface IUrlApi {
  NEXT_PUBLIC_API: string;
  NEXT_PUBLIC_API_VOICE: string;
}

export interface IResponseVoice {
  filename: string
  file: string
}

export interface IConvertTextToVoice {
  message: string
}