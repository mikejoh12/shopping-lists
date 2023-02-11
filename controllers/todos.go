package controllers

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mikejoh12/go-todo/models"
	"github.com/mikejoh12/go-todo/view"
)

type TodosResource struct{}

// Routes creates a REST router for the todos resource
func (rs TodosResource) Routes() chi.Router {
	r := chi.NewRouter()
	// r.Use() // some middleware..

	r.Get("/", view.TodosView)
	r.Post("/", rs.Create)
	r.Get("/remove", rs.Delete)

	r.Route("/{id}", func(r chi.Router) {
		r.Put("/", rs.Update)
	})

	return r
}

func (rs TodosResource) Create(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("todo")
	fmt.Println("Adding a new todo. Name:", name)
	err := models.AddTodo(name)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func (rs TodosResource) Update(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("todo update"))
}

func (rs TodosResource) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	err := models.RemoveTodo(id)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
