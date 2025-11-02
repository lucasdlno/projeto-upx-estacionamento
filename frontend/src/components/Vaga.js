import React from 'react';
import './Vaga.css'; // O caminho para o CSS está correto

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

    return (
        <div 
            className={`vaga ${statusClasse} ${eClicavel ? 'clicavel' : ''}`} 
            onClick={eClicavel ? onClick : null}
        >
            {numero}
        </div>
    );
}
export default Vaga;
// A linha 'fetch' e 'import' extras foram removidas.