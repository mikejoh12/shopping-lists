package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mikejoh12/go-todo/controllers"
	"github.com/mikejoh12/go-todo/view"
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/", view.TodosView)
	r.Get("/login", view.Login)

	r.Mount("/auth", controllers.AuthResource{}.Routes())
	r.Mount("/users", controllers.UsersResource{}.Routes())
	r.Mount("/todos", controllers.TodosResource{}.Routes())

	http.ListenAndServe(":3333", r)
}