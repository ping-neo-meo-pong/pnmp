NAME = docker-compose.yml

all: $(NAME)
	docker-compose up -d --build
clean:
	docker-compose down --rmi all --volumes
	docker system prune --force --all
re: clean all

up:
	docker-compose up -d

down:
	docker-compose down

start:
	docker-compose start

stop:
	docker-compose stop

logs:
	docker-compose logs


.PHONY: all clean re up down start stop