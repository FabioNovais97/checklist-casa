// Configuração do Supabase
const SUPABASE_URL = 'https://iqhwjxrjtnujnoteqrzu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Gav_IDnyFOzRCOnuJBx7gA_tK19CqW3';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.onload = function() {
    carregarLista();
};

// ADICIONAR ITEM NO BANCO
async function addItem() {
    const itemInput = document.getElementById('itemInput');
    const categoryInput = document.getElementById('categoryInput');
    
    if (itemInput.value.trim() === '') return;

    const { error } = await _supabase
        .from('ListaCasamento')
        .insert([{ 
            nome: itemInput.value, 
            categoria: categoryInput.value, 
            comprado: false 
        }]);

    if (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar no banco!");
    } else {
        itemInput.value = '';
        carregarLista();
    }
}

// CARREGAR LISTA DA NUVEM
async function carregarLista() {
    const list = document.getElementById('shoppingList');
    const filtro = document.getElementById('filterCategory').value;
    
    let { data: itens, error } = await _supabase
        .from('ListaCasamento')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Erro ao carregar:", error);
        return;
    }

    list.innerHTML = '';

    const itensFiltrados = filtro === "Todos" ? itens : itens.filter(i => i.categoria === filtro);

    itensFiltrados.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-card';
        const termoBusca = encodeURIComponent(item.nome + " melhor preço");

        li.innerHTML = `
            <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="alternarStatus(${item.id}, ${item.comprado})">
            <span class="item-name" style="${item.comprado ? 'text-decoration: line-through; color: #bdc3c7;' : ''}">
                ${item.nome}
            </span>
            <span class="category-tag">${item.categoria}</span>
            <div class="actions">
                <button onclick="editarItem(${item.id})" style="background: #f39c12; color: white; padding: 5px 10px; border:none; border-radius:5px; cursor:pointer;">Editar</button>
                <a href="https://www.google.com.br/search?q=${termoBusca}&tbm=shop" target="_blank" class="price-link">Preços</a>
            </div>
        `;
        list.appendChild(li);
    });
}

// --- FUNÇÃO ACRESCENTADA: ABRIR MODO DE EDIÇÃO ---
async function editarItem(id) {
    // Busca o item específico para preencher os campos
    const { data: item } = await _supabase
        .from('ListaCasamento')
        .select('*')
        .eq('id', id)
        .single();

    const btnEditar = document.querySelector(`button[onclick="editarItem(${id})"]`);
    const divCard = btnEditar.closest('.item-card');
    
    divCard.innerHTML = `
        <div class="edit-mode-container" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
            <input type="text" id="edit-nome-${id}" value="${item.nome}" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
            
            <select id="edit-categoria-${id}" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="Cozinha" ${item.categoria === 'Cozinha' ? 'selected' : ''}>Cozinha</option>
                <option value="Quarto" ${item.categoria === 'Quarto' ? 'selected' : ''}>Quarto</option>
                <option value="Banheiro" ${item.categoria === 'Banheiro' ? 'selected' : ''}>Banheiro</option>
                <option value="Sala" ${item.categoria === 'Sala' ? 'selected' : ''}>Sala</option>
                <option value="Lavanderia" ${item.categoria === 'Lavanderia' ? 'selected' : ''}>Lavanderia</option>
            </select>

            <div style="display: flex; gap: 5px;">
                <button onclick="salvarAlteracao(${id})" style="background: #2ecc71; color: white; flex: 1; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Salvar</button>
                <button onclick="carregarLista()" style="background: #e74c3c; color: white; flex: 1; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Cancelar</button>
            </div>
        </div>
    `;
}

// ALTERNAR STATUS (Checkmark)
async function alternarStatus(id, statusAtual) {
    const { error } = await _supabase
        .from('ListaCasamento')
        .update({ comprado: !statusAtual })
        .eq('id', id);

    if (!error) carregarLista();
}

// SALVAR EDIÇÃO DE NOME E CATEGORIA
async function salvarAlteracao(id) {
    const novoNome = document.getElementById(`edit-nome-${id}`).value;
    const novaCategoria = document.getElementById(`edit-categoria-${id}`).value;

    if (!novoNome) return alert("O nome não pode estar vazio!");

    const { error } = await _supabase
        .from('ListaCasamento')
        .update({ 
            nome: novoNome, 
            categoria: novaCategoria 
        })
        .eq('id', id);

    if (!error) {
        carregarLista();
    } else {
        alert("Erro ao atualizar!");
    }
}