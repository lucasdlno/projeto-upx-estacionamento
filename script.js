const parkingLotContainer = document.getElementById('parkingLot');
const modal = document.getElementById('infoModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeButton = document.querySelector('.close-button');

let currentVagaId = null;

// --- Dados simulando banco ---
let vagasData = [
  { id: 'A01', status: 'occupied', carro: { modelo: 'Fiat Argo', placa: 'ABC-1234' }, pessoa: { nome: 'João Silva', ra: 'N12345' }, datachegada: '25/08/2025 19:40' },
  { id: 'A02', status: 'available' },
  { id: 'A03', status: 'available' },
  { id: 'A04', status: 'occupied', carro: { modelo: 'Honda Civic', placa: 'XYZ-9876' }, pessoa: { nome: 'Maria Oliveira', ra: 'N67890' }, datachegada: '25/08/2025 20:15' },
  { id: 'A05', status: 'available' },
  { id: 'B01', status: 'available' },
  { id: 'B02', status: 'occupied', carro: { modelo: 'VW Nivus', placa: 'QWE-4567' }, pessoa: { nome: 'Carlos Pereira', ra: 'N54321' }, datachegada: '25/08/2025 18:30' },
  { id: 'B03', status: 'available' },
  { id: 'B04', status: 'available' },
  { id: 'B05', status: 'available' },
];

// --- Serviços de Vagas ---
const VagasService = {
  ocupar(id, pessoa, carro) {
    const vaga = vagasData.find(v => v.id === id);
    if (!vaga) return;
    Object.assign(vaga, {
      status: "occupied",
      pessoa,
      carro,
      datachegada: formatDateTime(new Date())
    });
  },
  liberar(id) {
    const vaga = vagasData.find(v => v.id === id);
    if (!vaga) return;
    Object.assign(vaga, { status: "available" });
    delete vaga.pessoa;
    delete vaga.carro;
    delete vaga.datachegada;
  }
};

// --- Util ---
function formatDateTime(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

// --- Renderização ---
function renderVagas() {
  parkingLotContainer.innerHTML = '';
  vagasData.forEach(vaga => {
    const vagaElement = document.createElement('div');
    vagaElement.classList.add('parking-space', vaga.status);
    vagaElement.innerText = vaga.id;
    vagaElement.dataset.vagaId = vaga.id;
    parkingLotContainer.appendChild(vagaElement);
  });
}

// --- Modal ---
function openModal(title, bodyHtml) {
  modalTitle.innerText = title;
  modalBody.innerHTML = bodyHtml;
  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
}

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// --- Eventos ---
parkingLotContainer.addEventListener('click', (e) => {
  const vagaId = e.target.dataset.vagaId;
  if (!vagaId) return;

  currentVagaId = vagaId;
  const vaga = vagasData.find(v => v.id === vagaId);

  vaga.status === "occupied"
    ? showDetailsModal(vaga)
    : showEntryFormModal(vaga);
});

// --- Modal Templates ---
function showDetailsModal(vaga) {
  openModal(
    `Detalhes da Vaga ${vaga.id}`,
    `
    <p><strong>Status:</strong> Ocupada</p>
    <p><strong>Data de Chegada:</strong> ${vaga.datachegada}</p>
    <hr>
    <p><strong>Condutor:</strong> ${vaga.pessoa.nome}</p>
    <p><strong>RA:</strong> ${vaga.pessoa.ra}</p>
    <p><strong>Veículo:</strong> ${vaga.carro.modelo}</p>
    <p><strong>Placa:</strong> ${vaga.carro.placa}</p>
    <div class="modal-buttons">
      <button class="btn btn-danger" id="btnSaida">Registrar Saída</button>
    </div>
    `
  );

  document.getElementById("btnSaida").addEventListener("click", () => {
    VagasService.liberar(currentVagaId);
    closeModal();
    renderVagas();
  });
}

function showEntryFormModal(vaga) {
  openModal(
    `Registrar Entrada na Vaga ${vaga.id}`,
    `
    <form id="entryForm">
      <div class="form-group">
        <label for="nome">Nome do Condutor:</label>
        <input type="text" id="nome" required>
      </div>
      <div class="form-group">
        <label for="ra">RA:</label>
        <input type="text" id="ra" required>
      </div>
      <div class="form-group">
        <label for="modelo">Modelo do Veículo:</label>
        <input type="text" id="modelo" required>
      </div>
      <div class="form-group">
        <label for="placa">Placa:</label>
        <input type="text" id="placa" required>
      </div>
      <div class="modal-buttons">
        <button type="submit" class="btn btn-primary">Ocupar Vaga</button>
      </div>
    </form>
    `
  );

  document.getElementById('entryForm').addEventListener('submit', (event) => {
    event.preventDefault();
    VagasService.ocupar(currentVagaId, {
      nome: document.getElementById('nome').value,
      ra: document.getElementById('ra').value
    }, {
      modelo: document.getElementById('modelo').value,
      placa: document.getElementById('placa').value
    });

    closeModal();
    renderVagas();
  });
}

// --- Inicialização ---
renderVagas();
