build:
	cd ui && npm run build
	go build -o ../bin
build-and-run:
	make build
	godotenv -f .env ./bin/go-todo
run:
	godotenv -f .env go run . & cd ui && npm run start
deploy:
	cd ui && npm run build
	gcloud app deploy