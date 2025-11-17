import cv2
import time
import requests  # Biblioteca para "ligar" para o seu backend
from ultralytics import YOLO

# --- CONFIGURAÇÃO ---

# 1. URL do seu backend NO RENDER
# (Verifique se é 'upx-est-backend' ou o nome que você deu)
BACKEND_API_URL = "https://upx-est-backend.onrender.com/api/vagas/atualizar-status-ia"

# 2. A vaga que esta câmera está monitorando
VAGA_MONITORADA = "A1" 

# 3. Caminho para o seu modelo YOLO (já está na pasta)
MODELO_YOLO_PATH = 'ia-service/yolov8s.pt'

# 4. Índice da câmera (0 = webcam padrão)
CAMERA_INDEX = 0

# 5. Coordenadas da vaga (copiado do seu teste4.py)
vaga_x1, vaga_y1 = 200, 200
vaga_x2, vaga_y2 = 400, 400

# --- FIM DA CONFIGURAÇÃO ---

# Variável para guardar o último status enviado
status_anterior = None

print(f"--- Monitor de Vaga (Cliente) ---")
print(f"Monitorando Vaga: {VAGA_MONITORADA}")
print(f"Enviando atualizações para: {BACKEND_API_URL}")
print("Pressione 'q' para parar.")

try:
    # Carregar modelo
    model = YOLO(MODELO_YOLO_PATH)
    
    # Ligar a câmera
    cap = cv2.VideoCapture(CAMERA_INDEX)
    if not cap.isOpened():
        print(f"ERRO: Não foi possível abrir a câmera {CAMERA_INDEX}.")
        exit()

    print("Monitoramento iniciado.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Erro: Falha ao capturar frame.")
            break

        # --- Lógica de Detecção (do seu teste4.py) ---
        results = model(frame, verbose=False)
        vaga_ocupada_agora = False # Começa como livre a cada frame

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                classe_id = int(box.cls[0])
                nomeClasse = model.names[classe_id]

                # Verifica se é um carro
                if nomeClasse == "car":
                    # Lógica para ver se o carro (box) está dentro da vaga (vaga_x1, etc.)
                    inter_x1 = max(vaga_x1, x1)
                    inter_y1 = max(vaga_y1, y1)
                    inter_x2 = min(vaga_x2, x2)
                    inter_y2 = min(vaga_y2, y2)

                    # Verifica se há interseção
                    if inter_x1 < inter_x2 and inter_y1 < inter_y2:
                        vaga_ocupada_agora = True
                        break # Encontrou um carro na vaga, não precisa checar mais
            if vaga_ocupada_agora:
                break
        
        # --- LÓGICA DE ATUALIZAÇÃO (A parte nova) ---
        status_atual = "ocupada" if vaga_ocupada_agora else "livre"

        # Só envia a atualização para a internet se o status MUDOU
        if status_atual != status_anterior:
            try:
                payload = {
                    "vagaNumero": VAGA_MONITORADA,
                    "status": status_atual
                }
                # AVISANDO O BACKEND NO RENDER!
                response = requests.post(BACKEND_API_URL, json=payload, timeout=5)
                
                if response.status_code == 200:
                    print(f"✅ SINAL ENVIADO: Vaga {VAGA_MONITORADA} está {status_atual}")
                    status_anterior = status_atual # Atualiza o status
                else:
                    print(f"❌ Erro ao atualizar backend. Servidor respondeu: {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                print(f"❌ Erro de Conexão: Não foi possível conectar ao backend. {e}")

        # --- Visualização (do seu teste4.py) ---
        cor_vaga = (0, 0, 255) if vaga_ocupada_agora else (0, 255, 0)
        texto = "OCUPADA" if vaga_ocupada_agora else "LIVRE"
        cv2.rectangle(frame, (vaga_x1, vaga_y1), (vaga_x2, vaga_y2), cor_vaga, 3)
        cv2.putText(frame, f"Vaga: {texto}", (vaga_x1, vaga_y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, cor_vaga, 2)
        cv2.imshow("Monitor da Câmera (IA)", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        
        # Pequena pausa para não sobrecarregar a CPU e a rede
        time.sleep(1) 

finally:
    cap.release()
    cv2.destroyAllWindows()
    print("Monitoramento encerrado.")