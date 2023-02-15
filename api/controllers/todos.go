package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mikejoh12/go-todo/models"
)

type TodosResource struct{}

// Routes creates a REST router for the todos resource
func (rs TodosResource) Routes() chi.Router {
	r := chi.NewRouter()
	// r.Use() // some middleware..

	r.Get("/", rs.Get)
	r.Post("/", rs.Create)
	r.Get("/remove", rs.Delete)

	r.Route("/{id}", func(r chi.Router) {
		r.Put("/", rs.Update)
		r.Delete("/", rs.Delete)
	})

	return r
}

func (rs TodosResource) Get(w http.ResponseWriter, r *http.Request) {
	todos, err := models.AllTodos()
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(todos); err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
}

func (rs TodosResource) Create(w http.ResponseWriter, r *http.Request) {
	var t models.Todo
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}

	fmt.Println("Adding a new todo. Name:", t.Name)
	err := models.AddTodo(t.Name)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (rs TodosResource) Update(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("todo update"))
}

func (rs TodosResource) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	err := models.RemoveTodo(id)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusNoContent)
}
