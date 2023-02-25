package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/mikejoh12/go-todo/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ShoppingListsResource struct{}

func (rs ShoppingListsResource) Routes() chi.Router {
	r := chi.NewRouter()
	r.Use(jwtauth.Verifier(tokenAuth))
	r.Use(jwtauth.Authenticator)

	r.Get("/items", rs.Get)

	r.Post("/", rs.CreateList) // Create a new list
	r.Post("/items", rs.CreateListItem) // Create a list item

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", rs.Delete)
	})

	return r
}

func (rs ShoppingListsResource) Get(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	objId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	
	items, err := models.AllShoppingLists(objId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(items); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
}

func (rs ShoppingListsResource) CreateList(w http.ResponseWriter, r *http.Request) {
	l := struct{Name string}{}
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	fmt.Println("Adding a new list. Name:", l.Name)
	err = models.AddShoppingList(l.Name, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (rs ShoppingListsResource) CreateListItem(w http.ResponseWriter, r *http.Request) {
	var t models.ListItem
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.AddListItem(t, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (rs ShoppingListsResource) Delete(w http.ResponseWriter, r *http.Request) {
	todoId := chi.URLParam(r, "id")

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.RemoveListItem(todoId, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}