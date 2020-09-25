# AI Virtual Labs Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.6.

## Istruzioni esecuzione
1. Run `npm install`
2. Run `npm run start-all`

## Come effettuare la push dell'immagine sul repository

1.  (Eseguire solo la prima volta)  Creare un nuovo token github seguendo le istruzioni [qui](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token), con il permesso di scrivere packages e salvalo in un file `~/GH_TOKEN.txt`.
1.  (Eseguire solo la prima volta) `cat ~/GH_TOKEN.txt | sudo docker login docker.pkg.github.com -u username_github --password-stdin`
1.  Cambiare nel file `angular.json` l'attributo `"proxyConfig": "proxy.conf.json"` in `"proxyConfig": "proxy.docker.conf.json"`
1. `sudo docker build -t docker.pkg.github.com/ai-poli-bllf/frontend/vl_frontend:VERSION .`
1. `sudo docker push docker.pkg.github.com/ai-poli-bllf/frontend/vl_frontend:VERSION`
