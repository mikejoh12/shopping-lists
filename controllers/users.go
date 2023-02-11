package controllers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

type UsersResource struct{}

// Routes creates a REST router for the todos resource
func (rs UsersResource) Routes() chi.Router {
	r := chi.NewRouter()
	// r.Use() // some middleware..

	r.Post("/", rs.Create) // POST /users - create a new user and persist it
	r.Get("/remove/", rs.Delete)

	r.Route("/{id}", func(r chi.Router) {
		// r.Use(rs.TodoCtx) // lets have a users map, and lets actually load/manipulate
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
	w.Write([]byte("users create"))
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