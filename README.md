# Smart Home em Node.Js
Sistema inteligente com comunicação cliente/servidor utilizando Protobuf implementada em node.js

## Etapas do desenvolvimento

- [X] Comunicação TCP CLiente - Servidor
- [X] Utilizar Socket
- [ ] Clean Code

### Para rodar é importante ter o Node.js na sua maquina
Você pode baixar neste <a href="https://nodejs.org/en/download/">link</a> ou usar um gerenciador de pacotes. Neste exemplo, utilizei os comandos npm.
```
$ npm install node
```
São necessárias algumas bibliotecas do node, listadas abaixo:
```
$ npm install 

```
#### Execute primeiro o servidor
```
$ node app.js
```
##### Depois vá no no seu navegador de internet e digite
```
127.0.0.1:7000
```

###### Preencha os campos para entrar no chat
<br>
<ul>
    <li>IP do servidor: 127.0.0.1</li>
    <li>Porta do servidor: 7000</li>
</ul>


Obs: Caso queira modificar os arquivos, siga este tutorial:
<br>

1) Após Modificar dispositivos.proto

```
protoc --js_out=import_style=commonjs,binary:. dispositivos.proto

```
2) Após Modificar login.proto

```
protoc --js_out=import_style=commonjs,binary:. login.proto

```

3) Após Modificar teste.js, consequentemente, ao executar o comando abaixo, o arquivo bundle.js é automaticamente atualizado.
```
npm run build

```
ou
```
browserify teste.js -o bundle.js

```

4) Após Modificar App.js
```
Node app.js

```

