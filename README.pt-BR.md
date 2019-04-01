# Mazon OS - Gerador de site estático
[![Build Status](https://travis-ci.com/joseafga/mazonos.com.svg?branch=master)](https://travis-ci.com/joseafga/mazonos.com)

O mazonos.com é um site estático e aqui nós temos o código utilizado para gerá-lo.

*Read this in other languages: [English](README.md), [Português (BR)](README.pt-BR.md).*

## Uso
O gerador utiliza Node.js para construir as páginas e npm como gerenciar os pacotes.

### Instruções
Faça download do repositório:

    $ git clone https://github.com/joseafga/mazonos.com.git

Acesse a pasta e execute a instalação das dependências:

    $ cd mazonos.com
    $ npm install

Execute o script para gerar o site estático:

    $ npm run build

Pronto! Basta aguardar o processo concluir e uma nova pasta chamada `build` aparecerá, nela estão os arquivos que foram gerados.

## Traduza
Ajude-nos a traduzir o site!

Para facilitar a tradução, foram utilizados formatos populares e de fácil leitura, sendo estes *markdown*, *json* e *yaml*. Dentro de `src/content/` são encontradas as pastas correspondentes a cada linguagem disponível. Cada linguagem possui um arquivo chamado `data.json`, nele ficam os dados compartilhados entre todas as páginas do site, demais arquivos `.md` correspondem as páginas em si.  
Para adicionar uma nova linguagem basta copiar a pasta com a linguagem de referência (de sua preferência) e então editar os arquivos de seu conteúdo.

## Contribua
Assim como em todo o projeto Mazon OS, toda contribuição é bem-vinda. Contribuições relacionadas ao gerador de site estático, como correções de erros e novas funcionalidades, devem ser feitas diretamente pelo Github. Para outras formas de contribuição ou dúvidas entre em contato pelos canais oficiais:

- **Email**: root@mazonos.com
- **IRC**: irc.freenode.net #mazonos
