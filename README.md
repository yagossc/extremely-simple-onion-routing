# Extremely Simple Onion Routing Implementation in Nodejs

Introdução Teórica
===================
> De maneira geral, podemos comparar o funcionamento do Onion Routing com o do Bittorrent, pois da mesma forma faz-se necessário o uso de uma entidade *Tracker* para listar os usuários cadastros na rede de peers, façamos então uma breve listagem do funcionamento do Onion Routing: 
> - O ponto inicial solicita uma circuito de conexão (no código: entryPoint.js) para chegar a um alvo/end point (no código: endPoint.js);
> - Os usuários que se disponibilizaram a fazer parte da relay network estarão listados no *tracker* da rede juntamente com uma chave publica de cada nó para o processo de encryption(criptografia);
> - A aplicação estabelece um circuito de nós na rede e devolve para o solicitante;
> - A informação vai ser criptografada em camadas, de maneira que, fazendo uso das chaves públicas, cada nó somente revelará a informação sobre o próximo salto na rede;
> - Após gerada a Onion e estabelecido o circuito, a informação é enviada pela rede;

> Este funcionamento está mais detalhado em: https://www.onion-router.net/Publications/SSP-1997.pdf e https://en.wikipedia.org/wiki/Tor_(anonymity_network)

> Com esta breve explicação, fica fácil perceber algumas falhas de segurança óbvias, como um eavesdropping no ultimo nó da rede, a qual pode ser corrigida através do uso de end-to-end cryptography (SSL, TSL, etc).

> Explicação por esquemático:  
> Link 1: https://drive.google.com/open?id=0B9b9Nv3HnVaVYkFWZDBNS2laVk0  
> Link 2: https://drive.google.com/open?id=0B9b9Nv3HnVaVRWdBR0gxTzl4Vk0  

> Implementação assistida:
> Link 1: https://drive.google.com/open?id=0B9b9Nv3HnVaVdjZGNlVZRnJBNmM  


USAGE & CONFIGURATION
===================
> Você precisará de cinco máquinas na mesma rede local para simular o sistema distribuído. No meu caso, usei a minha própria rodando quatro VM's acessíveis por SSH (aconselho o mesmo procedimento);
> - Por que cinco máquinas?
> - 1 máquina rodando o *tracker*: nodeDir.js (Node Directory);
> - 1 máquina como ponto de entrada: entryPoint.js;
> - 1 máquina como ponto final: endPoint.js;
> - 2 máquinas como nós do circuito: circuitNode.js.

> Clone o diretório ou copie os arquivos em cada uma;

Servidor/Tracker/Node Directory:
> A máquina rodando nodeDir.js não precisa de configurações extras.

Nó do circuito:
> As máquinas rodando circuitNode.js, é necessária a seguinte alterações:
> - Na linha 23 do arquivo edite: client.connect(3478, 'Ip da sua máquina rodando nodeDir.js');

Ponto de Entrada:
> A máquina rodando entryPoint.js precisa de uma alteração no IP do endPoint:
> - Na linha 17 do arquivo edite: getCircuit.connect(3478, 'Ip da sua máquina end point');

Execute na ordem:
> - Execute o *tracker*/*node directory* : nodeDir.js;
> - Execute cada um dos nós d circuito: circuitNode.js (1) & (2);
> - Execute o end point: endPoint.js;
> - Execute o entry point: entryPoint.js.

Demo:
> Link para o vídeo de uma breve Demo:  
> https://drive.google.com/file/d/0B9b9Nv3HnVaVVWFuYnV0ckVtNHM/view?usp=sharing   
> Aconselho baixar o vídeo ao invés de assistir no player.

VM:
> Link para a VM (ubuntu server com openSSH configurado, configure a interface de rede da VM em modo bridged e faça como no vídeo alterando os ip's)  
> https://drive.google.com/file/d/0B9b9Nv3HnVaVR1dUcmRHM2d0X0E/view?usp=sharing  
> Cada vm é apenas um clone da primeira.

TO DO
===================

> Udp Hole Punching para poder aplicar o projeto fora da rede local;
> Enviar mensagem no sentido inverso da conexão;
> Corrigir pequenos bugs
> Pequenos bugs de funcionamento:
> - Passagem do circuito adiante para implementação bidirecional do pipe; 
> - Gerenciamento de nós inativos; 
> - Gerenciar conexões repentinamente encerradas. 

Bibliografia
-------------
> - Onion Routing paper: https://www.onion-router.net/Publications/SSP-1997.pdf

> - Onion Routing: https://en.wikipedia.org/wiki/Onion_routing

> - Public-key Cryptography: https://en.wikipedia.org/wiki/Public-key_cryptography

> - npm node-rsa: https://www.npmjs.com/package/node-rsa

> - Wiki Tor: https://en.wikipedia.org/wiki/Tor_(anonymity_network)

> - Falando sobre p2p: http://www.brynosaurus.com/pub/net/p2pnat/

> - List of p2p applications: http://p2peducation.pbworks.com/w/page/8897427/FrontPage

> - Github falando sobre conceitos: https://gist.github.com/mildred/b803e48801f9cdd8a4a8

> - Wiki UDP: https://en.wikipedia.org/wiki/User_Datagram_Protocol

> Complementar:
> - Wiki DHT: https://en.wikipedia.org/wiki/Distributed_hash_table

> - Simple STUN schematic (random site): https://www.3cx.com/pbx/what-is-a-stun-server/

> - List of stun servers: https://gist.github.com/zziuni/3741933

> - Wiki STUN: https://en.wikipedia.org/wiki/STUN

> - UDP Hole Punching: https://en.wikipedia.org/wiki/UDP_hole_punching

> - npm vs-stun: https://www.npmjs.com/package/vs-stun

 
