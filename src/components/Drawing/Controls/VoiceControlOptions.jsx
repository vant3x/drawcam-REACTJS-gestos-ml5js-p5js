import { AudioLines } from "lucide-react";


export default function VoiceControlOptions() {
    return (
        <>
                  <div className="absolute w-[20%] bottom-52 border border-gray-950 px-6 py-4 mt-4">
              <h3 className="flex text-bold font-bold text-white">Controles por voz <AudioLines className="ml-2 mr-2"/></h3>
              <ul className="ml-10 mt-4 list-disc">
                <li>Cambiar tamaño</li>
                <li>Cambiar Color</li>
                <li>Activar Transcripción</li>
                <li>Generar Imagen de boceto</li>
                <li>Bloquear capa y activar seguimiento</li>
                <li>Descargar dibujo</li>
                <li>Limpiar canvas</li>
              </ul>
            </div>
        </>
    )
}