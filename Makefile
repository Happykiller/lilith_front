start: 
	docker compose up -d

startall: 
	docker compose up --build -d

down:
	docker stop lilith_front

reset: down
	docker rm lilith_front

tar: 
	docker build -t lilith_front -f Dockerfile .
	docker save lilith_front -o lilith_front.tar

install:
	docker stop lilith_front
	docker rm lilith_front
	docker image rm lilith_front
	docker load -i lilith_front.tar
	docker run -d --restart=always -p 8080:80 --name lilith_front lilith_front

help:
	@echo ""
	@echo "~~ Lilith_front Makefile ~~"
	@echo ""
	@echo "\033[33m make start\033[39m    : Démarre le projet"
	@echo "\033[33m make startall\033[39m : Build et démarre le projet"
	@echo "\033[33m make down\033[39m     : Stop le projet"
	@echo "\033[33m make reset\033[39m    : Reset les containers, les volumes, les networks et les données local"
	@echo ""