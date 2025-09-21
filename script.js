document.addEventListener("DOMContentLoaded", () => {
  const vagas = ["A01","A02","A03","A04","A05","B01","B02","B03","B04","B05"];
  const parkingLot = document.getElementById("parking-lot");
  const form = document.getElementById("formEntrada");

  // Variável para guardar os dados do formulário temporariamente
  let dadosVeiculoPendente = null;

  // Função para lidar com o clique em uma vaga
  function handleVagaClick(event) {
    const vagaElement = event.currentTarget;

    // Caso 1: A vaga está ocupada (clique para liberar)
    if (vagaElement.classList.contains("ocupada")) {
      const placa = vagaElement.dataset.placa;
      const condutor = vagaElement.dataset.condutor;
      
      if (confirm(`Deseja liberar a vaga ${vagaElement.dataset.vagaId} (${placa} - ${condutor})?`)) {
        // Limpa os dados e o estilo
        vagaElement.classList.remove("ocupada");
        vagaElement.classList.add("livre");
        vagaElement.innerHTML = vagaElement.dataset.vagaId; // Restaura o nome original da vaga
        vagaElement.title = ""; // Limpa a dica de tela
        
        // Remove os dados do dataset
        delete vagaElement.dataset.condutor;
        delete vagaElement.dataset.ra;
        delete vagaElement.dataset.veiculo;
        delete vagaElement.dataset.placa;
      }
    } 
    // Caso 2: A vaga está livre e há dados pendentes (clique para ocupar)
    else if (dadosVeiculoPendente) {
      vagaElement.classList.remove("livre");
      vagaElement.classList.add("ocupada");

      // Armazena os dados do veículo no 'dataset' do elemento da vaga
      vagaElement.dataset.condutor = dadosVeiculoPendente.condutor;
      vagaElement.dataset.ra = dadosVeiculoPendente.ra;
      vagaElement.dataset.veiculo = dadosVeiculoPendente.veiculo;
      vagaElement.dataset.placa = dadosVeiculoPendente.placa;

      // Exibe a placa na vaga
      vagaElement.innerHTML = `${vagaElement.dataset.vagaId}<br><span style="font-size: 14px;">${dadosVeiculoPendente.placa}</span>`;
      
      // Adiciona mais detalhes na dica de tela (tooltip)
      vagaElement.title = `Condutor: ${dadosVeiculoPendente.condutor}\nRA: ${dadosVeiculoPendente.ra}\nVeículo: ${dadosVeiculoPendente.veiculo}`;
      
      // Limpa os dados pendentes e reseta o formulário
      dadosVeiculoPendente = null;
      form.reset();
    } 
    // Caso 3: A vaga está livre, mas não há dados pendentes
    else {
      alert("⚠️ Por favor, preencha e envie o formulário de entrada primeiro!");
    }
  }

  // Cria as vagas e adiciona o listener de clique
  vagas.forEach(vagaId => {
    const div = document.createElement("div");
    div.classList.add("vaga", "livre");
    div.innerText = vagaId;
    div.dataset.vagaId = vagaId; // Armazena o ID original da vaga
    div.addEventListener("click", handleVagaClick);
    parkingLot.appendChild(div);
  });

  // Validação do formulário
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const condutor = document.getElementById("condutor").value.trim();
    const ra = document.getElementById("ra").value.trim();
    const veiculo = document.getElementById("veiculo").value.trim();
    const placa = document.getElementById("placa").value.trim().toUpperCase();

    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;       // só letras
    const regexRA = /^\d{6}$/;                         // exatamente 6 números
    const regexVeiculo = /^[A-Za-z0-9\s-]+$/;          // letras, números e hifens
    const regexPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/; // Mercosul (AAA1B23 ou ABC1234)

    if (!regexNome.test(condutor)) {
      alert("❌ O nome do condutor deve conter apenas letras.");
      return;
    }
    if (!regexRA.test(ra)) {
      alert("❌ O RA deve conter exatamente 6 números.");
      return;
    }
    if (!regexVeiculo.test(veiculo)) {
      alert("❌ O modelo do veículo deve conter apenas letras e números.");
      return;
    }
    if (!regexPlaca.test(placa)) {
      alert("❌ A placa deve seguir o padrão Mercosul (ex: ABC1D23 ou ABC1234).");
      return;
    }

    // Se passar na validação, armazena os dados e avisa o usuário
    dadosVeiculoPendente = { condutor, ra, veiculo, placa };
    alert("✅ Dados validados! Agora clique em uma vaga verde para estacionar.");
  });
});
