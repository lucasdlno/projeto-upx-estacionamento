import React from 'react';
import './Vaga.css';

function Vaga({ numero, estaOcupada, ocupadaPorMim, onClick }) {
    
    let statusClasse = 'vaga-livre';
    let eClicavel = true; // ✅ Vagas são clicáveis por padrão

    if (estaOcupada) {
        if (ocupadaPorMim) {
            statusClasse = 'vaga-minha'; // Azul
            // A vaga continua clicável para que eu possa liberá-la
        } else {
            statusClasse = 'vaga-ocupada'; // Vermelho
            eClicavel = false; // ✅ Vagas de outros não são clicáveis
        }
    }

    return (
        <div 
            className={`vaga ${statusClasse}`} 
            onClick={eClicavel ? onClick : null} // ✅ A lógica de clique agora usa a nova variável
        >
            {numero}
        </div>
    );
}

export default Vaga;