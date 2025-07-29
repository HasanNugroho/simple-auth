.PHONY: network env-be env-fe env-all up-be up-fe up-all down-be down-fe down-all restart-all logs-be logs-fe

network:
	docker network create app-network || echo "Network app-network already exists"

env-be:
	cp -n backend/.env.example backend/.env || echo ".env already exists in backend"

env-fe:
	cp -n frontend/.env.example frontend/.env || echo ".env already exists in frontend"

env-all: env-be env-fe
	@echo ".env files prepared"

up-be: network env-be
	cd backend && docker-compose up -d

up-fe: network env-fe
	cd frontend && docker-compose up -d

up-all: network env-all up-be up-fe
	@echo "All services are up"

down-be:
	cd backend && docker-compose down

down-fe:
	cd frontend && docker-compose down

down-all: down-be down-fe
	@echo "All services are down"

restart-all: down-all up-all

logs-be:
	cd backend && docker-compose logs -f

logs-fe:
	cd frontend && docker-compose logs -f
