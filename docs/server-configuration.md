# Server configuration

## Configure nginx

`sudo apt install nginx`

`sudo vim /etc/nginx/sites-available/starkynotes.ru.conf`

```nginx
server {
  listen 80;
  server_name starkynotes.ru;

  location / {
    proxy_pass http://127.0.0.1:8080;
  }

  location /hooks/ {
    proxy_pass http://127.0.0.1:9000;
  }
}
```

Create symlink:

`sudo ln -s /etc/nginx/sites-available/starkynotes.ru.conf /etc/nginx/sites-enabled/`

`sudo nginx -t`

`sudo systemctl reload nginx`

## Configure webhooks

`sudo apt install webhook`

`sudo vim ~/redeploy-host.sh`

```sh
#!/bin/sh

docker pull starkylife/starkynotes:latest
docker stop justnotes
docker system prune -f
docker run -dp 8080:8080 --name=justnotes starkylife/starkynotes:latest
```

`sudo mkdir ~/webhook`

`sudo vim ~/hooks.json`

```json
[
    {
        "id": "redeploy",
        "execute-command": "/home/starky/redeploy-host.sh",
        "command-working-directory": "/home/starky/webhook",
        "response-message": "Redeploying App."
    }
]
```

### Create system service for running webhooks detached

`sudo vim /etc/systemd/system/my-app-hooks.service`

```
[Unit]
Description=Webhooks Service
After=network.target
StartLimitIntervalSec=0
[Service]
Type=simple
User=root
ExecStart=webhook -hooks /home/starky/hooks.json -verbose
[Install]
WantedBy=multi-user.target
```

`sudo systemctl start my-app-hooks`

## Systemctl commands

`sudo systemctl status nginx`

`sudo systemctl stop nginx`

`sudo systemctl start nginx`

`sudo systemctl restart nginx`

`sudo systemctl reload nginx`


