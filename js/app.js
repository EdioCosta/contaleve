const ALERTA_TIPOS = {
  aviso: { titulo: "Atenção", icone: "bi-exclamation-triangle-fill" },
  erro: { titulo: "Algo deu errado", icone: "bi-x-circle-fill" },
  sucesso: { titulo: "Tudo certo!", icone: "bi-check-circle-fill" },
  info: { titulo: "Informação", icone: "bi-info-circle-fill" },
};

let alertaDialog = null;

function criarAlertaDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "alerta-modal";
  dialog.setAttribute("aria-labelledby", "alerta-modal-titulo");
  dialog.setAttribute("aria-describedby", "alerta-modal-mensagem");
  dialog.innerHTML = `
    <div class="alerta-modal-conteudo">
      <div class="alerta-modal-icone" aria-hidden="true"><i class="bi"></i></div>
      <h2 class="alerta-modal-titulo" id="alerta-modal-titulo"></h2>
      <p class="alerta-modal-mensagem" id="alerta-modal-mensagem"></p>
      <button type="button" class="btn btn-principal alerta-modal-botao">OK</button>
    </div>
  `;

  dialog
    .querySelector(".alerta-modal-botao")
    .addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return dialog;
}

function mostrarAlerta(mensagem, opcoes = {}) {
  const tipo = ALERTA_TIPOS[opcoes.tipo] ? opcoes.tipo : "aviso";
  const config = ALERTA_TIPOS[tipo];

  if (!alertaDialog) {
    alertaDialog = criarAlertaDialog();
  }

  const modalAberto = document.querySelector(".modal.show");
  const destino = modalAberto || document.body;
  if (alertaDialog.parentElement !== destino) {
    destino.appendChild(alertaDialog);
  }

  alertaDialog.dataset.tipo = tipo;
  alertaDialog.querySelector(".alerta-modal-icone i").className =
    `bi ${config.icone}`;
  alertaDialog.querySelector(".alerta-modal-titulo").textContent =
    opcoes.titulo || config.titulo;
  alertaDialog.querySelector(".alerta-modal-mensagem").textContent = mensagem;

  return new Promise((resolve) => {
    alertaDialog.addEventListener(
      "close",
      () => {
        if (opcoes.focar) {
          opcoes.focar.focus();
        }
        resolve();
      },
      { once: true },
    );

    if (alertaDialog.open) {
      alertaDialog.close();
    }
    alertaDialog.showModal();
    alertaDialog.querySelector(".alerta-modal-botao").focus();
  });
}

const totalReceitasEl = document.getElementById("total-receitas");
const totalDespesasEl = document.getElementById("total-despesas");
const saldoAtualEl = document.getElementById("saldo-atual");

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const dataInput = document.getElementById("data");

const receitaButton = document.getElementById("btn-receita");
const despesaButton = document.getElementById("btn-despesa");
const adicionarButton = document.getElementById("btn-adicionar");

const listaLancamentosEl = document.getElementById("lista-lancamentos");
const extratoButton = document.getElementById("btn-extrato");
const extratoRotuloEl = document.getElementById("btn-extrato-rotulo");

const modalPeriodoEl = document.getElementById("modal-periodo");
const periodoCustomCampos = document.getElementById("periodo-custom-campos");
const periodoDeInput = document.getElementById("periodo-de");
const periodoAteInput = document.getElementById("periodo-ate");
const dataPicker = document.getElementById("data-picker");
const periodoDePicker = document.getElementById("periodo-de-picker");
const periodoAtePicker = document.getElementById("periodo-ate-picker");
const periodoAplicarButton = document.getElementById("periodo-aplicar");
const periodoLimparButton = document.getElementById("periodo-limpar");


