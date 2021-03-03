<h1 align="center">
    <img  src="/public/imagens/ajudi-icon-preto.png" />
</h1>

## 💻 Sobre o projeto

⚖️ AJUDI - Assistente Jurídico - é um sistema gerenciador jurídico que visa aprimorar a qualidade de gestão de escritórios de advocacia, com enfoque na otimização de tempo em relação a busca de dados e documentos pessoais de clientes, assim como, informações processuais.

---

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e [MongoDB](https://www.mongodb.com/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

## 🗝️ Credenciais Google Drive API
Para testar a funcionalidade de documentos, [crie uma credencial da API](https://www.iperiusbackup.net/pt-br/como-habilitar-a-api-do-google-drive-e-obter-credenciais-de-cliente/) e coloque na váriavel CLIENT_ID em <i>public/controller/documentos/login-google.js</i>

### ⚠️ Importante
Lembre-se de adicionar as URIs de origem e redirecionamento adequadamente.


## ⚙️ Funcionalidades

- [x] Registrar-se
- [x] Fazer Login
  - [x] Cadastrar Cliente
    -  Consultar dados do Cliente
  - [x] Agendar Eventos
    -  Emitir Relatório de Agendamentos
  - [x] Arquivar Documentos
    -  Apagar Documento
    -  Fazer Download de Documentos
  - [x] Cadastrar Processos
    -  Consultar dados do Processo
  - [x] Apagar Registros
  - [x] Editar Registros


---



### 🎲 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ git clone <https://github.com/alinebeatrizw/ajudi-aj.git>

# Acesse a pasta do projeto no terminal/cmd
$ cd ajudi-aj

# Instale as dependências
$ npm ci

# Inicie o MongoDB
$ mongod

# Acesse a pasta do projeto em um novo terminal/cmd 
$ cd ajudi-aj

# Execute a aplicação
$ node app

# O servidor inciará na porta:8081- acesse <http://localhost:8081>
```


### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Bootstrap](https://getbootstrap.com/)
- [Google Drive API](https://developers.google.com/drive)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Passport](http://www.passportjs.org/)
- [Flash](https://www.npmjs.com/package/flash)
- [Express](https://expressjs.com/pt-br/)

### 🕹️ Resultados

<h1 align="center">
    <img  src="/public/imagens/gifResultado.gif" />
</h1>
