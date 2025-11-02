import cv2
import time
from ultralytics import YOLO
import requests  # ⬅️ IMPORTA A NOVA BIBLIOTECA
import threading

# --- CONFIGURAÇÃO ---
# ✅ Esta é a URL do seu backend que está no ar no Render!
BACKEND_API_URL = "https://gomes-imoveis-backend.onrender.com/api/vagas/atualizar-status-ia"

# Vamos dizer que este script está monitorando a vaga "A1"
VAGA_MONITORADA = "A1" 
# --------------------

# Variável para guardar o último status enviado. Começa como 'None' para forçar um envio na primeira vez.
ultimo_status_enviado = None 

def detectar_vaga():
    global ultimo_status_enviado

    model = YOLO("yolov8s.pt")
    cap = cv2.VideoCapture(0) # Usa a primeira webcam conectada

    if not cap.isOpened():
        print("Não foi possível abrir a câmera.")
        return

    # Define as coordenadas da vaga que você quer monitorar na sua webcam
    vaga_x1, vaga_y1 = 200, 200
    vaga_x2, vaga_y2 = 400, 400

    print("--- Serviço de Detecção da Câmera INICIADO ---")
    print(f"Monitorando a vaga: {VAGA_MONITORADA}")
    print(f"Enviando atualizações para: {BACKEND_API_URL}")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame, verbose=False)
            vaga_ocupada_agora = False # Começa como livre a cada checagem

            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    classe_id = int(box.cls[0])
                    nomeClasse = model.names[classe_id]

                    if nomeClasse == "car":
                        # Lógica para ver se o carro (box) está dentro da vaga (vaga_x1, etc.)
                        inter_x1 = max(vaga_x1, x1)
                        inter_y1 = max(vaga_y1, y1)
                        inter_x2 = min(vaga_x2, x2)
                        inter_y2 = min(vaga_y2, y2)

                        if inter_x1 < inter_x2 and inter_y1 < inter_y2:
                            vaga_ocupada_agora = True
                            break # Encontrou um carro na vaga, não precisa checar mais
                if vaga_ocupada_agora:
                    break
            
            # --- LÓGICA DE ATUALIZAÇÃO ---
            status_atual = "ocupada" if vaga_ocupada_agora else "livre"

            # Só envia a atualização para a internet se o status MUDOU
            if status_atual != ultimo_status_enviado:
                try:
                    payload = {
                        "vagaNumero": VAGA_MONITORADA,
                        "status": status_atual
                    }
                    # ✅ AVISANDO O BACKEND NO RENDER!
                    requests.post(BACKEND_API_URL, json=payload, timeout=5)
                    print(f"AVISO ENVIADO: Vaga {VAGA_MONITORADA} está {status_atual}")
                    ultimo_status_enviado = status_atual
                except requests.exceptions.RequestException as e:
                    print(f"Erro ao enviar atualização para o backend: {e}")

            # Mostra a janela da câmera no seu PC (como antes)
            cor_vaga = (0, 0, 255) if vaga_ocupada_agora else (0, 255, 0)
            texto = "OCUPADA" if vaga_ocupada_agora else "LIVRE"
            cv2.rectangle(frame, (vaga_x1, vaga_y1), (vaga_x2, vaga_y2), cor_vaga, 3)
            cv2.imshow("Monitor da Câmera (IA)", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
            time.sleep(1) # Espera 1 segundo antes de processar o próximo frame

    finally:
        cap.release()
        cv2.destroyAllWindows()

# --- Execução ---
if __name__ == '__main__':
    detectar_vaga()