package controllers

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type AuthResource struct{}

func (rs AuthResource) Routes() chi.Router {
	r := chi.NewRouter()

	r.Post("/login", rs.Login)
	r.Post("/register", rs.Register)
	return r
}

func (rs AuthResource) Login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User is logging in")
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func (rs AuthResource) Register(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User is registering")
	http.Redirect(w, r, "/", http.StatusSeeOther)
}