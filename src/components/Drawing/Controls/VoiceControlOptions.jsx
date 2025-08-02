// VoiceControlOptions.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { AudioLines } from "lucide-react"; // Asegúrate de tener lucide-react instalado

const VoiceControlOptions = forwardRef((props, ref) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState("");
  const recognitionRef = useRef(null);

  // Expone las funciones startListeningExternal y stopListeningExternal a través del ref
  useImperativeHandle(ref, () => ({
    startListeningExternal: () => {
      if (recognitionRef.current) {
        try {
          if (!isListening) {
            recognitionRef.current.start();
            setIsListening(true);
            setMessage('Escuchando... Di "activar consola" o "detener escucha".');
            setTranscript("");
          } else {
            setMessage("El reconocimiento ya está activo.");
          }
        } catch (error) {
          if (error.name === "InvalidStateError") {
            setMessage("El reconocimiento ya está activo.");
            setIsListening(true);
          } else {
            console.error("Error al intentar iniciar el reconocimiento:", error);
            setMessage(
              "No se pudo iniciar el reconocimiento. Revisa los permisos del micrófono."
            );
          }
        }
      }
    },
    stopListeningExternal: () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setMessage("Reconocimiento detenido.");
        }
    }
  }));

  // Efecto principal para inicializar la API de reconocimiento de voz
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setMessage(
        "Tu navegador no soporta la API de reconocimiento de voz. Prueba con Chrome o Edge."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "es-ES";

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      const command = finalTranscript.toLowerCase().trim();

      if (command.includes("activar consola")) {
        console.log('¡Comando de voz "activar consola" detectado!');
        alert("Consola activada!");
        setMessage('Comando "activar consola" detectado. Revisa la consola.');
      } else if (command.includes("detener escucha")) {
        setMessage('Comando "detener escucha" detectado. Deteniendo reconocimiento.');
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };

    recognitionRef.current.onend = () => {
      // Si estaba escuchando y terminó, reinicia la escucha solo si `isListening` es true.
      // Esto es crucial para `continuous=true` y para evitar que se detenga si no hay voz por un momento.
      if (isListening) {
        console.log("Reconocimiento de voz terminado, reiniciando...");
        recognitionRef.current.start();
        setMessage("Reconexión de voz...");
      } else {
        setMessage("La escucha ha terminado o fue detenida.");
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      let errorMessage = `Error: ${event.error}. `;

      switch (event.error) {
        case "not-allowed":
          errorMessage +=
            "Permiso de micrófono denegado. Haz clic en 'Activar Micrófono' para que el navegador pida permiso.";
          break;
        case "no-speech":
          errorMessage += "No se detectó voz. Intenta hablar más claro o revisa tu micrófono.";
          break;
        case "audio-capture":
          errorMessage +=
            "No se pudo acceder al micrófono. Asegúrate de que no esté en uso por otra aplicación y que esté conectado.";
          break;
        case "network":
          errorMessage +=
            "Problema de red. Asegúrate de tener conexión a internet estable.";
          break;
        default:
          errorMessage += "Ocurrió un error desconocido. Intenta de nuevo.";
      }

      setMessage(errorMessage);
      setIsListening(false); // Detiene la escucha en caso de error
    };

    // Función de limpieza al desmontar el componente
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]); // Dependencia solo en isListening

  return (
    <>
      <div className="absolute w-[20%] bottom-52 border border-gray-950 px-6 py-4 mt-4 text-white">
        <h3 className="flex text-bold font-bold">
          Controles por voz <AudioLines className="ml-2 mr-2" />
        </h3>
        <ul className="ml-10 mt-4 list-disc">
          <li>Cambiar tamaño</li>
          <li>Cambiar Color</li>
          <li>Activar Transcripción</li>
          <li>Generar Imagen de boceto</li>
          <li>Bloquear capa y activar seguimiento</li>
          <li>Descargar dibujo</li>
          <li>Limpiar canvas</li>
        </ul>

        {/* Indicador de estado */}
        <div className="mt-6 flex flex-col gap-2">
          <p
            className={`px-4 py-2 rounded-md font-semibold text-center ${
              isListening
                ? "bg-green-600 animate-pulse"
                : "bg-gray-700"
            } text-white`}
          >
            {isListening ? "Escuchando voz..." : "Reconocimiento Inactivo"}
          </p>
          {message && (
            <p className="text-sm italic mt-2 text-gray-300">{message}</p>
          )}
          {transcript && (
            <p className="text-sm mt-2">
              **Transcripción:** <span className="font-semibold">{transcript}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
});

export default VoiceControlOptions;