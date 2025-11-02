const fetch = require('node-fetch');
const { db } = require('../routes/vagas'); // Importa nosso banco de mentira

// URL da API do seu colega (Flask rodando na porta 5000)
const IA_API_URL = 'http://localhost:5000/status';

// A Vaga que o script do seu colega está monitorando (vamos associar ao 'A1')
const VAGA_MONITORADA_ID = 1; 

// Função que pergunta para a IA e atualiza nosso banco
const checarStatusIA = async () => {
    try {
        const response = await fetch(IA_API_URL);
        const data = await response.json(); // Espera: { vaga_ocupada: true } ou { vaga_ocupada: false }

        const vaga = db.vagas.find(v => v.id === VAGA_MONITORADA_ID);
        if (!vaga) return;

        const novoStatus = data.vaga_ocupada;

        // Se o status mudou, atualiza o banco de mentira
        if (vaga.ocupada !== novoStatus) {
            console.log(`INTEGRAÇÃO IA: Vaga ${vaga.numero_vaga} mudou para ${novoStatus ? 'OCUPADA' : 'LIVRE'}`);
            vaga.ocupada = novoStatus;
            
            if (novoStatus === true) {
                // Vaga foi ocupada (detectado pela IA)
                vaga.ocupadaPorRA = "IA-DETECTOU";
                vaga.data_chegada = new Date().toISOString();
            } else {
                // Vaga foi liberada (detectado pela IA)
                // Aqui, também registraríamos no histórico se o 'ocupadaPorRA' não fosse nulo
                vaga.ocupadaPorRA = null;
                vaga.data_chegada = null;
            }
        }

    } catch (error) {
        // Se o servidor da IA estiver desligado, apenas ignora
        // console.log("Serviço de IA não está respondendo. Tentando novamente...");
    }
};

// Função que inicia o "poller" (o checador)
const iniciarPoller = () => {
    console.log("Serviço de integração com a IA iniciado. Checando a cada 2 segundos...");
    // Roda a função 'checarStatusIA' a cada 2000 milissegundos (2 segundos)
    setInterval(checarStatusIA, 2000); 
};

module.exports = { iniciarPoller };