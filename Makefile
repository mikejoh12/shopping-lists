build:
	cd ui && npm run build
	cd api && go build -o ../bin
run:
	cd api && godotenv -f .env go run . & cd ui && npm run start