if (
  totalReceitasEl &&
  totalDespesasEl &&
  saldoAtualEl &&
  descricaoInput &&
  valorInput &&
  dataInput &&
  receitaButton &&
  despesaButton &&
  adicionarButton &&
  listaLancamentosEl &&
  extratoButton &&
  modalPeriodoEl
) {
  let tipoSelecionado = "receita";

  let filtro = { tipo: "todos", de: null, ate: null };

  const CHAVE_LANCAMENTOS = "contaleve_lancamentos_v1";

  function carregarLancamentos() {
    try {
      const dadosSalvos = localStorage.getItem(CHAVE_LANCAMENTOS);

      if (!dadosSalvos) {
        return [];
      }

      const dados = JSON.parse(dadosSalvos);

      if (!Array.isArray(dados)) {
        return [];
      }

      return dados.filter(
        (item) =>
          item &&
          typeof item.descricao === "string" &&
          item.descricao.trim() !== "" &&
          (item.tipo === "receita" || item.tipo === "despesa") &&
          Number.isFinite(item.valor) &&
          item.valor > 0 &&
          typeof item.data === "string"
      );
    } catch (erro) {
      console.error("Erro ao carregar lançamentos:", erro);
      return [];
    }
  }

  const lancamentos = carregarLancamentos();

  function salvarLancamentos() {
    try {
      localStorage.setItem(
        CHAVE_LANCAMENTOS,
        JSON.stringify(lancamentos)
      );

      return true;
    } catch (erro) {
      console.error("Erro ao salvar lançamentos:", erro);

      mostrarAlerta(
        "Não foi possível salvar os dados no navegador. Tente novamente.",
        { tipo: "erro" },
      );

      return false;
    }
  }

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const aplicarMascaraMoeda = (texto) => {
    const digitos = String(texto).replace(/\D/g, "");

    return digitos === "" ? "" : formatarMoeda(Number(digitos) / 100);
  };

  const converterValorParaNumero = (texto) => {
    const digitos = String(texto).replace(/\D/g, "");

    return digitos === "" ? NaN : Number(digitos) / 100;
  };

  const normalizarData = (data) =>
    new Date(data.getFullYear(), data.getMonth(), data.getDate());

  function parseDataBR(texto) {
    const partes = String(texto).split("/");

    if (partes.length !== 3) {
      return null;
    }

    const [dia, mes, ano] = partes.map(Number);
    const data = new Date(ano, mes - 1, dia);

    return Number.isNaN(data.getTime()) ? null : data;
  }

  const aplicarMascaraData = (texto) => {
    const digitos = String(texto).replace(/\D/g, "").slice(0, 8);

    return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4, 8)]
      .filter((parte) => parte !== "")
      .join("/");
  };

  const dataEhValida = (texto) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      return false;
    }

    const data = parseDataBR(texto);

    if (!data) {
      return false;
    }

    const [dia, mes, ano] = texto.split("/").map(Number);

    return (
      data.getDate() === dia &&
      data.getMonth() === mes - 1 &&
      data.getFullYear() === ano
    );
  };

  const PERIODOS_EM_DIAS = { "7d": 7, "15d": 15, "30d": 30 };

  const ROTULOS_PERIODO = {
    "7d": "Últimos 7 dias",
    "15d": "Últimos 15 dias",
    "30d": "Últimos 30 dias",
  };

  function filtrarPorPeriodo() {
    if (filtro.tipo === "todos") {
      return lancamentos.slice();
    }

    if (filtro.tipo === "custom") {
      const de = filtro.de ? parseDataBR(filtro.de) : null;
      const ate = filtro.ate ? parseDataBR(filtro.ate) : null;

      return lancamentos.filter((item) => {
        const data = parseDataBR(item.data);

        if (!data) {
          return false;
        }

        if (de && data < de) {
          return false;
        }

        if (ate && data > ate) {
          return false;
        }

        return true;
      });
    }

    const dias = PERIODOS_EM_DIAS[filtro.tipo];

    if (!dias) {
      return lancamentos.slice();
    }

    const limite = normalizarData(new Date());
    limite.setDate(limite.getDate() - (dias - 1));

    return lancamentos.filter((item) => {
      const data = parseDataBR(item.data);
      return data ? data >= limite : false;
    });
  }

  function atualizarRotuloFiltro() {
    if (!extratoRotuloEl) {
      return;
    }

    if (filtro.tipo === "todos") {
      extratoRotuloEl.textContent = "Lançamentos por período";
      return;
    }

    if (filtro.tipo === "custom") {
      extratoRotuloEl.textContent = `${filtro.de} – ${filtro.ate}`;
      return;
    }

    extratoRotuloEl.textContent = ROTULOS_PERIODO[filtro.tipo];
  }

  function sincronizarModalComFiltro() {
    modalPeriodoEl
      .querySelectorAll('input[name="periodo-opcao"]')
      .forEach((opcao) => {
        opcao.checked = opcao.value === filtro.tipo;
      });

    const ehCustom = filtro.tipo === "custom";

    periodoDeInput.value = ehCustom && filtro.de ? filtro.de : "";
    periodoAteInput.value = ehCustom && filtro.ate ? filtro.ate : "";
    periodoCustomCampos.classList.toggle("d-none", !ehCustom);
  }

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
    const visiveis = filtrarPorPeriodo();

    const totalReceitas = visiveis
      .filter((item) => item.tipo === "receita")
      .reduce((total, item) => total + item.valor, 0);

    const totalDespesas = visiveis
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

    const filtrados = filtrarPorPeriodo();
    const visiveis = filtro.tipo === "todos" ? filtrados.slice(0, 5) : filtrados;

    if (visiveis.length === 0) {
      const mensagem = document.createElement("p");
      mensagem.className = "text-muted mb-0";
      mensagem.textContent = "Nenhum lançamento no período selecionado.";

      listaLancamentosEl.appendChild(mensagem);
      return;
    }

    visiveis.forEach((item) => {
      const linha = document.createElement("div");
      linha.className = "row g-0 w-100 py-2 border-bottom align-items-center";

      const colunaData = criarColuna("col-6 col-md-3", item.data);
      const colunaDescricao = criarColuna("col-6 col-md-3", item.descricao);

      const colunaTipo = document.createElement("div");
      colunaTipo.className = "col-6 col-md-3";

      const etiqueta = document.createElement("span");
      etiqueta.className =
        item.tipo === "receita"
          ? "badge rounded-pill bg-success-subtle text-success-emphasis"
          : "badge rounded-pill bg-danger-subtle text-danger-emphasis";
      etiqueta.textContent = item.tipo === "receita" ? "Receita" : "Despesa";

      colunaTipo.appendChild(etiqueta);

      const colunaValor = document.createElement("div");
      colunaValor.className = "col-6 col-md-3 text-md-end fw-semibold";
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
    const valor = converterValorParaNumero(valorInformado);
    const dataInformada = dataInput.value.trim();

    if (!descricao) {
      mostrarAlerta("Informe a descrição do lançamento.", {
        focar: descricaoInput,
      });
      return;
    }

    if (!valorInformado || !Number.isFinite(valor) || valor <= 0) {
      mostrarAlerta("Informe um valor válido maior que zero.", {
        focar: valorInput,
      });
      return;
    }

    if (!dataEhValida(dataInformada)) {
      mostrarAlerta("Informe a data completa, no formato dd/mm/aaaa.", {
        focar: dataInput,
      });
      return;
    }

    const lancamento = {
      descricao: descricao,
      valor: Math.round(valor * 100) / 100,
      tipo: tipoSelecionado,
      data: dataInformada,
    };

    lancamentos.unshift(lancamento);
    if (!salvarLancamentos()) {
      lancamentos.shift();
      return;
    }

    atualizarResumoFinanceiro();
    renderizarLancamentos();

    descricaoInput.value = "";
    valorInput.value = "";
    dataInput.value = new Date().toLocaleDateString("pt-BR");
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

  valorInput.addEventListener("input", () => {
    valorInput.value = aplicarMascaraMoeda(valorInput.value);
  });

  [dataInput, periodoDeInput, periodoAteInput].forEach((campoData) => {
    campoData.addEventListener("input", () => {
      campoData.value = aplicarMascaraData(campoData.value);
    });
  });

  const ligarCalendario = (picker, campoTexto) => {
    if (!picker || !campoTexto) {
      return;
    }

    picker.addEventListener("change", () => {
      if (!picker.value) {
        return;
      }

      const [ano, mes, dia] = picker.value.split("-");
      campoTexto.value = `${dia}/${mes}/${ano}`;
    });
  };

  ligarCalendario(dataPicker, dataInput);
  ligarCalendario(periodoDePicker, periodoDeInput);
  ligarCalendario(periodoAtePicker, periodoAteInput);

  extratoButton.addEventListener("click", () => {
    sincronizarModalComFiltro();
    bootstrap.Modal.getOrCreateInstance(modalPeriodoEl).show();
  });

  modalPeriodoEl
    .querySelectorAll('input[name="periodo-opcao"]')
    .forEach((opcao) => {
      opcao.addEventListener("change", () => {
        const selecionado = modalPeriodoEl.querySelector(
          'input[name="periodo-opcao"]:checked',
        );
        const ehCustom = selecionado && selecionado.value === "custom";
        periodoCustomCampos.classList.toggle("d-none", !ehCustom);
      });
    });

  periodoAplicarButton.addEventListener("click", () => {
    const selecionado = modalPeriodoEl.querySelector(
      'input[name="periodo-opcao"]:checked',
    );

    if (!selecionado) {
      mostrarAlerta("Selecione um período.");
      return;
    }

    if (selecionado.value === "custom") {
      const de = periodoDeInput.value.trim();
      const ate = periodoAteInput.value.trim();

      if (!dataEhValida(de) || !dataEhValida(ate)) {
        mostrarAlerta(
          "Informe as datas inicial e final completas, no formato dd/mm/aaaa.",
        );
        return;
      }

      if (parseDataBR(de) > parseDataBR(ate)) {
        mostrarAlerta("A data inicial não pode ser maior que a data final.");
        return;
      }

      filtro = { tipo: "custom", de: de, ate: ate };
    } else {
      filtro = { tipo: selecionado.value, de: null, ate: null };
    }

    atualizarRotuloFiltro();
    atualizarResumoFinanceiro();
    renderizarLancamentos();

    bootstrap.Modal.getOrCreateInstance(modalPeriodoEl).hide();
  });

  periodoLimparButton.addEventListener("click", () => {
    filtro = { tipo: "todos", de: null, ate: null };

    atualizarRotuloFiltro();
    atualizarResumoFinanceiro();
    renderizarLancamentos();

    bootstrap.Modal.getOrCreateInstance(modalPeriodoEl).hide();
  });

  dataInput.value = new Date().toLocaleDateString("pt-BR");
  atualizarTipoSelecionado();
  atualizarRotuloFiltro();
  atualizarResumoFinanceiro();
  renderizarLancamentos();
}

const contatoForm = document.getElementById("contato-form");
const contatoFeedback = document.getElementById("contato-feedback");

if (contatoForm && contatoFeedback) {
  contatoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contatoForm.checkValidity()) {
      contatoForm.reportValidity();
      return;
    }

    contatoFeedback.classList.add("d-none");
    mostrarAlerta(
      "Formulário validado com sucesso! Nossa equipe fará contato com você em breve.",
      { tipo: "sucesso" },
    );

    contatoForm.reset();
  });
}
