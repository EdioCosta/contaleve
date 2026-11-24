const totalReceitasEl = document.getElementById("total-receitas");
const totalDespesasEl = document.getElementById("total-despesas");
const saldoAtualEl = document.getElementById("saldo-atual");

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");

const receitaButton = document.getElementById("btn-receita");
const despesaButton = document.getElementById("btn-despesa");
const adicionarButton = document.getElementById("btn-adicionar");

const listaLancamentosEl = document.getElementById("lista-lancamentos");
const extratoButton = document.getElementById("btn-extrato");

// Executa esta parte somente na página que possui o painel financeiro.
if (
  totalReceitasEl &&
  totalDespesasEl &&
  saldoAtualEl &&
  descricaoInput &&
  valorInput &&
  receitaButton &&
  despesaButton &&
  adicionarButton &&
  listaLancamentosEl &&
  extratoButton
) {
  let tipoSelecionado = "receita";
  const lancamentos = [];

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  function atualizarTipoSelecionado() {
    receitaButton.classList.toggle(
      "btn-success",
      tipoSelecionado === "receita",
    );
    receitaButton.classList.toggle(
      "btn-outline-success",
      tipoSelecionado !== "receita",
    );

    despesaButton.classList.toggle("btn-danger", tipoSelecionado === "despesa");
    despesaButton.classList.toggle(
      "btn-outline-danger",
      tipoSelecionado !== "despesa",
    );

    receitaButton.setAttribute(
      "aria-pressed",
      String(tipoSelecionado === "receita"),
    );
    despesaButton.setAttribute(
      "aria-pressed",
      String(tipoSelecionado === "despesa"),
    );
  }

  function atualizarResumoFinanceiro() {
    const totalReceitas = lancamentos
      .filter((item) => item.tipo === "receita")
      .reduce((total, item) => total + item.valor, 0);

    const totalDespesas = lancamentos
      .filter((item) => item.tipo === "despesa")
      .reduce((total, item) => total + item.valor, 0);

    const saldoAtual = totalReceitas - totalDespesas;

    totalReceitasEl.textContent = formatarMoeda(totalReceitas);
    totalDespesasEl.textContent = formatarMoeda(totalDespesas);
    saldoAtualEl.textContent = formatarMoeda(saldoAtual);
  }

  function criarColuna(classe, texto) {
    const coluna = document.createElement("div");
    coluna.className = classe;
    coluna.textContent = texto;
    return coluna;
  }

  function renderizarLancamentos() {
    listaLancamentosEl.replaceChildren();

    if (lancamentos.length === 0) {
      const mensagem = document.createElement("p");
      mensagem.className = "text-muted mb-0";
      mensagem.textContent = "Nenhum lançamento registrado.";

      listaLancamentosEl.appendChild(mensagem);
      return;
    }

    // Mostra os cinco lançamentos mais recentes.
    lancamentos.slice(0, 5).forEach((item) => {
      const linha = document.createElement("div");
      linha.className = "row w-100 py-2 border-bottom align-items-center";

      const colunaData = criarColuna("col-3", item.data);
      const colunaDescricao = criarColuna("col-3", item.descricao);

      const colunaTipo = document.createElement("div");
      colunaTipo.className = "col-3";

      const etiqueta = document.createElement("span");
      etiqueta.className =
        item.tipo === "receita"
          ? "badge rounded-pill bg-success-subtle text-success-emphasis"
          : "badge rounded-pill bg-danger-subtle text-danger-emphasis";
      etiqueta.textContent = item.tipo === "receita" ? "Receita" : "Despesa";

      colunaTipo.appendChild(etiqueta);

      const colunaValor = document.createElement("div");
      colunaValor.className = "col-3 text-end fw-semibold";
      colunaValor.classList.add(
        item.tipo === "receita" ? "text-success" : "text-danger",
      );
      colunaValor.textContent = formatarMoeda(item.valor);

      linha.append(colunaData, colunaDescricao, colunaTipo, colunaValor);

      listaLancamentosEl.appendChild(linha);
    });
  }

  function adicionarLancamento() {
    const descricao = descricaoInput.value.trim();
    const valorInformado = valorInput.value.trim();
    const valor = Number(valorInformado);

    if (!descricao) {
      alert("Informe a descrição do lançamento.");
      descricaoInput.focus();
      return;
    }

    if (!valorInformado || !Number.isFinite(valor) || valor <= 0) {
      alert("Informe um valor válido maior que zero.");
      valorInput.focus();
      return;
    }

    const lancamento = {
      descricao: descricao,
      valor: Math.round(valor * 100) / 100,
      tipo: tipoSelecionado,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    // Coloca o lançamento mais recente no início da lista.
    lancamentos.unshift(lancamento);

    atualizarResumoFinanceiro();
    renderizarLancamentos();

    descricaoInput.value = "";
    valorInput.value = "";
    descricaoInput.focus();
  }

  receitaButton.addEventListener("click", () => {
    tipoSelecionado = "receita";
    atualizarTipoSelecionado();
  });

  despesaButton.addEventListener("click", () => {
    tipoSelecionado = "despesa";
    atualizarTipoSelecionado();
  });

  adicionarButton.addEventListener("click", adicionarLancamento);

  // Botão de ação da lista de lançamentos (comportamento atual mantido).
  extratoButton.addEventListener("click", adicionarLancamento);

  // Estado inicial do painel.
  atualizarTipoSelecionado();
  atualizarResumoFinanceiro();
  renderizarLancamentos();
}
