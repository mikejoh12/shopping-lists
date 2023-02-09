package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mikejoh12/go-todo/config"
)

type todosResource struct{}

// Routes creates a REST router for the todos resource
func (rs todosResource) Routes() chi.Router {
	r := chi.NewRouter()
	// r.Use() // some middleware..

	r.Get("/", rs.List)
	r.Post("/", rs.Create)

	r.Route("/{id}", func(r chi.Router) {
		r.Put("/", rs.Update)
		r.Delete("/", rs.Delete)
	})

	return r
}

func (rs todosResource) List(w http.ResponseWriter, r *http.Request) {
	config.TPL.ExecuteTemplate(w, "todos.gohtml", nil)
}

func (rs todosResource) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Adding a new todo")
	http.Redirect(w, r, "/todos", http.StatusSeeOther)
}

func (rs todosResource) Update(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("todo update"))
}

func (rs todosResource) Delete(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("todo delete"))
}
