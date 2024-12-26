# Travel Prego Simulator

## Simulador de Viagem com Socket.IO e Google Maps API

Este projeto simula a movimentação de veículos entre dois pontos, utilizando o Socket.IO para comunicação em tempo real e a API de Direções do Google Maps para obter rotas. Ele é desenvolvido em TypeScript e utiliza Node.js como ambiente de execução.

---

## Pré-requisitos

1. **Node.js**: Instale o [Node.js](https://nodejs.org/) (recomenda-se a versão 14 ou superior).
2. **npm ou yarn**: Certifique-se de ter um gerenciador de pacotes instalado.
3. **Chave da API do Google Maps**: Configure uma chave válida para acessar a API de Direções do Google Maps.
4. **Servidor Socket.IO**: Certifique-se de que o servidor Socket.IO esteja configurado e acessível.

---

## Configuração

### 1. Clone o repositório ou copie os arquivos do projeto.

```bash
git clone <url-do-repositorio>
cd travel_prego_simulator
```

### 2. Instale as dependências.

```bash
npm install
```

### 3. Crie o arquivo `.env`.

Na raiz do projeto, crie um arquivo `.env` com as seguintes variáveis de ambiente:

```env
SOCKET_IO_SERVER=http://seu-servidor-socket.io
GOOGLE_MAPS_API_KEY=sua-chave-google-maps
```

Substitua os valores pelas informações do seu ambiente.

---

## Como Executar o Projeto

1. Certifique-se de que o servidor Socket.IO está em execução.
2. Inicie o simulador com o comando:

```bash
npm start
```

---

## Fluxo de Execução

1. O simulador conecta-se ao servidor Socket.IO especificado na variável `SOCKET_IO_SERVER`.
2. Ele escuta eventos `travel-bot` enviados pelo servidor.
3. Para cada evento recebido:
   - Busca uma rota entre as localizações do motorista e o destino usando a API de Direções do Google Maps.
   - Simula a movimentação do veículo ao longo da rota, enviando atualizações de localização ao servidor em intervalos regulares.
   - Atualiza o status da viagem para "concluído" ao final do percurso.

---

## Estrutura do Projeto

```
travel_prego_simulator/
├── src/
│   ├── server.ts       # Código principal do simulador
│   └── utils/          # Funções auxiliares, como decodificação de polylines
├── .env                # Variáveis de ambiente
├── package.json        # Configuração do projeto
├── tsconfig.json       # Configuração do TypeScript
└── README.md           # Documentação do projeto
```

---

## Scripts Disponíveis

### Iniciar o projeto

```bash
npm start
```

Utiliza `nodemon` para reiniciar automaticamente o servidor a cada alteração nos arquivos.

### Linter e formatação

#### ESLint

Execute para verificar problemas de estilo e possíveis erros:

```bash
npm run lint
```

#### Prettier

Formate o código automaticamente:

```bash
npm run prettier
```

---

## Dependências

### Produção

- **axios**: Para requisições HTTP.
- **dotenv**: Para carregar variáveis de ambiente.
- **express**: Para lidar com rotas e middlewares (opcional).
- **polyline**: Para decodificar polylines da API do Google Maps.
- **socket.io** e **socket.io-client**: Para comunicação em tempo real.

### Desenvolvimento

- **TypeScript**: Para tipagem estática e desenvolvimento em TS.
- **ts-node**: Para executar TypeScript diretamente no Node.js.
- **nodemon**: Para reiniciar automaticamente o servidor durante o desenvolvimento.
- **eslint** e **prettier**: Para manter o código limpo e formatado.

---

## Exemplo de Uso

### Evento `travel-bot`

O servidor Socket.IO deve enviar um evento `travel-bot` com a seguinte estrutura:

```json
{
  "paymentId": "12345",
  "driverLocation": {
    "latitude": -23.55052,
    "longitude": -46.633308
  },
  "requestServiceLocation": {
    "latitude": -23.55253,
    "longitude": -46.63411
  },
  "destinationLocation": {
    "latitude": -23.561684,
    "longitude": -46.625378
  },
  "name": "João"
}
```

O simulador processará o evento, buscará a rota no Google Maps e enviará atualizações de localização ao servidor.

---

## Problemas Conhecidos

1. **API Key Inválida**: Certifique-se de que sua chave da API do Google Maps tem permissões para a API de Direções.
2. **Falta de Rota**: O Google Maps pode não retornar uma rota se as coordenadas forem inválidas ou estiverem muito distantes.

---

Pronto! Agora você pode rodar e personalizar o simulador conforme suas necessidades. 🎉
