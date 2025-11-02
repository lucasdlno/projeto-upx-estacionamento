import apiUrl from '@/lib/api';
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

    // Na tela de admin, todas são clicáveis para ver detalhes
    // (Precisaríamos de uma prop "isAdmin" para melhorar isso, mas por enquanto funciona)

    return (
        <div 
            className={`vaga ${statusClasse}`} 
            onClick={eClicavel ? onClick : null}
        >
            {numero}
        </div>
    );
}
export default Vaga;
fetch(`${apiUrl}/api/vagas`)