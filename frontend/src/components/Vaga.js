import React from 'react';
import './Vaga.css'; // Vamos criar um CSS específico para a vaga

function Vaga({ numero, estaOcupada, ocupadaPorMim, onClick }) {
    
    let statusClasse = 'vaga-livre';
    let eClicavel = true;

    if (estaOcupada) {
        if (ocupadaPorMim) {
            statusClasse = 'vaga-minha'; // Azul
        } else {
            statusClasse = 'vaga-ocupada'; // Vermelho
            eClicavel = false; // Vagas de outros não são clicáveis para o usuário
        }
    }

    // Na tela de admin, o Vaga.css vai sobrescrever o cursor
    // (Melhoria: podemos passar uma prop 'isAdmin' no futuro)

    return (
        <div 
            // Adiciona a classe 'clicavel' se a vaga puder ser clicada
            className={`vaga ${statusClasse} ${eClicavel ? 'clicavel' : ''}`} 
            onClick={eClicavel ? onClick : null}
        >
            {numero}
        </div>
    );
}
export default Vaga;
// A linha 'fetch' e 'import' extras foram removidas daqui