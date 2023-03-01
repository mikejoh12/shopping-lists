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

type NewListItemReq struct {
	Name   		 string				`json:"name"`
	ListId		 string				`json:"listId"`
}

type ShoppingListsResource struct{}

func (rs ShoppingListsResource) Routes() chi.Router {
	r := chi.NewRouter()
	r.Use(jwtauth.Verifier(tokenAuth))
	r.Use(Authenticator)

	r.Post("/", rs.CreateList)
	r.Get("/", rs.GetLists)
	r.Delete("/{id}", rs.DeleteList)

	r.Route("/items", func(r chi.Router) {
		r.Post("/", rs.CreateListItem)
		r.Delete("/{id}", rs.DeleteListItem)
	})

	return r
}

// GetLists sends all shopping lists as a json response
func (rs ShoppingListsResource) GetLists(w http.ResponseWriter, r *http.Request) {
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

// CreateList creates a new shopping list from json data
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

	err = models.AddShoppingList(l.Name, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

// DeleteList deletes a shopping list from a list id in the URL params
func (rs ShoppingListsResource) DeleteList(w http.ResponseWriter, r *http.Request) {
	listId := chi.URLParam(r, "id")

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.RemoveList(listId, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// CreateListItem creates a new list item from json data
func (rs ShoppingListsResource) CreateListItem(w http.ResponseWriter, r *http.Request) {
	var itemData NewListItemReq
	if err := json.NewDecoder(r.Body).Decode(&itemData); err != nil {
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

	listId, err := primitive.ObjectIDFromHex(itemData.ListId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.AddListItem(itemData.Name, ownerId, listId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

// DeleteListItem deletes a list item based on the id
func (rs ShoppingListsResource) DeleteListItem(w http.ResponseWriter, r *http.Request) {
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