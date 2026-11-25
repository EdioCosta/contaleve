ContaLeve
ContaLeve é um projeto acadêmico de desenvolvimento front-end que propõe uma plataforma digital simples para ajudar pessoas a organizar suas finanças pessoais. A interface foi pensada para quem deseja acompanhar entradas, saídas e saldo sem depender de planilhas complexas ou de conhecimentos específicos de finanças.
O projeto foi desenvolvido com HTML5, CSS3, Bootstrap 5 e JavaScript puro, com foco em uma experiência visual intuitiva, responsiva e fácil de usar.

Objetivo
Demonstrar a construção de um site institucional com páginas interligadas e um painel financeiro funcional, aplicando os conceitos de estruturação semântica, estilização, responsividade, manipulação do DOM, eventos JavaScript, validação de formulários e persistência de dados no navegador.
Funcionalidades
Páginas institucionais
- Home (index.html): apresenta a proposta da ContaLeve, os principais recursos e um acesso ao painel.
- Sobre nós (sobre.html): apresenta o propósito da plataforma e os benefícios propostos.
- Contato (contato.html): exibe canais de contato ilustrativos e um formulário com campos obrigatórios e validação do navegador.
- Painel (painel.html): permite registrar receitas e despesas e acompanhar um resumo financeiro.
Painel financeiro
- Seleção entre os tipos de lançamento Receita e Despesa.
- Registro de uma descrição e de um valor positivo.
- Cálculo automático do total de receitas, total de despesas e saldo atual.
- Exibição dos cinco lançamentos mais recentes.
- Formatação dos valores em reais (BRL).
- Persistência dos lançamentos no navegador usando localStorage, permitindo que os dados sejam recuperados ao atualizar ou reabrir a página no mesmo navegador e origem.
Formulário de contato
- Campos para nome completo, e-mail, assunto e mensagem.
- Validação de campos obrigatórios e do formato do e-mail pelo navegador.
- Mensagem de confirmação demonstrativa após a validação.

Tecnologias utilizadas
- HTML5 — estrutura e elementos semânticos das páginas.
- CSS3 — identidade visual, cores, tipografia, espaçamentos e ajustes de layout.
- Bootstrap 5 — grid responsivo, componentes e utilitários de interface.
- Bootstrap Icons — ícones da interface.
- JavaScript puro (Vanilla JavaScript) — eventos, validação, manipulação do DOM e cálculos financeiros.
- Web Storage API (localStorage) — armazenamento local dos lançamentos.
Identidade visual
A interface utiliza uma paleta consistente entre as páginas:
| Cor           | Código    | Aplicação principal |
| Azul          | `#0D47A1` | Cor principal, cabeçalho e títulos |
| Verde         | `#2E7D32` | Destaques positivos e identificação de receitas |
| Laranja       | `#F57C00` | Ações e elementos de destaque |
| Cinza-azulado | `#263238` | Texto principal |
| Cinza-claro   | `#F5F7FA` | Fundo de áreas de conteúdo |
| Branco        | `#FFFFFF` | Cards e áreas de contraste |  

O layout utiliza componentes e classes do Bootstrap para adaptar a apresentação a diferentes larguras de tela.
Como executar localmente
O projeto é estático e não exige instalação de dependências ou processo de compilação.
1. Faça o download ou clone o repositório.
2. Abra a pasta contaleve no Visual Studio Code.
3. Inicie um servidor local, por exemplo, usando a extensão Live Server.
4. Abra index.html pelo servidor e navegue pelas opções do cabeçalho para acessar as demais páginas.
Recomenda-se usar um servidor local em vez de abrir os arquivos diretamente pelo sistema de arquivos. Assim, a origem do site permanece consistente e o localStorage funciona de maneira mais previsível.

As folhas de estilo e os ícones do Bootstrap são carregados por CDN; por isso, a conexão com a internet é necessária para carregar esses recursos externos.
Como funciona a persistência
Os lançamentos do painel são convertidos em JSON e guardados no localStorage do navegador com a chave contaleve_lancamentos_v1.

Isso significa que:
- os lançamentos podem ser recuperados ao atualizar a página;
- os dados ficam armazenados naquele navegador e naquela origem;
- os dados não são sincronizados entre dispositivos ou navegadores;
- limpar os dados do site no navegador pode apagar os lançamentos.

Projeto desenvolvido como exercício de aplicação prática dos fundamentos de desenvolvimento front-end, com ênfase em HTML, CSS, Bootstrap e JavaScript.
ContaLeve — Gestão financeira pessoal, de forma simples e acessível.