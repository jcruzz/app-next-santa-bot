import React, { useState, useEffect, useRef } from "react";

const VoiceToText: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState("");
    const recognitionRef = useRef<SpeechRecognition | null>(null); // Referencia para la instancia de SpeechRecognition
    const transcriptRef = useRef<string>(""); // Referencia para el texto
  
    useEffect(() => {
      if (!("webkitSpeechRecognition" in window)) {
        setError("El reconocimiento de voz no es compatible con este navegador.");
      } else {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
      }
    }, []);
  
    const handleEndOfSpeech = () => {
console.log(transcriptRef.current);

    };
  
    const startListening = () => {
      if (!recognitionRef.current) {
        setError("El reconocimiento de voz no es compatible con este navegador.");
        return;
      }
  
      // Limpiar el texto existente antes de comenzar
      setTranscript(""); // Limpia el estado visible
      transcriptRef.current = ""; // Limpia la referencia del texto
  
      const recognition = recognitionRef.current;
      recognition.lang = "es-ES"; // Cambiar al idioma que necesites
      recognition.continuous = false; // Configura para detenerse al final de una frase
      recognition.interimResults = false;
  
      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };
  
      recognition.onspeechend = () => {
        recognition.stop(); // Detener automáticamente cuando termine de hablar
        setIsListening(false);
        handleEndOfSpeech(); // Llama a la función personalizada
      };
  
      recognition.onend = () => {
        setIsListening(false);
        handleEndOfSpeech(); // Asegurarse de ejecutar al final
      };
  
      recognition.onerror = (event: any) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };
  
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const newTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        transcriptRef.current = newTranscript; // Actualiza la referencia
        setTranscript(newTranscript); // Sincroniza con el estado
      };
  
      recognition.start();
    };
  
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h1>Voz a Texto</h1>
        <p>{error ? `Error: ${error}` : "Presiona para comenzar a hablar"}</p>
        <textarea
          value={transcript}
          readOnly
          style={{
            width: "100%",
            height: "150px",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <div style={{ marginTop: "1rem" }}>
          {!isListening ? (
            <button onClick={startListening} style={{ padding: "0.5rem 1rem" }}>
              🎤 Comenzar
            </button>
          ) : (
            <button
              style={{ padding: "0.5rem 1rem" }}
              disabled
            >
              ⏹️ Grabando...
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default VoiceToText;