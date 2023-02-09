package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type authResource struct{}

func (rs authResource) Routes() chi.Router {
	r := chi.NewRouter()

	r.Post("/login", rs.Login) // POST /users - create a new user and persist it

	return r
}

func (rs authResource) Login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User is logging in")
	http.Redirect(w, r, "/todos", http.StatusSeeOther)
}