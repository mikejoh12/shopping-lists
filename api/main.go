package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mikejoh12/go-todo/controllers"
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Mount("/api/auth", controllers.AuthResource{}.Routes())
	r.Mount("/api/users", controllers.UsersResource{}.Routes())
	r.Mount("/api/todos", controllers.TodosResource{}.Routes())

	http.ListenAndServe(":8080", r)
}