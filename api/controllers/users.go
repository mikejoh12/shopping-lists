package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mikejoh12/go-todo/models"
)

type UsersResource struct{}

// Routes creates a REST router for the todos resource
func (rs UsersResource) Routes() chi.Router {
	r := chi.NewRouter()
	// r.Use() // some middleware..

	r.Get("/remove/", rs.Delete)

	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", rs.Get)       // GET /users/{id} - read a single user by :id
		r.Put("/", rs.Update)    // PUT /users/{id} - update a single user by :id
		r.Delete("/", rs.Delete) // DELETE /users/{id} - delete a single user by :id
	})

	return r
}

func (rs UsersResource) List(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("users list of stuff.."))
}

func (rs UsersResource) Create(w http.ResponseWriter, r *http.Request) {
	var u models.User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}

	fmt.Println("Adding a new user. Name:", u)
	err := models.AddUser(u)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (rs UsersResource) Get(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("user get"))
}

func (rs UsersResource) Update(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("user update"))
}

func (rs UsersResource) Delete(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("user delete"))
}