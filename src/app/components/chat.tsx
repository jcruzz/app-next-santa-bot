"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiXCircle } from "react-icons/hi2";
import { CirclesWithBar, Comment } from "react-loader-spinner";
import * as Yup from "yup";
import {
  IChat,
  IContent,
  IConvertTextToVoice,
  IFormChat,
  IMessages,
  IResponse,
  IResponseVoice,
} from "../model";
import Messages from "./messages";
import { conversationChat, deleteChat, getVoice } from "../service";

const validationSchema = Yup.object().shape({
  request: Yup.string().required("Introducir una pregunta"),
});

const Chat: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);

  const [voiceString, setVoiceString] = useState<string | null>(null);
  const [isPlaySanta, setIsPlaySanta] = useState<boolean>(false);
  const refAudioSanta = useRef<HTMLAudioElement | null>(null);

  const [responseSantaText, setResponseSantaText] = useState<string>("");

  useEffect(() => {
    const handleInteraction = () => {
      setIsAllowed(true);
      document.removeEventListener("click", handleInteraction);
    };

    // Escucha cualquier clic del usuario para permitir la reproducción.
    document.addEventListener("click", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("El reconocimiento de voz no es compatible con este navegador.");
    } else {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
    }

    if (isAllowed) {
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.volume = 0.1;
        audioElement.loop = true;
        audioElement.play().catch((error) => {
          console.error("Error al intentar reproducir audio:", error);
        });
      }
    }
  }, [isAllowed]);

  useEffect(() => {
    if (voiceString && refAudioSanta.current) {
      const audioElement = refAudioSanta.current;
      audioElement.volume = 1;
      audioElement.load();
      audioElement
        .play()
        .then(() => setIsPlaySanta(true))
        .catch((error) => {
          console.error("Error al reproducir el audio:", error);
          setIsPlaySanta(false);
        });
    }
  }, [voiceString]);

  const handleEndOfSpeech = () => {
    if (transcriptRef.current != "") {
      inputChatMain.current!.value = transcriptRef.current;
      onSubmit({
        request: transcriptRef.current,
      });
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("El reconocimiento de voz no es compatible con este navegador.");
      return;
    }

    setTranscript("");
    transcriptRef.current = "";

    const recognition = recognitionRef.current;
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
      if (audioRef.current) {
        audioRef.current.volume = 0.02;
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      handleEndOfSpeech();
      if (audioRef.current) {
        audioRef.current.volume = 0.1;
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const newTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      transcriptRef.current = newTranscript;
      setTranscript(newTranscript);
    };

    recognition.start();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormChat>({ resolver: yupResolver(validationSchema) });

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [history, setHistory] = useState<IContent[]>([]);
  const [messages, setMessages] = useState<IMessages[]>([]);
  const buttonSubmit = useRef<HTMLButtonElement | null>(null);
  const inputChatMain = useRef<HTMLInputElement | null>(null);

  const onSubmit: SubmitHandler<IFormChat> = async (data) => {
    setShowLoader(true);

    const groupChat: IContent[] = [];
    const objetctChat: IContent = {
      content: "",
      role: "",
      type: "",
    };
    const optionsChat: IChat = {
      chat_history: [],
      ci: "",
      text: "",
    };

    try {
      historyHuman(data.request);

      disableChat();

      optionsChat.chat_history = history;
      optionsChat.text = data.request;
      optionsChat.ci = "1234567890";

      let result: IResponse = {
        content: ""
      } 

      try {
        result = await conversationChat(optionsChat);  
      } catch (error) {
        console.log(error);
        result = {content: "Ho Ho Ho, No ententdí la pregunta, habla nuevamente amigo!"}
      }
      

      setResponseSantaText(result.content);

      setIsPlaySanta(false);

      let voice: IResponseVoice = {
        file: "",
        filename: ""
      }
      try {
        voice = await getVoice({ message: result.content });  
      } catch (error) {
        console.log(error);
        voice = {
          file: "error",
          filename: "error"
        }
      }
      

      playAudioSanta(voice.file);

      fillChatResponse(result.content);

      objetctChat.content = result.content;
      objetctChat.type = "ai";
      objetctChat.role = "ai";

      groupChat.push(objetctChat);

      setHistory((m) => [...m, ...groupChat]);
    } catch (error) {
      console.log(error);
    }
  };

  const hexToBytes = (hex: string): Uint8Array => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return new Uint8Array(bytes);
  };

  const playAudioSanta = async (hexData: string) => {
    if (hexData !== "error") {
      try {
        const byteARray = hexToBytes(hexData);
        const blob = new Blob([byteARray], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setVoiceString(url);
        if (audioRef.current) {
          audioRef.current.volume = 0.1;
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setVoiceString("/santaVozError.mp3")
    }
    
  };

  const historyHuman = (text: string) => {
    const groupChat: IContent[] = [];
    const objectChat = {
      content: text,
      type: "human",
      role: "human",
    };

    const req: IMessages = {
      request: text,
      response: "",
      comment: false,
      dislike: false,
      like: false,
    };

    const group: IMessages[] = [];

    group.push(req);

    groupChat.push(objectChat);
    setHistory((m) => [...m, ...groupChat]);
    setMessages((mess) => [...mess, ...group]);
  };

  const fillChatResponse = (response: string) => {
    const messages: IMessages[] = [];
    const message: IMessages = {
      request: "",
      response: "",
      comment: false,
      dislike: false,
      like: false,
    };
    message.response = response;
    messages.push(message);

    setTimeout(() => {
      setShowLoader(false);
      setMessages((m) => [...m, ...messages]);
      enableChat();
    }, 500);
  };

  const disableChat = () => {
    buttonSubmit.current?.setAttribute("disabled", "true");

    inputChatMain.current!.value = "";
  };

  const enableChat = () => {
    buttonSubmit.current?.removeAttribute("disabled");
  };

  const handleDeleteChat = async () => {
    setMessages([]);
    await deleteChat();
  };

  const handleAudioSantaEnd = () => {
    setIsPlaySanta(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
  };

  const loaderMessages = [
    "Procesando información...",
    "Santa está revisando su lista...",
    "Revisando quién ha sido travieso o bueno...",
    "Preparando una respuesta especial...",
    "Cargando magia navideña...",
  ];

  const [loaderMessage, setLoaderMessage] = useState(
    "Procesando información..."
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showLoader) {
      let index = 0;
      interval = setInterval(() => {
        setLoaderMessage(loaderMessages[index]);
        index = (index + 1) % loaderMessages.length;
      }, 1700);
    }

    return () => clearInterval(interval);
  }, [showLoader]);

  return (
    <>
      {isListening && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center slide-in-fwd-center">
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="mt-8 text-white text-2xl font-bold animate-bounce text-center">
            ¡Ho, ho, ho! 🎅 Habla conmigo, soy Santa bot. ¡Estoy escuchando! 🎤
          </p>
        </div>
      )}
      {isPlaySanta && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center slide-in-fwd-center">
          <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p className="mt-8 text-white text-2xl font-bold text-center animate-pulse italic pb-5">
            🎶 Santa está hablando contigo... ¡Escucha con atención! 🎅
          </p>
          <p className="mt-8 text-white text-3xl font-bold text-center animate-bounce italic">
            {responseSantaText}
          </p>
        </div>
      )}
      <div className="container mx-auto">
        <div className="flex h-[80vh]">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-auto px-20 pt-10">
              <Messages data={messages} />
            </div>
            {errors.request && (
              <div
                className="slide-in-fwd-center mt-2 bg-red-100 border-t border-red-500 text-red-700 px-4 py-2 flex items-center space-x-1"
                role="alert"
              >
                <HiXCircle size={20} />
                <p className="font-semibold">Error: </p>
                <p className="font-normal">{errors.request.message}</p>
              </div>
            )}

            {error !== "" ? (
              <h1>Error en el reconocimiento de voz: {error}</h1>
            ) : null}

            {showLoader && (
              <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center slide-in-fwd-center">
                <p className="mt-8 text-white text-2xl font-bold animate-bounce text-center">
                  {loaderMessage}
                </p>
              </div>
            )}

            <div
              className="col-start-1 col-end-13 py-1 rounded-lg slide-in-fwd-center px-20"
              hidden={!showLoader}
            >
              <div className="flex flex-row items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0">
                  <Image
                    src="/3697290.png"
                    className="object-cover h-10 w-10"
                    alt="BDP"
                    width={500}
                    height={300}
                    priority
                  />
                </div>
                <div className="relative ml-3 text-sm py-2 rounded-xl ">
                  <div>
                    <Comment
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="comment-loading"
                      wrapperStyle={{}}
                      color="#fff"
                      backgroundColor="#7e121d"
                    />
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-4 mb-4 mx-8 z-30">
                <div className="flex">
                  <input
                    className="font-normal text-size-16 w-full border rounded-xl focus:outline-none focus:border-blue-300 pl-4 h-11 flex-grow resize-none chat overflow-hidden my-auto bg-red-200 placeholder:text-gray-700 mr-4 z-50 hidden"
                    placeholder="Empieza a escribir"
                    autoComplete="off"
                    maxLength={400}
                    value={transcript}
                    readOnly
                    {...register("request")}
                    ref={(e) => {
                      register("request").ref(e);
                      inputChatMain.current = e;
                    }}
                  />

                  {/* <button
                  className="flex items-center justify-center home-button button rounded-xl text-white px-4 py-2 flex-shrink-0 ml-3 z-50"
                  hidden
                  type="submit"
                  ref={buttonSubmit}
                >
                  <span className="font-medium text-size-16">Enviar</span>
                </button> */}
                  <div className="flex flex-row items-center mx-auto">
                    {!isListening ? (
                      <button
                        className={
                          "flex items-center justify-center home-button button rounded-xl text-white px-4 py-2 flex-shrink-0 ml-3 z-50"
                        }
                        type="button"
                        onClick={startListening}
                        disabled={isPlaySanta || isListening || showLoader}
                      >
                        <span className="font-medium text-size-16 px-14 mx-2">
                          Empezar a hablar
                        </span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center home-button button rounded-xl text-white px-4 py-2 flex-shrink-0 ml-3 z-50 cursor-not-allowed"
                        type="button"
                        disabled
                      >
                        <span className="font-medium text-size-16 px-14 mx-2">
                          Escuchando ...
                        </span>
                      </button>
                    )}

                    <button
                      className="flex items-center justify-center home-button button rounded-xl text-white px-4 py-2 flex-shrink-0 ml-3 z-50"
                      type="button"
                      onClick={handleDeleteChat}
                      disabled={isPlaySanta}
                    >
                      <span className="font-medium text-size-16 px-14 mx-2">
                        Borrar
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <audio ref={audioRef} autoPlay loop>
        <source
          src="/christmas-dreams-jingle-bells-268299.mp3"
          type="audio/mpeg"
        />
        Tu navegador no soporta la reproducción de audio.
      </audio>

      <audio ref={refAudioSanta} onEnded={handleAudioSantaEnd}>
        <source src={voiceString ? voiceString : undefined} type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>
    </>
  );
};

export default Chat;
