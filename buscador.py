import webbrowser

def pesquisar_itens_lista(lista_de_compras):
    print("🤖 Iniciando robô de pesquisa de preços...")
    for item in lista_de_compras:
        print(f"Buscando: {item}")
        # Abre uma aba no seu navegador padrão para cada item
        url = f"https://www.google.com.br/search?q={item}+melhor+preço&tbm=shop"
        webbrowser.open(url)

# Simulação da sua lista do checklist
meus_itens = ["Fritadeira Elétrica", "Geladeira Frost Free", "Fogão 4 bocas"]

pesquisar_itens_lista(meus_itens)