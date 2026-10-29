# Datweb Sistemas — Web Site 2027

Site institucional e portfólio das soluções **PromoBank**, **Lukro ERP** e **Vizage Facial**, com identidade clara em azul, layout responsivo e prévia local sem dependências externas de execução.

## Abrir no Antigravity IDE

1. No Antigravity, abra a pasta deste repositório ou o arquivo `Datweb.code-workspace`.
2. No terminal integrado, execute:

   ```bash
   npm run dev
   ```

3. Abra [http://127.0.0.1:3000](http://127.0.0.1:3000).

Requisito: **Node.js 20 ou superior**, com npm. Não é necessário executar `npm install`: o projeto não utiliza pacotes de terceiros.

Também estão incluídas as tarefas **Datweb: iniciar prévia** e **Datweb: verificar projeto**, além da configuração **Datweb: abrir no Chrome** para editores compatíveis com as configurações do VS Code.

Se a porta estiver ocupada, use `PORT=3001 npm run dev` no macOS/Linux. A prévia escuta apenas no computador local por padrão.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia a prévia local e reinicia o servidor quando seu código muda |
| `npm start` | Inicia a prévia sem modo de observação |
| `npm test` | Verifica páginas, recursos, scripts, formulários, carrossel e servidor |

Após editar HTML, CSS ou JavaScript do navegador, atualize a página para visualizar as mudanças.

## Recursos implementados

- Três slides com imagens distintas, rotação automática, pausa e navegação manual.
- Identidade clara em azul, cards de vidro e tipografia com contraste reforçado.
- Slide Vizage com representação ilustrativa de leitura biométrica na região dos olhos.
- Vitrine e detalhes dos produtos, cards estáticos, serviços e simulador ilustrativo.
- Grade de 12 instituições financeiras: seis por linha no computador, adaptada para telas menores.
- Formulário principal e solicitação de demonstração com validação e preparação de mensagem para o WhatsApp comercial **(65) 3029-9800**.
- Página de políticas e certificados e links de contato existentes.

Os formulários abrem o WhatsApp com os dados preenchidos. O visitante revisa e confirma o envio na conversa; o site não afirma que recebeu ou entregou uma mensagem antes disso e não possui backend de armazenamento de contatos.

O aviso de cookies está temporariamente oculto por solicitação durante a revisão visual. Essa ocultação não registra consentimento. Para reexibi-lo, remova o atributo `hidden` do elemento `#cookie-banner` em `index.html`.

As projeções do simulador são ilustrativas. As imagens de campanha em `media/` são ilustrações geradas para o projeto; não representam depoimentos de clientes. Os nomes e marcas de terceiros permanecem pertencentes aos respectivos titulares. As fontes web são carregadas do Google Fonts, com alternativas locais configuradas.

## Estrutura

```text
index.html                     Página principal
politicas-certificados.html    Página de políticas e certificados
css/                           Estilos, identidade e refinamentos responsivos
js/                            Navegação, carrossel, simulador e WhatsApp
assets/                        Imagens e arquivos do projeto original
media/                         Campanhas e ícones das instituições financeiras
tests/                         Verificações automatizadas sem dependências
server.js                      Servidor de prévia local
.vscode/                       Tarefas e configuração de depuração
Datweb.code-workspace          Workspace para o Antigravity/editores compatíveis
```

O site é estático: para hospedagem, os arquivos públicos podem ser servidos diretamente, sem etapa de compilação. `server.js` é destinado à prévia de desenvolvimento.

## Repositório

[github.com/cleitondeive/Web-Site-Datweb-2027](https://github.com/cleitondeive/Web-Site-Datweb-2027)

Backups locais de revisão, capturas de teste, arquivos temporários e credenciais não integram o versionamento. A pasta original mantém seus backups locais.
