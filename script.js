window.onload = function() {
    carregarLista();
};

function addItem() {
    const itemInput = document.getElementById('itemInput');
    const categoryInput = document.getElementById('categoryInput');
    
    if (itemInput.value.trim() === '') return;

    const novoItem = {
        id: Date.now(), // ID único para facilitar a edição/exclusão
        nome: itemInput.value,
        categoria: categoryInput.value,
        comprado: false
    };

    let itens = JSON.parse(localStorage.getItem('listaCasamento')) || [];
    itens.push(novoItem);
    localStorage.setItem('listaCasamento', JSON.stringify(itens));

    itemInput.value = '';
    carregarLista();
}

function carregarLista() {
    const list = document.getElementById('shoppingList');
    const filtro = document.getElementById('filterCategory').value;
    let itens = JSON.parse(localStorage.getItem('listaCasamento')) || [];
    
    list.innerHTML = '';

    // Lógica de Filtro
    const itensFiltrados = filtro === "Todos" ? itens : itens.filter(i => i.categoria === filtro);

    itensFiltrados.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-card';
        const termoBusca = encodeURIComponent(item.nome + " melhor preço");

        li.innerHTML = `
            <input type="checkbox" ${item.comprado ? 'checked' : ''} onchange="alternarStatus(${item.id})">
            <span class="item-name" style="${item.comprado ? 'text-decoration: line-through; color: #bdc3c7;' : ''}">
                ${item.nome}
            </span>
            <span class="category-tag">${item.categoria}</span>
            <div class="actions">
                <button onclick="editarItem(${item.id})" style="background: #f39c12; padding: 5px 10px; font-size: 0.7em;">Editar</button>
                <a href="https://www.google.com.br/search?q=${termoBusca}&tbm=shop" target="_blank" class="price-link">Preços</a>
            </div>
        `;
        list.appendChild(li);
    });
}

function alternarStatus(id) {
    let itens = JSON.parse(localStorage.getItem('listaCasamento'));
    itens = itens.map(item => {
        if (item.id === id) item.comprado = !item.comprado;
        return item;
    });
    localStorage.setItem('listaCasamento', JSON.stringify(itens));
    carregarLista();
}

function editarItem(id) {
    let itens = JSON.parse(localStorage.getItem('listaCasamento'));
    const item = itens.find(i => i.id === id);
    
    const novoNome = prompt("Editar nome do item:", item.nome);
    if (novoNome !== null && novoNome.trim() !== "") {
        item.nome = novoNome;
        localStorage.setItem('listaCasamento', JSON.stringify(itens));
        carregarLista();
    }
}